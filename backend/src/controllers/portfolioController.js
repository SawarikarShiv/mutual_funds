const { Portfolio, Fund, Transaction } = require('../models');
const { Op } = require('sequelize');
const { cache } = require('../config/redis');
const { calculateXIRR, calculatePortfolioMetrics } = require('../utils/calculations');
const logger = require('../utils/logger');

// Get portfolio summary
exports.getPortfolioSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `portfolio_summary:${userId}`;
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
          attributes: ['id', 'fund_name', 'fund_code', 'category', 'nav', 'nav_change_percentage']
        }
      ],
      order: [['current_value', 'DESC']]
    });

    if (holdings.length === 0) {
      return res.json({
        success: true,
        data: {
          holdings: [],
          summary: {
            total_investment: 0,
            current_value: 0,
            total_gain: 0,
            total_gain_percentage: 0,
            day_gain: 0,
            day_gain_percentage: 0
          }
        }
      });
    }

    // Calculate summary
    const summary = holdings.reduce((acc, holding) => {
      acc.total_investment += parseFloat(holding.total_investment || 0);
      acc.current_value += parseFloat(holding.current_value || 0);
      acc.unrealized_gain += parseFloat(holding.unrealized_gain || 0);
      acc.day_gain += parseFloat(holding.day_gain || 0);
      return acc;
    }, {
      total_investment: 0,
      current_value: 0,
      unrealized_gain: 0,
      day_gain: 0
    });

    summary.total_gain_percentage = summary.total_investment > 0 
      ? (summary.unrealized_gain / summary.total_investment) * 100 
      : 0;
    summary.day_gain_percentage = summary.current_value > 0 
      ? (summary.day_gain / summary.current_value) * 100 
      : 0;

    // Calculate asset allocation
    const assetAllocation = holdings.reduce((acc, holding) => {
      const category = holding.fund?.category || 'Other';
      if (!acc[category]) {
        acc[category] = {
          category,
          value: 0,
          percentage: 0
        };
      }
      acc[category].value += holding.current_value;
      return acc;
    }, {});

    // Calculate percentages
    Object.values(assetAllocation).forEach(item => {
      item.percentage = (item.value / summary.current_value) * 100;
    });

    const result = {
      holdings: holdings.map(h => ({
        ...h.toJSON(),
        fund: h.fund.toJSON()
      })),
      summary,
      asset_allocation: Object.values(assetAllocation),
      holding_count: holdings.length
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, result, 300);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get portfolio summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio summary'
    });
  }
};

// Get portfolio holdings
exports.getPortfolioHoldings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, sort_by = 'current_value', sort_order = 'DESC', page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: userId, is_active: true };

    // Apply category filter if provided
    if (category) {
      where['$fund.category$'] = category;
    }

    const include = [
      {
        model: Fund,
        as: 'fund',
        attributes: ['id', 'fund_name', 'fund_code', 'category', 'fund_house', 'nav', 'nav_change_percentage', 'risk_level']
      }
    ];

    // Sorting
    let order;
    if (sort_by === 'gain') {
      order = [[sequelize.literal('unrealized_gain_percentage'), sort_order.toUpperCase()]];
    } else if (sort_by === 'fund_name') {
      order = [[{ model: Fund, as: 'fund' }, 'fund_name', sort_order.toUpperCase()]];
    } else {
      order = [[sort_by, sort_order.toUpperCase()]];
    }

    const { count, rows: holdings } = await Portfolio.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
      distinct: true
    });

    res.json({
      success: true,
      data: {
        holdings: holdings.map(h => ({
          ...h.toJSON(),
          fund: h.fund.toJSON()
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
    logger.error('Get portfolio holdings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio holdings'
    });
  }
};

// Get portfolio performance
exports.getPortfolioPerformance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '1y' } = req.query;

    const cacheKey = `portfolio_performance:${userId}:${period}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    // Get transactions for XIRR calculation
    const transactions = await Transaction.findAll({
      where: {
        user_id: userId,
        status: 'COMPLETED',
        type: ['PURCHASE', 'REDEMPTION']
      },
      attributes: ['type', 'amount', 'total_amount', 'transaction_date'],
      order: [['transaction_date', 'ASC']]
    });

    // Get daily portfolio value history (this would come from a separate table)
    const valueHistory = await getPortfolioValueHistory(userId, period);

    // Calculate performance metrics
    const cashFlows = [];
    const dates = [];
    let currentValue = 0;

    // Add transactions as cash flows
    transactions.forEach(txn => {
      if (txn.type === 'PURCHASE') {
        cashFlows.push(-txn.total_amount); // Negative for investment
      } else if (txn.type === 'REDEMPTION') {
        cashFlows.push(txn.total_amount); // Positive for redemption
      }
      dates.push(txn.transaction_date);
    });

    // Add current value as final cash flow
    const currentHoldings = await Portfolio.sum('current_value', {
      where: { user_id: userId, is_active: true }
    });

    if (currentHoldings > 0) {
      cashFlows.push(currentHoldings);
      dates.push(new Date());
    }

    // Calculate XIRR
    const xirr = calculateXIRR(cashFlows, dates);

    // Calculate returns for different periods
    const returns = calculatePeriodReturns(valueHistory);

    const performance = {
      current_value: currentHoldings || 0,
      xirr: xirr,
      returns: returns,
      value_history: valueHistory,
      drawdown: calculateDrawdown(valueHistory),
      sharpe_ratio: calculateSharpeRatio(valueHistory),
      volatility: calculateVolatility(valueHistory)
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, performance, 300);

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    logger.error('Get portfolio performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio performance'
    });
  }
};

// Get risk analysis
exports.getRiskAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    const cacheKey = `portfolio_risk:${userId}`;
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
          attributes: ['id', 'category', 'risk_level', 'sector_allocation']
        }
      ]
    });

    // Calculate risk metrics
    const riskMetrics = {
      overall_risk_score: calculateOverallRiskScore(holdings),
      category_risk: calculateCategoryRisk(holdings),
      sector_concentration: calculateSectorConcentration(holdings),
      risk_recommendations: generateRiskRecommendations(holdings),
      stress_test_results: performStressTest(holdings)
    };

    // Cache for 1 hour
    await cache.set(cacheKey, riskMetrics, 3600);

    res.json({
      success: true,
      data: riskMetrics
    });
  } catch (error) {
    logger.error('Get risk analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch risk analysis'
    });
  }
};

// Add to portfolio
exports.addToPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fund_id, units, purchase_price, purchase_date, notes } = req.body;

    // Validate fund exists
    const fund = await Fund.findByPk(fund_id);
    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found'
      });
    }

    // Check if already in portfolio
    let portfolio = await Portfolio.findOne({
      where: { user_id: userId, fund_id }
    });

    if (portfolio) {
      // Update existing holding
      const totalInvestment = portfolio.total_investment + (units * purchase_price);
      const totalUnits = parseFloat(portfolio.units_held) + parseFloat(units);
      
      portfolio.units_held = totalUnits;
      portfolio.average_purchase_price = totalInvestment / totalUnits;
      portfolio.total_investment = totalInvestment;
      portfolio.current_value = totalUnits * fund.nav;
      portfolio.unrealized_gain = portfolio.current_value - totalInvestment;
      portfolio.unrealized_gain_percentage = (portfolio.unrealized_gain / totalInvestment) * 100;
      
      if (!portfolio.first_purchase_date) {
        portfolio.first_purchase_date = purchase_date || new Date();
      }
      portfolio.last_purchase_date = purchase_date || new Date();
      
      await portfolio.save();
    } else {
      // Create new holding
      const totalInvestment = units * purchase_price;
      const currentValue = units * fund.nav;
      const unrealizedGain = currentValue - totalInvestment;
      const unrealizedGainPercentage = (unrealizedGain / totalInvestment) * 100;

      portfolio = await Portfolio.create({
        user_id: userId,
        fund_id,
        units_held: units,
        average_purchase_price: purchase_price,
        total_investment: totalInvestment,
        current_value: currentValue,
        unrealized_gain: unrealizedGain,
        unrealized_gain_percentage: unrealizedGainPercentage,
        first_purchase_date: purchase_date || new Date(),
        last_purchase_date: purchase_date || new Date(),
        notes
      });
    }

    // Create transaction record
    await Transaction.create({
      transaction_id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      fund_id,
      type: 'PURCHASE',
      amount: purchase_price,
      units: units,
      nav: fund.nav,
      total_amount: units * purchase_price,
      status: 'COMPLETED',
      transaction_date: purchase_date || new Date(),
      remarks: 'Manual portfolio entry'
    });

    // Clear cache
    await cache.clearPattern(`portfolio:*:${userId}`);

    res.json({
      success: true,
      data: portfolio,
      message: 'Added to portfolio successfully'
    });
  } catch (error) {
    logger.error('Add to portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to portfolio'
    });
  }
};

// Update portfolio holding
exports.updatePortfolioHolding = async (req, res) => {
  try {
    const userId = req.user.id;
    const { holdingId } = req.params;
    const updateData = req.body;

    const portfolio = await Portfolio.findOne({
      where: { id: holdingId, user_id: userId }
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio holding not found'
      });
    }

    // Remove restricted fields
    delete updateData.user_id;
    delete updateData.fund_id;
    delete updateData.created_at;
    delete updateData.updated_at;

    await portfolio.update(updateData);

    // Recalculate values if units or price changed
    if (updateData.units_held || updateData.average_purchase_price) {
      const fund = await Fund.findByPk(portfolio.fund_id);
      if (fund) {
        portfolio.total_investment = portfolio.units_held * portfolio.average_purchase_price;
        portfolio.current_value = portfolio.units_held * fund.nav;
        portfolio.unrealized_gain = portfolio.current_value - portfolio.total_investment;
        portfolio.unrealized_gain_percentage = portfolio.total_investment > 0 
          ? (portfolio.unrealized_gain / portfolio.total_investment) * 100 
          : 0;
        await portfolio.save();
      }
    }

    // Clear cache
    await cache.clearPattern(`portfolio:*:${userId}`);

    res.json({
      success: true,
      data: portfolio,
      message: 'Portfolio holding updated successfully'
    });
  } catch (error) {
    logger.error('Update portfolio holding error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update portfolio holding'
    });
  }
};

// Remove from portfolio
exports.removeFromPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const { holdingId } = req.params;
    const { reason } = req.body;

    const portfolio = await Portfolio.findOne({
      where: { id: holdingId, user_id: userId }
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio holding not found'
      });
    }

    // Create redemption transaction
    const fund = await Fund.findByPk(portfolio.fund_id);
    if (fund) {
      await Transaction.create({
        transaction_id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        fund_id: portfolio.fund_id,
        type: 'REDEMPTION',
        amount: fund.nav,
        units: portfolio.units_held,
        nav: fund.nav,
        total_amount: portfolio.units_held * fund.nav,
        status: 'COMPLETED',
        transaction_date: new Date(),
        remarks: reason || 'Portfolio removal'
      });
    }

    // Delete portfolio holding
    await portfolio.destroy();

    // Clear cache
    await cache.clearPattern(`portfolio:*:${userId}`);

    res.json({
      success: true,
      message: 'Removed from portfolio successfully'
    });
  } catch (error) {
    logger.error('Remove from portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from portfolio'
    });
  }
};

// Get asset allocation
exports.getAssetAllocation = async (req, res) => {
  try {
    const userId = req.user.id;

    const cacheKey = `portfolio_allocation:${userId}`;
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
          attributes: ['id', 'category', 'sub_category']
        }
      ]
    });

    // Calculate allocation by category
    const categoryAllocation = {};
    let totalValue = 0;

    holdings.forEach(holding => {
      const category = holding.fund?.category || 'Other';
      const value = holding.current_value || 0;
      
      if (!categoryAllocation[category]) {
        categoryAllocation[category] = {
          category,
          value: 0,
          percentage: 0,
          holdings: []
        };
      }
      
      categoryAllocation[category].value += value;
      categoryAllocation[category].holdings.push({
        fund_name: holding.fund?.fund_name,
        value: value
      });
      totalValue += value;
    });

    // Calculate percentages
    Object.values(categoryAllocation).forEach(item => {
      item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
      item.holdings.sort((a, b) => b.value - a.value);
    });

    const allocation = {
      total_value: totalValue,
      allocation: Object.values(categoryAllocation).sort((a, b) => b.value - a.value),
      recommended_allocation: getRecommendedAllocation(userId)
    };

    // Cache for 1 hour
    await cache.set(cacheKey, allocation, 3600);

    res.json({
      success: true,
      data: allocation
    });
  } catch (error) {
    logger.error('Get asset allocation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch asset allocation'
    });
  }
};

// Helper functions
async function getPortfolioValueHistory(userId, period) {
  // This would query a portfolio value history table
  // For now, return mock data
  const days = period === '1y' ? 365 : period === '3m' ? 90 : period === '1m' ? 30 : 180;
  
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 100000 + Math.random() * 20000
  })).reverse();
}

function calculatePeriodReturns(valueHistory) {
  if (valueHistory.length < 2) return {};

  const periods = {
    '1d': 1,
    '1w': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365
  };

  const returns = {};
  const currentValue = valueHistory[valueHistory.length - 1].value;

  Object.entries(periods).forEach(([period, days]) => {
    if (valueHistory.length >= days) {
      const pastValue = valueHistory[valueHistory.length - days - 1]?.value || valueHistory[0].value;
      returns[period] = ((currentValue - pastValue) / pastValue) * 100;
    }
  });

  return returns;
}

function calculateDrawdown(valueHistory) {
  if (valueHistory.length < 2) return 0;

  let peak = valueHistory[0].value;
  let maxDrawdown = 0;

  valueHistory.forEach(item => {
    if (item.value > peak) {
      peak = item.value;
    }
    const drawdown = (peak - item.value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });

  return maxDrawdown * 100; // Return as percentage
}

function calculateSharpeRatio(valueHistory) {
  if (valueHistory.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < valueHistory.length; i++) {
    const dailyReturn = (valueHistory[i].value - valueHistory[i-1].value) / valueHistory[i-1].value;
    returns.push(dailyReturn);
  }

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length);

  // Assuming risk-free rate of 5% annualized
  const riskFreeRate = 0.05 / 252; // Daily risk-free rate
  return stdDev > 0 ? (avgReturn - riskFreeRate) / stdDev * Math.sqrt(252) : 0;
}

function calculateVolatility(valueHistory) {
  if (valueHistory.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < valueHistory.length; i++) {
    const dailyReturn = (valueHistory[i].value - valueHistory[i-1].value) / valueHistory[i-1].value;
    returns.push(dailyReturn);
  }

  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility in percentage
}

function calculateOverallRiskScore(holdings) {
  if (holdings.length === 0) return 0;

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

  return totalValue > 0 ? (weightedRisk / totalValue) : 0;
}

function calculateCategoryRisk(holdings) {
  const categoryRisk = {};

  holdings.forEach(holding => {
    const category = holding.fund?.category || 'Other';
    if (!categoryRisk[category]) {
      categoryRisk[category] = {
        category,
        total_value: 0,
        risk_levels: {}
      };
    }
    
    const riskLevel = holding.fund?.risk_level || 'Moderate';
    categoryRisk[category].total_value += holding.current_value || 0;
    
    if (!categoryRisk[category].risk_levels[riskLevel]) {
      categoryRisk[category].risk_levels[riskLevel] = 0;
    }
    categoryRisk[category].risk_levels[riskLevel] += holding.current_value || 0;
  });

  return Object.values(categoryRisk);
}

function calculateSectorConcentration(holdings) {
  const sectorAllocation = {};

  holdings.forEach(holding => {
    const sectors = holding.fund?.sector_allocation || {};
    Object.entries(sectors).forEach(([sector, percentage]) => {
      if (!sectorAllocation[sector]) {
        sectorAllocation[sector] = 0;
      }
      sectorAllocation[sector] += (holding.current_value || 0) * (percentage / 100);
    });
  });

  // Convert to array and sort
  return Object.entries(sectorAllocation)
    .map(([sector, value]) => ({ sector, value }))
    .sort((a, b) => b.value - a.value);
}

function generateRiskRecommendations(holdings) {
  const recommendations = [];
  
  // Check concentration risk
  const totalValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);
  const topHolding = holdings.sort((a, b) => b.current_value - a.current_value)[0];
  
  if (topHolding && totalValue > 0) {
    const concentration = (topHolding.current_value / totalValue) * 100;
    if (concentration > 20) {
      recommendations.push({
        type: 'CONCENTRATION_RISK',
        message: `Your portfolio is heavily concentrated in ${topHolding.fund?.fund_name} (${concentration.toFixed(1)}%). Consider diversifying.`,
        severity: 'HIGH'
      });
    }
  }

  // Check risk level distribution
  const riskDistribution = holdings.reduce((acc, h) => {
    const risk = h.fund?.risk_level || 'Moderate';
    acc[risk] = (acc[risk] || 0) + (h.current_value || 0);
    return acc;
  }, {});

  const highRiskPercentage = (riskDistribution['High'] || 0) / totalValue * 100;
  if (highRiskPercentage > 30) {
    recommendations.push({
      type: 'HIGH_RISK_EXPOSURE',
      message: `You have ${highRiskPercentage.toFixed(1)}% exposure to high-risk funds. Consider rebalancing.`,
      severity: 'MEDIUM'
    });
  }

  return recommendations;
}

function performStressTest(holdings) {
  // Simulate different market scenarios
  const scenarios = [
    { name: 'Market Crash (-20%)', impact: -0.20 },
    { name: 'Correction (-10%)', impact: -0.10 },
    { name: 'Stagnation (0%)', impact: 0 },
    { name: 'Bull Market (+20%)', impact: 0.20 },
    { name: 'Strong Bull (+40%)', impact: 0.40 }
  ];

  const currentValue = holdings.reduce((sum, h) => sum + (h.current_value || 0), 0);

  return scenarios.map(scenario => {
    const impactedValue = holdings.reduce((sum, h) => {
      const fundImpact = h.fund?.risk_level === 'High' ? scenario.impact * 1.2 : 
                         h.fund?.risk_level === 'Low' ? scenario.impact * 0.8 : 
                         scenario.impact;
      return sum + (h.current_value || 0) * (1 + fundImpact);
    }, 0);

    return {
      scenario: scenario.name,
      impact_percentage: scenario.impact * 100,
      current_value: currentValue,
      projected_value: impactedValue,
      change: impactedValue - currentValue,
      change_percentage: ((impactedValue - currentValue) / currentValue) * 100
    };
  });
}

function getRecommendedAllocation(userId) {
  // This would consider user's risk profile, age, income, etc.
  // For now, return generic recommendations
  return {
    'Equity': 60,
    'Debt': 30,
    'Hybrid': 10
  };
}