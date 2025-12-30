const { Fund, Portfolio, Watchlist, Transaction } = require('../models');
const { Op } = require('sequelize');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');

// Get all funds with filters
exports.getAllFunds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      fund_house,
      risk_level,
      search,
      sort_by = 'fund_name',
      sort_order = 'ASC',
      min_rating,
      min_aum,
      max_expense_ratio
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { is_active: true };

    // Apply filters
    if (category) where.category = category;
    if (fund_house) where.fund_house = fund_house;
    if (risk_level) where.risk_level = risk_level;
    if (min_rating) where.rating = { [Op.gte]: min_rating };
    if (min_aum) where.aum = { [Op.gte]: min_aum };
    if (max_expense_ratio) where.expense_ratio = { [Op.lte]: max_expense_ratio };

    // Search functionality
    if (search) {
      where[Op.or] = [
        { fund_name: { [Op.iLike]: `%${search}%` } },
        { fund_code: { [Op.iLike]: `%${search}%` } },
        { fund_house: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Sorting
    const order = [[sort_by, sort_order.toUpperCase()]];

    const { count, rows: funds } = await Fund.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      attributes: {
        exclude: ['created_at', 'updated_at']
      }
    });

    // Cache popular queries
    const cacheKey = `funds:${JSON.stringify(req.query)}`;
    await cache.set(cacheKey, { funds, count, page, limit }, 300); // 5 minutes

    res.json({
      success: true,
      data: {
        funds,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get all funds error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch funds'
    });
  }
};

// Get fund by ID
exports.getFundById = async (req, res) => {
  try {
    const { id } = req.params;

    const cacheKey = `fund:${id}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const fund = await Fund.findByPk(id, {
      include: [
        {
          model: Portfolio,
          as: 'portfolios',
          attributes: ['id', 'units_held', 'current_value'],
          limit: 5
        }
      ]
    });

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    // Add user-specific data if authenticated
    if (req.user) {
      const userPortfolio = await Portfolio.findOne({
        where: {
          user_id: req.user.id,
          fund_id: id
        }
      });

      const userWatchlist = await Watchlist.findOne({
        where: {
          user_id: req.user.id,
          fund_id: id
        }
      });

      fund.dataValues.user_data = {
        in_portfolio: !!userPortfolio,
        in_watchlist: !!userWatchlist,
        portfolio_data: userPortfolio || null
      };
    }

    // Cache for 1 hour
    await cache.set(cacheKey, fund.toJSON(), 3600);

    res.json({
      success: true,
      data: fund
    });
  } catch (error) {
    logger.error('Get fund by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund details'
    });
  }
};

// Get fund performance
exports.getFundPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = '1y' } = req.query;

    const cacheKey = `fund_performance:${id}:${period}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const fund = await Fund.findByPk(id, {
      attributes: ['id', 'fund_name', 'returns', 'nav', 'nav_date', 'benchmark']
    });

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    // Get NAV history (this would come from a separate NAV table)
    const navHistory = await getNAVHistory(fund.id, period);

    // Calculate performance metrics
    const performance = {
      fund: {
        id: fund.id,
        name: fund.fund_name,
        current_nav: fund.nav,
        last_updated: fund.nav_date
      },
      returns: fund.returns,
      nav_history: navHistory,
      metrics: calculatePerformanceMetrics(navHistory),
      benchmark_comparison: compareWithBenchmark(fund, period)
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, performance, 300);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    logger.error('Get fund performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund performance'
    });
  }
};

// Compare multiple funds
exports.compareFunds = async (req, res) => {
  try {
    const { fund_ids } = req.body;

    if (!fund_ids || !Array.isArray(fund_ids) || fund_ids.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least two fund IDs to compare'
      });
    }

    // Limit to 5 funds for comparison
    const ids = fund_ids.slice(0, 5);

    const cacheKey = `fund_compare:${ids.join('_')}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const funds = await Fund.findAll({
      where: {
        id: ids,
        is_active: true
      },
      attributes: [
        'id',
        'fund_code',
        'fund_name',
        'fund_house',
        'category',
        'risk_level',
        'nav',
        'nav_change_percentage',
        'aum',
        'expense_ratio',
        'returns',
        'rating',
        'inception_date'
      ]
    });

    if (funds.length < 2) {
      return res.status(404).json({
        success: false,
        error: 'Could not find funds to compare'
      });
    }

    // Get comparison data
    const comparison = {
      funds: funds.map(fund => fund.toJSON()),
      comparison_points: [
        {
          key: 'nav',
          label: 'Current NAV',
          values: funds.map(f => f.nav)
        },
        {
          key: 'expense_ratio',
          label: 'Expense Ratio',
          values: funds.map(f => f.expense_ratio)
        },
        {
          key: 'aum',
          label: 'AUM (in Crores)',
          values: funds.map(f => f.aum)
        },
        {
          key: 'rating',
          label: 'Rating',
          values: funds.map(f => f.rating)
        },
        {
          key: 'risk_level',
          label: 'Risk Level',
          values: funds.map(f => f.risk_level)
        }
      ],
      returns_comparison: compareReturns(funds)
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, comparison, 300);

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    logger.error('Compare funds error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare funds'
    });
  }
};

// Fund screener
exports.fundScreener = async (req, res) => {
  try {
    const {
      categories = [],
      risk_levels = [],
      min_rating,
      max_expense_ratio,
      min_aum,
      min_1y_return,
      max_1y_return,
      fund_houses = [],
      sort_by = 'rating',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.body;

    const offset = (page - 1) * limit;
    const where = { is_active: true };

    // Build filters
    if (categories.length > 0) {
      where.category = { [Op.in]: categories };
    }

    if (risk_levels.length > 0) {
      where.risk_level = { [Op.in]: risk_levels };
    }

    if (fund_houses.length > 0) {
      where.fund_house = { [Op.in]: fund_houses };
    }

    if (min_rating) {
      where.rating = { [Op.gte]: min_rating };
    }

    if (max_expense_ratio) {
      where.expense_ratio = { [Op.lte]: max_expense_ratio };
    }

    if (min_aum) {
      where.aum = { [Op.gte]: min_aum };
    }

    // Returns filtering (assuming returns is a JSONB column)
    if (min_1y_return || max_1y_return) {
      where.returns = {};
      if (min_1y_return) where.returns['1y'] = { [Op.gte]: min_1y_return };
      if (max_1y_return) {
        where.returns['1y'] = { ...where.returns['1y'], [Op.lte]: max_1y_return };
      }
    }

    const order = [[sort_by, sort_order.toUpperCase()]];

    const { count, rows: funds } = await Fund.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      attributes: {
        exclude: ['created_at', 'updated_at']
      }
    });

    res.json({
      success: true,
      data: {
        funds,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        },
        filters_applied: {
          categories,
          risk_levels,
          min_rating,
          max_expense_ratio,
          min_aum,
          min_1y_return,
          max_1y_return,
          fund_houses
        }
      }
    });
  } catch (error) {
    logger.error('Fund screener error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to screen funds'
    });
  }
};

// Get fund categories
exports.getFundCategories = async (req, res) => {
  try {
    const cacheKey = 'fund_categories';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const categories = await Fund.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'fund_count'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
        [sequelize.fn('AVG', sequelize.col('returns->>\'1y\'')), 'avg_1y_return']
      ],
      group: ['category'],
      where: { is_active: true },
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    const result = categories.map(cat => ({
      category: cat.category,
      fund_count: parseInt(cat.dataValues.fund_count),
      avg_rating: parseFloat(cat.dataValues.avg_rating || 0),
      avg_1y_return: parseFloat(cat.dataValues.avg_1y_return || 0)
    }));

    // Cache for 1 day
    await cache.set(cacheKey, result, 86400);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get fund categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund categories'
    });
  }
};

// Get fund houses
exports.getFundHouses = async (req, res) => {
  try {
    const cacheKey = 'fund_houses';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const fundHouses = await Fund.findAll({
      attributes: [
        'fund_house',
        [sequelize.fn('COUNT', sequelize.col('id')), 'fund_count'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
        [sequelize.fn('SUM', sequelize.col('aum')), 'total_aum']
      ],
      group: ['fund_house'],
      where: { is_active: true },
      order: [[sequelize.fn('SUM', sequelize.col('aum')), 'DESC']]
    });

    const result = fundHouses.map(house => ({
      fund_house: house.fund_house,
      fund_count: parseInt(house.dataValues.fund_count),
      avg_rating: parseFloat(house.dataValues.avg_rating || 0),
      total_aum: parseFloat(house.dataValues.total_aum || 0)
    }));

    // Cache for 1 day
    await cache.set(cacheKey, result, 86400);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get fund houses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund houses'
    });
  }
};

// Helper functions
async function getNAVHistory(fundId, period) {
  // This would query a separate NAV history table
  // For now, return mock data
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nav: 100 + Math.random() * 10
  })).reverse();
}

function calculatePerformanceMetrics(navHistory) {
  if (navHistory.length < 2) return null;

  const firstNav = navHistory[0].nav;
  const lastNav = navHistory[navHistory.length - 1].nav;
  const returns = ((lastNav - firstNav) / firstNav) * 100;

  // Calculate volatility
  const navs = navHistory.map(h => h.nav);
  const avg = navs.reduce((a, b) => a + b, 0) / navs.length;
  const variance = navs.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / navs.length;
  const volatility = Math.sqrt(variance);

  return {
    total_return: returns,
    annualized_return: returns * (365 / navHistory.length),
    volatility: volatility,
    sharpe_ratio: returns / volatility || 0
  };
}

function compareWithBenchmark(fund, period) {
  // Mock benchmark comparison
  const benchmarkReturns = {
    '1y': 12.5,
    '3y': 10.8,
    '5y': 9.2
  };

  const fundReturns = fund.returns || {};
  const periodKey = period === '1y' ? '1y' : period === '3y' ? '3y' : '5y';

  return {
    benchmark_return: benchmarkReturns[periodKey] || 0,
    fund_return: fundReturns[periodKey] || 0,
    outperformance: (fundReturns[periodKey] || 0) - (benchmarkReturns[periodKey] || 0)
  };
}

function compareReturns(funds) {
  const periods = ['1d', '1w', '1m', '3m', '6m', '1y', '3y', '5y'];
  
  return periods.map(period => ({
    period,
    values: funds.map(fund => fund.returns?.[period] || 0)
  }));
}