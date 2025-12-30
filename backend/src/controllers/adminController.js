const { User, Fund, Transaction, Portfolio, SIP, AuditLog } = require('../models');
const { Op } = require('sequelize');
const { cache } = require('../config/redis');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      kyc_status,
      risk_profile,
      is_active,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } },
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (kyc_status) where.kyc_status = kyc_status;
    if (risk_profile) where.risk_profile = risk_profile;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: [
        'id', 'username', 'email', 'first_name', 'last_name', 'phone',
        'kyc_status', 'risk_profile', 'is_active', 'is_admin',
        'created_at', 'last_login'
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order.toUpperCase()]],
      distinct: true
    });

    // Get additional stats for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const portfolioValue = await Portfolio.sum('current_value', {
        where: { user_id: user.id, is_active: true }
      });

      const transactionCount = await Transaction.count({
        where: { user_id: user.id }
      });

      const activeSIPs = await SIP.count({
        where: { user_id: user.id, status: 'ACTIVE' }
      });

      return {
        ...user.toJSON(),
        stats: {
          portfolio_value: parseFloat(portfolioValue || 0),
          transaction_count: transactionCount,
          active_sips: activeSIPs
        }
      };
    }));

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'VIEW_USERS',
      details: {
        filters: { search, kyc_status, risk_profile, is_active },
        results_count: count
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Portfolio,
          as: 'portfolios',
          include: [
            {
              model: Fund,
              as: 'fund',
              attributes: ['fund_name', 'fund_code', 'category']
            }
          ],
          limit: 10
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user statistics
    const [
      portfolioSummary,
      transactionSummary,
      sipSummary,
      watchlistCount
    ] = await Promise.all([
      Portfolio.findAll({
        where: { user_id: userId, is_active: true },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('total_investment')), 'total_investment'],
          [sequelize.fn('SUM', sequelize.col('current_value')), 'current_value'],
          [sequelize.fn('SUM', sequelize.col('unrealized_gain')), 'total_gain'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'holding_count']
        ]
      }),
      Transaction.findAll({
        where: { user_id: userId },
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_amount']
        ],
        group: ['type']
      }),
      SIP.findAll({
        where: { user_id: userId },
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
        ],
        group: ['status']
      }),
      (await require('../models/Watchlist')).count({
        where: { user_id: userId }
      })
    ]);

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'VIEW_USER_DETAILS',
      details: { user_id: userId },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        statistics: {
          portfolio: {
            total_investment: parseFloat(portfolioSummary[0]?.dataValues.total_investment || 0),
            current_value: parseFloat(portfolioSummary[0]?.dataValues.current_value || 0),
            total_gain: parseFloat(portfolioSummary[0]?.dataValues.total_gain || 0),
            holding_count: parseInt(portfolioSummary[0]?.dataValues.holding_count || 0)
          },
          transactions: transactionSummary.map(item => ({
            type: item.type,
            count: parseInt(item.dataValues.count),
            total_amount: parseFloat(item.dataValues.total_amount || 0)
          })),
          sips: sipSummary.map(item => ({
            status: item.status,
            count: parseInt(item.dataValues.count),
            total_amount: parseFloat(item.dataValues.total_amount || 0)
          })),
          watchlist_count: watchlistCount
        }
      }
    });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user details'
    });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { userId } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Store old values for audit
    const oldValues = {};
    Object.keys(updateData).forEach(key => {
      oldValues[key] = user[key];
    });

    // Remove restricted fields
    delete updateData.password;
    delete updateData.created_at;

    await user.update(updateData);

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'UPDATE_USER',
      details: {
        user_id: userId,
        old_values: oldValues,
        new_values: updateData
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    // Send notification email if KYC status changed
    if (updateData.kyc_status && updateData.kyc_status !== oldValues.kyc_status) {
      await sendEmail({
        to: user.email,
        subject: 'KYC Status Updated',
        template: 'kyc-status-updated',
        context: {
          name: user.first_name || user.username,
          old_status: oldValues.kyc_status,
          new_status: updateData.kyc_status,
          remarks: updateData.kyc_remarks || ''
        }
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
      message: 'User updated successfully'
    });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user has active investments
    const activePortfolio = await Portfolio.count({
      where: { user_id: userId, is_active: true }
    });

    const activeSIPs = await SIP.count({
      where: { user_id: userId, status: 'ACTIVE' }
    });

    if (activePortfolio > 0 || activeSIPs > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete user with active investments. Please redeem all investments first.'
      });
    }

    // Soft delete - mark as inactive
    await user.update({
      is_active: false,
      email: `${user.email}_deleted_${Date.now()}`,
      username: `${user.username}_deleted_${Date.now()}`
    });

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'DELETE_USER',
      details: {
        user_id: userId,
        reason: reason || 'Not specified'
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    // Send deletion notification
    await sendEmail({
      to: user.email,
      subject: 'Account Deactivated',
      template: 'account-deactivated',
      context: {
        name: user.first_name || user.username,
        reason: reason || 'Account deactivation request'
      }
    });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

// Manage funds (admin only)
exports.manageFunds = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { action } = req.params;
    const fundData = req.body;

    switch (action) {
      case 'create':
        return await createFund(req, res, fundData);
      case 'update':
        return await updateFund(req, res, fundData);
      case 'delete':
        return await deleteFund(req, res, fundData);
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }
  } catch (error) {
    logger.error('Manage funds error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to manage funds'
    });
  }
};

// Create fund
async function createFund(req, res, fundData) {
  try {
    // Validate required fields
    const requiredFields = ['fund_code', 'fund_name', 'fund_house', 'category', 'risk_level'];
    const missingFields = requiredFields.filter(field => !fundData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if fund code already exists
    const existingFund = await Fund.findOne({
      where: { fund_code: fundData.fund_code }
    });

    if (existingFund) {
      return res.status(400).json({
        success: false,
        error: 'Fund code already exists'
      });
    }

    // Create fund
    const fund = await Fund.create({
      ...fundData,
      nav_date: fundData.nav_date || new Date().toISOString().split('T')[0]
    });

    // Clear relevant caches
    await cache.clearPattern('fund:*');
    await cache.clearPattern('funds:*');

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'CREATE_FUND',
      details: {
        fund_id: fund.id,
        fund_code: fund.fund_code,
        fund_name: fund.fund_name
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.status(201).json({
      success: true,
      data: fund,
      message: 'Fund created successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Update fund
async function updateFund(req, res, fundData) {
  try {
    const { fundId } = req.params;

    const fund = await Fund.findByPk(fundId);
    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    // Store old values for audit
    const oldValues = {};
    Object.keys(fundData).forEach(key => {
      oldValues[key] = fund[key];
    });

    // Remove restricted fields
    delete fundData.created_at;

    await fund.update(fundData);

    // Clear relevant caches
    await cache.clearPattern(`fund:${fundId}`);
    await cache.clearPattern('funds:*');
    await cache.clearPattern('portfolio:*');

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'UPDATE_FUND',
      details: {
        fund_id: fundId,
        old_values: oldValues,
        new_values: fundData
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: fund,
      message: 'Fund updated successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Delete fund
async function deleteFund(req, res, fundData) {
  try {
    const { fundId } = req.params;

    const fund = await Fund.findByPk(fundId);
    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    // Check if fund has active investors
    const activeInvestors = await Portfolio.count({
      where: { fund_id: fundId, is_active: true }
    });

    if (activeInvestors > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete fund with active investors. Please mark as inactive instead.'
      });
    }

    // Soft delete - mark as inactive
    await fund.update({ is_active: false });

    // Clear relevant caches
    await cache.clearPattern(`fund:${fundId}`);
    await cache.clearPattern('funds:*');

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'DELETE_FUND',
      details: {
        fund_id: fundId,
        fund_code: fund.fund_code,
        fund_name: fund.fund_name
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: 'Fund marked as inactive successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Update NAV for fund
exports.updateFundNAV = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { fundId } = req.params;
    const { nav, nav_date } = req.body;

    const fund = await Fund.findByPk(fundId);
    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    // Validate NAV
    if (nav <= 0) {
      return res.status(400).json({
        success: false,
        error: 'NAV must be greater than 0'
      });
    }

    // Store old values
    const oldNAV = fund.nav;
    const oldNAVDate = fund.nav_date;

    // Calculate change
    const navChange = nav - oldNAV;
    const navChangePercentage = oldNAV > 0 ? (navChange / oldNAV) * 100 : 0;

    // Update fund NAV
    await fund.update({
      nav: nav,
      previous_nav: oldNAV,
      nav_date: nav_date || new Date().toISOString().split('T')[0],
      nav_change: navChange,
      nav_change_percentage: navChangePercentage
    });

    // Update all portfolio holdings for this fund
    const holdings = await Portfolio.findAll({
      where: { fund_id: fundId, is_active: true }
    });

    for (const holding of holdings) {
      const currentValue = holding.units_held * nav;
      const unrealizedGain = currentValue - holding.total_investment;
      const unrealizedGainPercentage = holding.total_investment > 0 
        ? (unrealizedGain / holding.total_investment) * 100 
        : 0;
      
      // Calculate day gain
      const previousValue = holding.units_held * oldNAV;
      const dayGain = currentValue - previousValue;
      const dayGainPercentage = previousValue > 0 ? (dayGain / previousValue) * 100 : 0;

      await holding.update({
        current_value: currentValue,
        unrealized_gain: unrealizedGain,
        unrealized_gain_percentage: unrealizedGainPercentage,
        day_gain: dayGain,
        day_gain_percentage: dayGainPercentage
      });

      // Clear user-specific caches
      await cache.clearPattern(`portfolio:*:${holding.user_id}`);
    }

    // Clear relevant caches
    await cache.clearPattern(`fund:${fundId}`);
    await cache.clearPattern('funds:*');

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'UPDATE_FUND_NAV',
      details: {
        fund_id: fundId,
        old_nav: oldNAV,
        new_nav: nav,
        change_percentage: navChangePercentage,
        nav_date: nav_date
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: {
        fund: fund.toJSON(),
        holdings_updated: holdings.length
      },
      message: 'NAV updated successfully'
    });
  } catch (error) {
    logger.error('Update fund NAV error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update NAV'
    });
  }
};

// Bulk update NAVs
exports.bulkUpdateNAVs = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { navUpdates } = req.body;

    if (!Array.isArray(navUpdates) || navUpdates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'NAV updates array is required'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const update of navUpdates) {
      try {
        const { fund_id, nav, nav_date } = update;

        const fund = await Fund.findByPk(fund_id);
        if (!fund) {
          results.failed.push({
            fund_id,
            error: 'Fund not found'
          });
          continue;
        }

        // Update NAV
        const oldNAV = fund.nav;
        const navChange = nav - oldNAV;
        const navChangePercentage = oldNAV > 0 ? (navChange / oldNAV) * 100 : 0;

        await fund.update({
          nav: nav,
          previous_nav: oldNAV,
          nav_date: nav_date || new Date().toISOString().split('T')[0],
          nav_change: navChange,
          nav_change_percentage: navChangePercentage
        });

        // Update portfolio holdings
        const holdings = await Portfolio.findAll({
          where: { fund_id: fund_id, is_active: true }
        });

        for (const holding of holdings) {
          const currentValue = holding.units_held * nav;
          const unrealizedGain = currentValue - holding.total_investment;
          const unrealizedGainPercentage = holding.total_investment > 0 
            ? (unrealizedGain / holding.total_investment) * 100 
            : 0;
          
          const previousValue = holding.units_held * oldNAV;
          const dayGain = currentValue - previousValue;
          const dayGainPercentage = previousValue > 0 ? (dayGain / previousValue) * 100 : 0;

          await holding.update({
            current_value: currentValue,
            unrealized_gain: unrealizedGain,
            unrealized_gain_percentage: unrealizedGainPercentage,
            day_gain: dayGain,
            day_gain_percentage: dayGainPercentage
          });

          // Clear user caches
          await cache.clearPattern(`portfolio:*:${holding.user_id}`);
        }

        // Clear fund caches
        await cache.clearPattern(`fund:${fund_id}`);

        results.success.push({
          fund_id,
          fund_name: fund.fund_name,
          old_nav: oldNAV,
          new_nav: nav,
          change_percentage: navChangePercentage,
          holdings_updated: holdings.length
        });
      } catch (error) {
        results.failed.push({
          fund_id: update.fund_id,
          error: error.message
        });
      }
    }

    // Clear general caches
    await cache.clearPattern('funds:*');

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'BULK_UPDATE_NAVS',
      details: {
        total_updates: navUpdates.length,
        successful: results.success.length,
        failed: results.failed.length
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      data: results,
      message: `Bulk NAV update completed. Success: ${results.success.length}, Failed: ${results.failed.length}`
    });
  } catch (error) {
    logger.error('Bulk update NAVs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk update NAVs'
    });
  }
};

// Get system monitoring data
exports.getSystemMonitoring = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const cacheKey = 'system_monitoring';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Database health check
    const dbHealth = await checkDatabaseHealth();

    // Redis health check
    const redisHealth = await checkRedisHealth();

    // System statistics
    const systemStats = {
      uptime: process.uptime(),
      memory_usage: process.memoryUsage(),
      node_version: process.version,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    // Application statistics
    const appStats = {
      total_users: await User.count(),
      active_users: await User.count({
        where: {
          last_login: {
            [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        }
      }),
      total_funds: await Fund.count(),
      active_funds: await Fund.count({ where: { is_active: true } }),
      total_transactions: await Transaction.count(),
      pending_transactions: await Transaction.count({ where: { status: 'PENDING' } }),
      active_sips: await SIP.count({ where: { status: 'ACTIVE' } })
    };

    // Recent errors from logs (simplified - would query actual log storage)
    const recentErrors = await getRecentErrors();

    const monitoringData = {
      health: {
        database: dbHealth,
        redis: redisHealth,
        api: 'healthy',
        overall: dbHealth.status === 'healthy' && redisHealth.status === 'healthy' ? 'healthy' : 'degraded'
      },
      system: systemStats,
      application: appStats,
      recent_errors: recentErrors,
      performance_metrics: await getPerformanceMetrics()
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, monitoringData, 300);

    res.json({
      success: true,
      data: monitoringData
    });
  } catch (error) {
    logger.error('Get system monitoring error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system monitoring data'
    });
  }
};

// Get audit logs
exports.getAuditLogs = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const {
      page = 1,
      limit = 50,
      user_id,
      action,
      start_date,
      end_date,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (user_id) where.user_id = user_id;
    if (action) where.action = action;
    if (start_date || end_date) {
      where.created_at = {};
      if (start_date) where.created_at[Op.gte] = start_date;
      if (end_date) where.created_at[Op.lte] = end_date;
    }

    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'is_admin']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_order.toUpperCase()]],
      distinct: true
    });

    res.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          ...log.toJSON(),
          user: log.user?.toJSON()
        })),
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit logs'
    });
  }
};

// Export data
exports.exportData = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { type, format = 'csv', start_date, end_date } = req.query;

    let data;
    let filename;

    switch (type) {
      case 'users':
        data = await exportUsers(start_date, end_date);
        filename = 'users_export';
        break;
      case 'transactions':
        data = await exportTransactions(start_date, end_date);
        filename = 'transactions_export';
        break;
      case 'funds':
        data = await exportFunds();
        filename = 'funds_export';
        break;
      case 'portfolio':
        data = await exportPortfolio(start_date, end_date);
        filename = 'portfolio_export';
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid export type'
        });
    }

    // Create audit log
    await AuditLog.create({
      user_id: req.user.id,
      action: 'EXPORT_DATA',
      details: {
        type,
        format,
        start_date,
        end_date
      },
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    });

    if (format === 'csv') {
      const csvData = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}_${Date.now()}.csv`);
      return res.send(csvData);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}_${Date.now()}.json`);
      return res.json(data);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported export format'
      });
    }
  } catch (error) {
    logger.error('Export data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export data'
    });
  }
};

// Helper functions
async function checkDatabaseHealth() {
  try {
    await require('../config/database').sequelize.authenticate();
    return {
      status: 'healthy',
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function checkRedisHealth() {
  try {
    const { redisClient } = require('../config/redis');
    await redisClient.ping();
    return {
      status: 'healthy',
      message: 'Redis connection successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function getRecentErrors() {
  // This would query your error log storage
  // For now, return empty array
  return [];
}

async function getPerformanceMetrics() {
  // This would collect performance metrics
  return {
    response_time_avg: '125ms',
    request_per_minute: 45,
    error_rate: '0.2%',
    database_query_time: '85ms'
  };
}

async function exportUsers(startDate, endDate) {
  const where = {};
  
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = startDate;
    if (endDate) where.created_at[Op.lte] = endDate;
  }

  const users = await User.findAll({
    where,
    attributes: [
      'id', 'username', 'email', 'first_name', 'last_name', 'phone',
      'date_of_birth', 'pan_number', 'kyc_status', 'risk_profile',
      'investment_experience', 'annual_income', 'is_active', 'is_admin',
      'created_at', 'last_login'
    ],
    order: [['created_at', 'DESC']]
  });

  return users;
}

async function exportTransactions(startDate, endDate) {
  const where = {};
  
  if (startDate || endDate) {
    where.transaction_date = {};
    if (startDate) where.transaction_date[Op.gte] = startDate;
    if (endDate) where.transaction_date[Op.lte] = endDate;
  }

  const transactions = await Transaction.findAll({
    where,
    include: [
      {
        model: Fund,
        as: 'fund',
        attributes: ['fund_name', 'fund_code']
      },
      {
        model: User,
        as: 'user',
        attributes: ['email', 'username']
      }
    ],
    order: [['transaction_date', 'DESC']]
  });

  return transactions;
}

async function exportFunds() {
  const funds = await Fund.findAll({
    attributes: [
      'id', 'fund_code', 'fund_name', 'fund_house', 'category',
      'sub_category', 'risk_level', 'nav', 'nav_date', 'aum',
      'expense_ratio', 'minimum_investment', 'sip_minimum',
      'rating', 'inception_date', 'is_active', 'created_at'
    ],
    order: [['fund_name', 'ASC']]
  });

  return funds;
}

async function exportPortfolio(startDate, endDate) {
  const where = {};
  
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = startDate;
    if (endDate) where.created_at[Op.lte] = endDate;
  }

  const portfolio = await Portfolio.findAll({
    where,
    include: [
      {
        model: Fund,
        as: 'fund',
        attributes: ['fund_name', 'fund_code', 'fund_house']
      },
      {
        model: User,
        as: 'user',
        attributes: ['email', 'username']
      }
    ],
    order: [['created_at', 'DESC']]
  });

  return portfolio;
}

function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0].toJSON ? data[0].toJSON() : data[0]);
  const rows = data.map(item => {
    const obj = item.toJSON ? item.toJSON() : item;
    return headers.map(header => {
      const value = obj[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).replace(/"/g, '""');
    });
  });

  return [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
}