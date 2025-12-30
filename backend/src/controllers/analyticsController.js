const { User, Fund, Transaction, Portfolio, SIP } = require('../models');
const { Op } = require('sequelize');
const { cache } = require('../config/redis');
const logger = require('../utils/logger');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `dashboard_stats:${userId}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Get user's portfolio summary
    const portfolioSummary = await Portfolio.findAll({
      where: { user_id: userId, is_active: true },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('total_investment')), 'total_investment'],
        [sequelize.fn('SUM', sequelize.col('current_value')), 'current_value'],
        [sequelize.fn('SUM', sequelize.col('unrealized_gain')), 'total_gain'],
        [sequelize.fn('SUM', sequelize.col('day_gain')), 'day_gain']
      ]
    });

    // Get recent transactions
    const recentTransactions = await Transaction.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['fund_name', 'fund_code']
        }
      ],
      limit: 5,
      order: [['created_at', 'DESC']]
    });

    // Get active SIPs
    const activeSIPs = await SIP.count({
      where: { user_id: userId, status: 'ACTIVE' }
    });

    // Get watchlist count
    const watchlistCount = await (await require('../models/Watchlist')).count({
      where: { user_id: userId }
    });

    // Get portfolio alerts
    const alerts = await generatePortfolioAlerts(userId);

    const stats = {
      portfolio: {
        total_investment: parseFloat(portfolioSummary[0]?.dataValues.total_investment || 0),
        current_value: parseFloat(portfolioSummary[0]?.dataValues.current_value || 0),
        total_gain: parseFloat(portfolioSummary[0]?.dataValues.total_gain || 0),
        day_gain: parseFloat(portfolioSummary[0]?.dataValues.day_gain || 0)
      },
      recent_transactions: recentTransactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.total_amount,
        fund_name: t.fund?.fund_name,
        date: t.transaction_date,
        status: t.status
      })),
      counts: {
        active_sips: activeSIPs,
        watchlist_items: watchlistCount,
        portfolio_holdings: portfolioSummary.length
      },
      alerts: alerts,
      market_overview: await getMarketOverview()
    };

    // Calculate gain percentage
    if (stats.portfolio.total_investment > 0) {
      stats.portfolio.total_gain_percentage = (stats.portfolio.total_gain / stats.portfolio.total_investment) * 100;
    } else {
      stats.portfolio.total_gain_percentage = 0;
    }

    // Cache for 5 minutes
    await cache.set(cacheKey, stats, 300);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get user growth analytics (admin only)
exports.getUserGrowth = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { period = 'monthly', start_date, end_date } = req.query;

    const cacheKey = `user_growth:${period}:${start_date || ''}:${end_date || ''}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    let groupBy;
    let dateFormat;

    switch (period) {
      case 'daily':
        groupBy = 'DATE(created_at)';
        dateFormat = '%Y-%m-%d';
        break;
      case 'weekly':
        groupBy = 'DATE_TRUNC(\'week\', created_at)';
        dateFormat = 'YYYY-"W"IW';
        break;
      case 'monthly':
      default:
        groupBy = 'DATE_TRUNC(\'month\', created_at)';
        dateFormat = 'YYYY-MM';
        break;
    }

    const userGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('created_at')), 'period'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'new_users'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN kyc_status = \'VERIFIED\' THEN 1 ELSE 0 END')), 'verified_users']
      ],
      where: {
        ...(start_date && { created_at: { [Op.gte]: start_date } }),
        ...(end_date && { created_at: { [Op.lte]: end_date } })
      },
      group: [sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('created_at')), 'ASC']],
      raw: true
    });

    // Calculate cumulative totals
    let totalUsers = 0;
    let totalVerified = 0;
    const growthData = userGrowth.map(item => {
      totalUsers += parseInt(item.new_users);
      totalVerified += parseInt(item.verified_users);
      return {
        period: item.period,
        new_users: parseInt(item.new_users),
        verified_users: parseInt(item.verified_users),
        cumulative_users: totalUsers,
        cumulative_verified: totalVerified,
        verification_rate: totalUsers > 0 ? (totalVerified / totalUsers) * 100 : 0
      };
    });

    const result = {
      period,
      data: growthData,
      totals: {
        total_users: totalUsers,
        total_verified: totalVerified,
        verification_rate: totalUsers > 0 ? (totalVerified / totalUsers) * 100 : 0
      }
    };

    // Cache for 1 hour
    await cache.set(cacheKey, result, 3600);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get user growth error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user growth analytics'
    });
  }
};

// Get transaction volume analytics
exports.getTransactionVolume = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { period = 'monthly', type, start_date, end_date } = req.query;

    const cacheKey = `transaction_volume:${period}:${type || 'all'}:${start_date || ''}:${end_date || ''}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const where = {
      status: 'COMPLETED',
      ...(type && { type }),
      ...(start_date && { transaction_date: { [Op.gte]: start_date } }),
      ...(end_date && { transaction_date: { [Op.lte]: end_date } })
    };

    const transactionVolume = await Transaction.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('transaction_date')), 'period'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_volume'],
        [sequelize.fn('AVG', sequelize.col('total_amount')), 'avg_ticket_size']
      ],
      where,
      group: [sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('transaction_date'))],
      order: [[sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('transaction_date')), 'ASC']],
      raw: true
    });

    // Get transaction type breakdown
    const typeBreakdown = await Transaction.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'volume']
      ],
      where: {
        ...(start_date && { transaction_date: { [Op.gte]: start_date } }),
        ...(end_date && { transaction_date: { [Op.lte]: end_date } })
      },
      group: ['type'],
      raw: true
    });

    const result = {
      period,
      volume_data: transactionVolume.map(item => ({
        period: item.period,
        transaction_count: parseInt(item.transaction_count),
        total_volume: parseFloat(item.total_volume || 0),
        avg_ticket_size: parseFloat(item.avg_ticket_size || 0)
      })),
      type_breakdown: typeBreakdown.map(item => ({
        type: item.type,
        count: parseInt(item.count),
        volume: parseFloat(item.volume || 0),
        percentage: typeBreakdown.reduce((sum, i) => sum + parseFloat(i.volume || 0), 0) > 0 
          ? (parseFloat(item.volume || 0) / typeBreakdown.reduce((sum, i) => sum + parseFloat(i.volume || 0), 0)) * 100 
          : 0
      })),
      summary: {
        total_transactions: transactionVolume.reduce((sum, item) => sum + parseInt(item.transaction_count), 0),
        total_volume: transactionVolume.reduce((sum, item) => sum + parseFloat(item.total_volume || 0), 0),
        avg_daily_volume: transactionVolume.length > 0 
          ? transactionVolume.reduce((sum, item) => sum + parseFloat(item.total_volume || 0), 0) / transactionVolume.length 
          : 0
      }
    };

    // Cache for 30 minutes
    await cache.set(cacheKey, result, 1800);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get transaction volume error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction volume analytics'
    });
  }
};

// Get fund analytics
exports.getFundAnalytics = async (req, res) => {
  try {
    const cacheKey = 'fund_analytics';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Get top performing funds
    const topPerformingFunds = await Fund.findAll({
      where: { is_active: true },
      attributes: [
        'id', 'fund_name', 'fund_code', 'fund_house', 'category', 
        'nav', 'nav_change_percentage', 'returns->1y', 'rating'
      ],
      order: [[sequelize.literal('returns->>\'1y\' DESC NULLS LAST')]],
      limit: 10
    });

    // Get most popular funds (by number of investors)
    const popularFunds = await Portfolio.findAll({
      attributes: [
        'fund_id',
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'investor_count'],
        [sequelize.fn('SUM', sequelize.col('current_value')), 'total_investment']
      ],
      group: ['fund_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('user_id')), 'DESC']],
      limit: 10,
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['fund_name', 'fund_code', 'fund_house', 'category']
        }
      ]
    });

    // Get category performance
    const categoryPerformance = await Fund.findAll({
      where: { is_active: true },
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'fund_count'],
        [sequelize.fn('AVG', sequelize.literal('returns->>\'1y\'')), 'avg_1y_return'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']
      ],
      group: ['category'],
      order: [[sequelize.fn('AVG', sequelize.literal('returns->>\'1y\'')), 'DESC']]
    });

    const result = {
      top_performing_funds: topPerformingFunds.map(fund => ({
        ...fund.toJSON(),
        one_year_return: fund['returns']?.['1y'] || 0
      })),
      popular_funds: popularFunds.map(item => ({
        fund_id: item.fund_id,
        fund_name: item.fund?.fund_name,
        fund_code: item.fund?.fund_code,
        investor_count: parseInt(item.dataValues.investor_count),
        total_investment: parseFloat(item.dataValues.total_investment || 0)
      })),
      category_performance: categoryPerformance.map(item => ({
        category: item.category,
        fund_count: parseInt(item.dataValues.fund_count),
        avg_1y_return: parseFloat(item.dataValues.avg_1y_return || 0),
        avg_rating: parseFloat(item.dataValues.avg_rating || 0)
      })),
      market_insights: await getMarketInsights()
    };

    // Cache for 1 hour
    await cache.set(cacheKey, result, 3600);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get fund analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fund analytics'
    });
  }
};

// Get portfolio insights
exports.getPortfolioInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `portfolio_insights:${userId}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const holdings = await Portfolio.findAll({
      where: { user_id: userId, is_active: true },
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['id', 'fund_name', 'category', 'risk_level', 'returns']
        }
      ]
    });

    if (holdings.length === 0) {
      return res.json({
        success: true,
        data: {
          insights: [],
          recommendations: []
        }
      });
    }

    // Calculate portfolio metrics
    const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);
    const totalGain = holdings.reduce((sum, h) => sum + (h.unrealized_gain || 0), 0);
    const gainPercentage = holdings.reduce((sum, h) => sum + (h.total_investment || 0), 0) > 0 
      ? (totalGain / holdings.reduce((sum, h) => sum + (h.total_investment || 0), 0)) * 100 
      : 0;

    // Generate insights
    const insights = [
      {
        type: 'PERFORMANCE',
        title: 'Portfolio Performance',
        value: `${gainPercentage.toFixed(2)}%`,
        description: gainPercentage > 0 ? 'Your portfolio is performing well' : 'Consider reviewing your investments',
        trend: gainPercentage > 0 ? 'up' : 'down'
      },
      {
        type: 'DIVERSIFICATION',
        title: 'Diversification Score',
        value: calculateDiversificationScore(holdings),
        description: 'Measures how well your portfolio is diversified',
        trend: 'neutral'
      },
      {
        type: 'RISK',
        title: 'Risk Level',
        value: calculatePortfolioRiskLevel(holdings),
        description: 'Based on your fund selections and allocations',
        trend: 'neutral'
      },
      {
        type: 'CONSISTENCY',
        title: 'Investment Consistency',
        value: calculateConsistencyScore(userId),
        description: 'Measures regularity of your investments',
        trend: 'up'
      }
    ];

    // Generate recommendations
    const recommendations = generatePortfolioRecommendations(holdings, userId);

    const result = {
      insights,
      recommendations,
      summary: {
        total_value: totalValue,
        total_gain: totalGain,
        gain_percentage: gainPercentage,
        holding_count: holdings.length,
        asset_classes: [...new Set(holdings.map(h => h.fund?.category))].length
      }
    };

    // Cache for 2 hours
    await cache.set(cacheKey, result, 7200);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get portfolio insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio insights'
    });
  }
};

// Get risk distribution
exports.getRiskDistribution = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `risk_distribution:${userId}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const holdings = await Portfolio.findAll({
      where: { user_id: userId, is_active: true },
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['risk_level']
        }
      ]
    });

    const riskDistribution = holdings.reduce((acc, holding) => {
      const riskLevel = holding.fund?.risk_level || 'Moderate';
      const value = holding.current_value || 0;
      
      if (!acc[riskLevel]) {
        acc[riskLevel] = {
          risk_level: riskLevel,
          value: 0,
          percentage: 0,
          holdings: 0
        };
      }
      
      acc[riskLevel].value += value;
      acc[riskLevel].holdings += 1;
      return acc;
    }, {});

    const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);

    // Calculate percentages
    Object.values(riskDistribution).forEach(item => {
      item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    });

    // Get user's risk profile
    const user = await User.findByPk(userId);
    const recommendedDistribution = getRecommendedRiskDistribution(user.risk_profile);

    const result = {
      current_distribution: Object.values(riskDistribution).sort((a, b) => b.value - a.value),
      recommended_distribution: recommendedDistribution,
      risk_assessment: assessRiskAlignment(riskDistribution, recommendedDistribution),
      total_value: totalValue
    };

    // Cache for 4 hours
    await cache.set(cacheKey, result, 14400);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get risk distribution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch risk distribution'
    });
  }
};

// Get market trends
exports.getMarketTrends = async (req, res) => {
  try {
    const cacheKey = 'market_trends';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // This would typically fetch from market data APIs
    // For now, return mock data
    const marketTrends = {
      nifty_50: {
        current: 19850.75,
        change: 125.50,
        change_percentage: 0.64,
        trend: 'up'
      },
      sensex: {
        current: 66500.25,
        change: 350.75,
        change_percentage: 0.53,
        trend: 'up'
      },
      sector_performance: [
        { sector: 'Technology', change: 2.1 },
        { sector: 'Banking', change: 1.5 },
        { sector: 'Pharma', change: 0.8 },
        { sector: 'Auto', change: -0.5 },
        { sector: 'Energy', change: -1.2 }
      ],
      top_gainers: [
        { name: 'HDFC Equity Fund', change: 3.2 },
        { name: 'ICICI Prudential Bluechip', change: 2.8 },
        { name: 'SBI Focused Equity', change: 2.5 }
      ],
      top_losers: [
        { name: 'Kotak Emerging Equity', change: -1.8 },
        { name: 'Aditya Birla Sun Life Frontline', change: -1.5 },
        { name: 'Nippon India Large Cap', change: -1.2 }
      ],
      market_sentiment: 'BULLISH',
      volatility_index: 12.5
    };

    // Cache for 15 minutes
    await cache.set(cacheKey, marketTrends, 900);

    res.json({
      success: true,
      data: marketTrends
    });
  } catch (error) {
    logger.error('Get market trends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market trends'
    });
  }
};

// Get sector performance
exports.getSectorPerformance = async (req, res) => {
  try {
    const cacheKey = 'sector_performance';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // This would analyze fund holdings to determine sector performance
    // For now, return mock data
    const sectorPerformance = [
      { sector: 'Technology', allocation: 25.5, performance: 2.1 },
      { sector: 'Financial Services', allocation: 22.8, performance: 1.5 },
      { sector: 'Healthcare', allocation: 15.2, performance: 0.8 },
      { sector: 'Consumer Goods', allocation: 12.4, performance: 0.3 },
      { sector: 'Automobile', allocation: 8.7, performance: -0.5 },
      { sector: 'Energy', allocation: 6.3, performance: -1.2 },
      { sector: 'Infrastructure', allocation: 4.1, performance: 0.5 },
      { sector: 'Others', allocation: 5.0, performance: 0.1 }
    ];

    const result = {
      sectors: sectorPerformance,
      total_allocation: sectorPerformance.reduce((sum, s) => sum + s.allocation, 0),
      avg_performance: sectorPerformance.reduce((sum, s) => sum + s.performance, 0) / sectorPerformance.length,
      top_performing: sectorPerformance.sort((a, b) => b.performance - a.performance)[0],
      worst_performing: sectorPerformance.sort((a, b) => a.performance - b.performance)[0]
    };

    // Cache for 1 hour
    await cache.set(cacheKey, result, 3600);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get sector performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sector performance'
    });
  }
};

// Admin analytics - user statistics
exports.getUserAnalytics = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const cacheKey = 'admin_user_analytics';
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Total users
    const totalUsers = await User.count();

    // Active users (logged in last 30 days)
    const activeUsers = await User.count({
      where: {
        last_login: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // KYC statistics
    const kycStats = await User.findAll({
      attributes: [
        'kyc_status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['kyc_status']
    });

    // User demographics
    const riskProfileStats = await User.findAll({
      attributes: [
        'risk_profile',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['risk_profile']
    });

    // Investment statistics
    const investmentStats = await Portfolio.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('user_id')), 'investing_users'],
        [sequelize.fn('SUM', sequelize.col('current_value')), 'total_portfolio_value'],
        [sequelize.fn('AVG', sequelize.col('current_value')), 'avg_portfolio_value']
      ]
    });

    const result = {
      total_users: totalUsers,
      active_users: activeUsers,
      active_rate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      kyc_statistics: kycStats.map(item => ({
        status: item.kyc_status,
        count: parseInt(item.dataValues.count),
        percentage: totalUsers > 0 ? (parseInt(item.dataValues.count) / totalUsers) * 100 : 0
      })),
      risk_profile_distribution: riskProfileStats.map(item => ({
        profile: item.risk_profile,
        count: parseInt(item.dataValues.count),
        percentage: totalUsers > 0 ? (parseInt(item.dataValues.count) / totalUsers) * 100 : 0
      })),
      investment_statistics: {
        investing_users: parseInt(investmentStats[0]?.dataValues.investing_users || 0),
        investment_rate: totalUsers > 0 ? (parseInt(investmentStats[0]?.dataValues.investing_users || 0) / totalUsers) * 100 : 0,
        total_portfolio_value: parseFloat(investmentStats[0]?.dataValues.total_portfolio_value || 0),
        avg_portfolio_value: parseFloat(investmentStats[0]?.dataValues.avg_portfolio_value || 0)
      },
      user_growth_trend: await calculateUserGrowthTrend()
    };

    // Cache for 2 hours
    await cache.set(cacheKey, result, 7200);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics'
    });
  }
};

// Admin analytics - revenue statistics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    const { period = 'monthly' } = req.query;

    const cacheKey = `admin_revenue_analytics:${period}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Calculate revenue from transaction charges
    const revenueData = await Transaction.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('transaction_date')), 'period'],
        [sequelize.fn('SUM', sequelize.literal('charges->>\'gst\'')), 'gst_collected'],
        [sequelize.fn('SUM', sequelize.literal('charges->>\'transaction_charges\'')), 'transaction_fees'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transaction_count']
      ],
      where: {
        status: 'COMPLETED',
        transaction_date: {
          [Op.gte]: new Date(new Date() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      },
      group: [sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('transaction_date'))],
      order: [[sequelize.fn('DATE_TRUNC', period === 'daily' ? 'day' : period, sequelize.col('transaction_date')), 'ASC']],
      raw: true
    });

    // Calculate platform revenue (simplified)
    const platformRevenue = revenueData.map(item => ({
      period: item.period,
      gst_collected: parseFloat(item.gst_collected || 0),
      transaction_fees: parseFloat(item.transaction_fees || 0),
      total_revenue: parseFloat(item.gst_collected || 0) + parseFloat(item.transaction_fees || 0),
      transaction_count: parseInt(item.transaction_count)
    }));

    const result = {
      period,
      revenue_data: platformRevenue,
      summary: {
        total_revenue: platformRevenue.reduce((sum, item) => sum + item.total_revenue, 0),
        total_transactions: platformRevenue.reduce((sum, item) => sum + item.transaction_count, 0),
        avg_revenue_per_transaction: platformRevenue.reduce((sum, item) => sum + item.transaction_count, 0) > 0 
          ? platformRevenue.reduce((sum, item) => sum + item.total_revenue, 0) / platformRevenue.reduce((sum, item) => sum + item.transaction_count, 0) 
          : 0,
        revenue_growth: calculateGrowthRate(platformRevenue.map(item => item.total_revenue))
      }
    };

    // Cache for 4 hours
    await cache.set(cacheKey, result, 14400);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue analytics'
    });
  }
};

// Helper functions
async function generatePortfolioAlerts(userId) {
  const alerts = [];
  const holdings = await Portfolio.findAll({
    where: { user_id: userId, is_active: true },
    include: [
      {
        model: Fund,
        as: 'fund',
        attributes: ['nav', 'nav_change_percentage']
      }
    ]
  });

  holdings.forEach(holding => {
    const dayChange = holding.fund?.nav_change_percentage || 0;
    
    // Alert for significant daily loss
    if (dayChange < -3) {
      alerts.push({
        type: 'DAILY_LOSS',
        severity: 'HIGH',
        message: `${holding.fund?.fund_name} down ${Math.abs(dayChange).toFixed(2)}% today`,
        fund_id: holding.fund_id
      });
    }
    
    // Alert for significant unrealized loss
    if (holding.unrealized_gain_percentage < -10) {
      alerts.push({
        type: 'PORTFOLIO_LOSS',
        severity: 'MEDIUM',
        message: `${holding.fund?.fund_name} is down ${Math.abs(holding.unrealized_gain_percentage).toFixed(2)}% from purchase`,
        fund_id: holding.fund_id
      });
    }
  });

  // Check for concentrated positions
  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);
  if (totalValue > 0) {
    holdings.forEach(holding => {
      const concentration = (holding.current_value / totalValue) * 100;
      if (concentration > 20) {
        alerts.push({
          type: 'CONCENTRATION',
          severity: 'MEDIUM',
          message: `${holding.fund?.fund_name} makes up ${concentration.toFixed(1)}% of your portfolio`,
          fund_id: holding.fund_id
        });
      }
    });
  }

  return alerts.slice(0, 5); // Return top 5 alerts
}

async function getMarketOverview() {
  // Mock market overview
  return {
    nifty_50: 19850.75,
    nifty_change: 125.50,
    sensex: 66500.25,
    sensex_change: 350.75,
    market_status: 'OPEN',
    sector_trend: 'Mixed',
    gold_price: 61250,
    silver_price: 72500,
    usd_inr: 83.25
  };
}

async function getMarketInsights() {
  // Mock market insights
  return {
    market_outlook: 'Bullish with caution advised on overvalued sectors',
    recommended_action: 'Consider dollar-cost averaging in current market conditions',
    top_sectors: ['Technology', 'Banking', 'Pharma'],
    sectors_to_watch: ['Renewable Energy', 'EV Infrastructure'],
    economic_indicators: {
      inflation: 5.2,
      gdp_growth: 6.5,
      interest_rate: 6.5
    }
  };
}

function calculateDiversificationScore(holdings) {
  if (holdings.length === 0) return 'N/A';
  
  const categories = [...new Set(holdings.map(h => h.fund?.category))];
  const score = Math.min(categories.length * 10, 100);
  
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function calculatePortfolioRiskLevel(holdings) {
  if (holdings.length === 0) return 'N/A';
  
  const riskWeights = {
    'Low': 1,
    'Moderately Low': 2,
    'Moderate': 3,
    'Moderately High': 4,
    'High': 5
  };

  let totalValue = 0;
  let weightedRisk = 0;

  holdings.forEach(holding => {
    const value = holding.current_value || 0;
    const riskLevel = holding.fund?.risk_level || 'Moderate';
    const weight = riskWeights[riskLevel] || 3;
    
    totalValue += value;
    weightedRisk += value * weight;
  });

  const avgRisk = totalValue > 0 ? weightedRisk / totalValue : 3;
  
  if (avgRisk >= 4) return 'High';
  if (avgRisk >= 3) return 'Moderate';
  if (avgRisk >= 2) return 'Low';
  return 'Very Low';
}

async function calculateConsistencyScore(userId) {
  const transactions = await Transaction.count({
    where: {
      user_id: userId,
      type: 'PURCHASE',
      status: 'COMPLETED'
    }
  });

  const sips = await SIP.count({
    where: {
      user_id: userId,
      status: 'ACTIVE'
    }
  });

  const score = Math.min((transactions + sips * 3) / 10 * 100, 100);
  
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
}

function generatePortfolioRecommendations(holdings, userId) {
  const recommendations = [];
  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);

  // Check for overdiversification
  if (holdings.length > 15) {
    recommendations.push({
      type: 'OVERDIVERSIFICATION',
      priority: 'LOW',
      message: 'You hold too many funds. Consider consolidating to 8-12 quality funds.',
      action: 'Review and consolidate'
    });
  }

  // Check for underdiversification
  if (holdings.length < 3 && totalValue > 10000) {
    recommendations.push({
      type: 'UNDERDIVERSIFICATION',
      priority: 'HIGH',
      message: 'Your portfolio is not diversified enough. Consider adding more funds.',
      action: 'Add diversified funds'
    });
  }

  // Check for high expense ratios
  holdings.forEach(holding => {
    // This would check fund.expense_ratio
    // For now, mock check
    if (Math.random() > 0.7) {
      recommendations.push({
        type: 'HIGH_EXPENSE',
        priority: 'MEDIUM',
        message: `${holding.fund?.fund_name} has a relatively high expense ratio.`,
        action: 'Consider lower-cost alternatives'
      });
    }
  });

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

function getRecommendedRiskDistribution(riskProfile) {
  const recommendations = {
    'LOW': {
      'Low': 40,
      'Moderately Low': 35,
      'Moderate': 20,
      'Moderately High': 5,
      'High': 0
    },
    'MODERATE': {
      'Low': 20,
      'Moderately Low': 30,
      'Moderate': 30,
      'Moderately High': 15,
      'High': 5
    },
    'HIGH': {
      'Low': 10,
      'Moderately Low': 20,
      'Moderate': 30,
      'Moderately High': 25,
      'High': 15
    },
    'VERY_HIGH': {
      'Low': 5,
      'Moderately Low': 15,
      'Moderate': 25,
      'Moderately High': 30,
      'High': 25
    }
  };

  return recommendations[riskProfile] || recommendations['MODERATE'];
}

function assessRiskAlignment(currentDistribution, recommendedDistribution) {
  let alignmentScore = 0;
  let totalWeight = 0;

  Object.keys(recommendedDistribution).forEach(riskLevel => {
    const current = currentDistribution[riskLevel]?.percentage || 0;
    const recommended = recommendedDistribution[riskLevel] || 0;
    const difference = Math.abs(current - recommended);
    const weight = recommended; // Higher weight for more important risk levels
    
    alignmentScore += (100 - difference) * weight;
    totalWeight += weight;
  });

  const score = totalWeight > 0 ? alignmentScore / totalWeight : 100;
  
  return {
    score: score,
    level: score >= 80 ? 'Well Aligned' : score >= 60 ? 'Moderately Aligned' : 'Needs Adjustment',
    suggestions: generateRiskAlignmentSuggestions(currentDistribution, recommendedDistribution)
  };
}

function generateRiskAlignmentSuggestions(current, recommended) {
  const suggestions = [];
  
  Object.keys(recommended).forEach(riskLevel => {
    const currentPct = current[riskLevel]?.percentage || 0;
    const recommendedPct = recommended[riskLevel];
    const difference = recommendedPct - currentPct;
    
    if (Math.abs(difference) > 10) {
      if (difference > 0) {
        suggestions.push(`Increase ${riskLevel} risk funds by ${difference.toFixed(1)}%`);
      } else {
        suggestions.push(`Reduce ${riskLevel} risk funds by ${Math.abs(difference).toFixed(1)}%`);
      }
    }
  });
  
  return suggestions;
}

async function calculateUserGrowthTrend() {
  // Calculate user growth over last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyGrowth = await User.findAll({
    attributes: [
      [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'month'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'new_users']
    ],
    where: {
      created_at: { [Op.gte]: sixMonthsAgo }
    },
    group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at'))],
    order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('created_at')), 'ASC']],
    raw: true
  });

  return monthlyGrowth.map(item => ({
    month: item.month,
    new_users: parseInt(item.new_users)
  }));
}

function calculateGrowthRate(values) {
  if (values.length < 2) return 0;
  
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  
  if (firstValue === 0) return lastValue > 0 ? 100 : 0;
  
  return ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
}