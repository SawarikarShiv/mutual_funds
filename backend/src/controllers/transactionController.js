const { Transaction, Fund, Portfolio, SIP, User } = require('../models');
const { Op } = require('sequelize');
const { cache } = require('../config/redis');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type,
      status,
      start_date,
      end_date,
      page = 1,
      limit = 20,
      sort_by = 'transaction_date',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    // Apply filters
    if (type) where.type = type;
    if (status) where.status = status;
    if (start_date || end_date) {
      where.transaction_date = {};
      if (start_date) where.transaction_date[Op.gte] = start_date;
      if (end_date) where.transaction_date[Op.lte] = end_date;
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['id', 'fund_name', 'fund_code', 'fund_house']
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
        transactions: transactions.map(t => ({
          ...t.toJSON(),
          fund: t.fund?.toJSON()
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
    logger.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};

// Get transaction summary
exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const cacheKey = `transaction_summary:${userId}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: cached
      });
    }

    const summary = await Transaction.findAll({
      where: { user_id: userId, status: 'COMPLETED' },
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_amount'],
        [sequelize.fn('SUM', sequelize.col('units')), 'total_units']
      ],
      group: ['type']
    });

    // Get monthly summary
    const monthlySummary = await Transaction.findAll({
      where: {
        user_id: userId,
        status: 'COMPLETED',
        transaction_date: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('transaction_date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'amount']
      ],
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('transaction_date'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('transaction_date')), 'DESC']]
    });

    const result = {
      summary: summary.map(s => ({
        type: s.type,
        count: parseInt(s.dataValues.count),
        total_amount: parseFloat(s.dataValues.total_amount || 0),
        total_units: parseFloat(s.dataValues.total_units || 0)
      })),
      monthly_summary: monthlySummary.map(m => ({
        month: m.dataValues.month,
        amount: parseFloat(m.dataValues.amount || 0)
      }))
    };

    // Cache for 15 minutes
    await cache.set(cacheKey, result, 900);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Get transaction summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction summary'
    });
  }
};

// Purchase fund
exports.purchaseFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fund_id, amount, units, payment_method, bank_account_id, is_sip = false } = req.body;

    // Validate fund
    const fund = await Fund.findByPk(fund_id);
    if (!fund || !fund.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found or inactive'
      });
    }

    // Validate minimum investment
    if (amount < fund.minimum_investment) {
      return res.status(400).json({
        success: false,
        error: `Minimum investment amount is ${fund.minimum_investment}`
      });
    }

    // Check if user has KYC verified
    const user = await User.findByPk(userId);
    if (user.kyc_status !== 'VERIFIED') {
      return res.status(400).json({
        success: false,
        error: 'KYC verification required for investment'
      });
    }

    // Calculate units if not provided
    const calculatedUnits = units || (amount / fund.nav);
    const totalAmount = amount || (units * fund.nav);

    // Calculate charges
    const charges = calculateCharges(totalAmount, fund);

    // Create transaction
    const transaction = await Transaction.create({
      transaction_id: generateTransactionId(),
      user_id: userId,
      fund_id,
      type: is_sip ? 'SIP' : 'PURCHASE',
      amount: fund.nav,
      units: calculatedUnits,
      nav: fund.nav,
      total_amount: totalAmount,
      charges,
      net_amount: totalAmount - charges.total_charges,
      status: 'PENDING',
      payment_method,
      payment_status: 'PENDING',
      bank_account_id,
      metadata: {
        is_sip,
        fund_details: {
          name: fund.fund_name,
          code: fund.fund_code,
          house: fund.fund_house
        }
      }
    });

    // Initiate payment (this would integrate with payment gateway)
    const paymentResult = await initiatePayment({
      amount: totalAmount,
      transaction_id: transaction.transaction_id,
      user_id: userId,
      payment_method,
      bank_account_id
    });

    // Update transaction with payment details
    await transaction.update({
      payment_id: paymentResult.payment_id,
      payment_status: paymentResult.status
    });

    // Send email confirmation
    await sendEmail({
      to: user.email,
      subject: 'Investment Purchase Initiated',
      template: 'purchase-initiated',
      context: {
        name: user.first_name || user.username,
        fund_name: fund.fund_name,
        amount: totalAmount,
        units: calculatedUnits,
        nav: fund.nav,
        transaction_id: transaction.transaction_id
      }
    });

    res.json({
      success: true,
      data: {
        transaction: transaction.toJSON(),
        payment: paymentResult,
        next_steps: ['Complete payment', 'Wait for allocation', 'Check portfolio after 2 working days']
      },
      message: 'Purchase initiated successfully'
    });
  } catch (error) {
    logger.error('Purchase fund error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process purchase'
    });
  }
};

// Redeem fund
exports.redeemFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fund_id, units, amount, bank_account_id, redemption_type = 'PARTIAL' } = req.body;

    // Validate fund
    const fund = await Fund.findByPk(fund_id);
    if (!fund || !fund.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found or inactive'
      });
    }

    // Check portfolio holding
    const portfolio = await Portfolio.findOne({
      where: { user_id: userId, fund_id, is_active: true }
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found in portfolio'
      });
    }

    // Validate redemption amount
    let redemptionUnits = units;
    let redemptionAmount = amount;

    if (redemption_type === 'FULL') {
      redemptionUnits = portfolio.units_held;
      redemptionAmount = redemptionUnits * fund.nav;
    } else {
      if (units && !amount) {
        redemptionAmount = units * fund.nav;
      } else if (amount && !units) {
        redemptionUnits = amount / fund.nav;
      }

      // Check minimum redemption
      if (redemptionUnits < 0.001) {
        return res.status(400).json({
          success: false,
          error: 'Minimum redemption is 0.001 units'
        });
      }

      if (redemptionUnits > portfolio.units_held) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient units in portfolio'
        });
      }
    }

    // Check exit load if applicable
    const exitLoad = calculateExitLoad(fund, portfolio.first_purchase_date);

    // Create transaction
    const transaction = await Transaction.create({
      transaction_id: generateTransactionId(),
      user_id: userId,
      fund_id,
      type: 'REDEMPTION',
      amount: fund.nav,
      units: redemptionUnits,
      nav: fund.nav,
      total_amount: redemptionAmount,
      charges: {
        exit_load: exitLoad,
        stt: calculateSTT(redemptionAmount),
        other_charges: 0
      },
      net_amount: redemptionAmount * (1 - exitLoad),
      status: 'PENDING',
      bank_account_id,
      metadata: {
        redemption_type,
        exit_load_applied: exitLoad > 0,
        portfolio_holding_id: portfolio.id
      }
    });

    // Update portfolio (will be finalized after settlement)
    if (redemption_type === 'FULL') {
      portfolio.is_active = false;
    } else {
      portfolio.units_held = parseFloat(portfolio.units_held) - parseFloat(redemptionUnits);
      portfolio.total_investment = portfolio.units_held * portfolio.average_purchase_price;
      portfolio.current_value = portfolio.units_held * fund.nav;
      portfolio.unrealized_gain = portfolio.current_value - portfolio.total_investment;
      portfolio.unrealized_gain_percentage = portfolio.total_investment > 0 
        ? (portfolio.unrealized_gain / portfolio.total_investment) * 100 
        : 0;
    }
    
    await portfolio.save();

    // Send email notification
    const user = await User.findByPk(userId);
    await sendEmail({
      to: user.email,
      subject: 'Redemption Request Initiated',
      template: 'redemption-initiated',
      context: {
        name: user.first_name || user.username,
        fund_name: fund.fund_name,
        units: redemptionUnits,
        amount: redemptionAmount,
        settlement_amount: redemptionAmount * (1 - exitLoad),
        settlement_date: calculateSettlementDate(),
        transaction_id: transaction.transaction_id
      }
    });

    res.json({
      success: true,
      data: {
        transaction: transaction.toJSON(),
        portfolio_updated: true,
        settlement_details: {
          expected_date: calculateSettlementDate(),
          exit_load_applied: exitLoad > 0,
          exit_load_percentage: exitLoad * 100
        }
      },
      message: 'Redemption initiated successfully'
    });
  } catch (error) {
    logger.error('Redeem fund error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process redemption'
    });
  }
};

// Register SIP
exports.registerSIP = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fund_id,
      amount,
      frequency = 'MONTHLY',
      start_date,
      end_date,
      installments,
      day_of_month = 1,
      payment_method = 'AUTO_DEBIT',
      bank_account_id
    } = req.body;

    // Validate fund
    const fund = await Fund.findByPk(fund_id);
    if (!fund || !fund.is_active) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found or inactive'
      });
    }

    // Validate SIP minimum
    if (amount < fund.sip_minimum) {
      return res.status(400).json({
        success: false,
        error: `Minimum SIP amount is ${fund.sip_minimum}`
      });
    }

    // Check KYC
    const user = await User.findByPk(userId);
    if (user.kyc_status !== 'VERIFIED') {
      return res.status(400).json({
        success: false,
        error: 'KYC verification required for SIP'
      });
    }

    // Calculate next execution date
    const nextExecutionDate = calculateNextExecutionDate(start_date, frequency, day_of_month);

    // Create SIP
    const sip = await SIP.create({
      sip_id: generateSIPId(),
      user_id: userId,
      fund_id,
      amount,
      frequency,
      day_of_month: frequency === 'MONTHLY' ? day_of_month : null,
      start_date,
      end_date,
      installments,
      status: 'ACTIVE',
      next_execution_date: nextExecutionDate,
      payment_method,
      bank_account_id,
      metadata: {
        fund_details: {
          name: fund.fund_name,
          code: fund.fund_code,
          house: fund.fund_house
        }
      }
    });

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: 'SIP Registration Successful',
      template: 'sip-registered',
      context: {
        name: user.first_name || user.username,
        fund_name: fund.fund_name,
        amount,
        frequency: frequency.toLowerCase(),
        start_date,
        next_execution_date: nextExecutionDate,
        sip_id: sip.sip_id
      }
    });

    res.json({
      success: true,
      data: sip.toJSON(),
      message: 'SIP registered successfully'
    });
  } catch (error) {
    logger.error('Register SIP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register SIP'
    });
  }
};

// Get all SIPs
exports.getAllSIPs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    if (status) where.status = status;

    const { count, rows: sips } = await SIP.findAndCountAll({
      where,
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['id', 'fund_name', 'fund_code', 'fund_house', 'nav']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        sips: sips.map(s => ({
          ...s.toJSON(),
          fund: s.fund?.toJSON()
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
    logger.error('Get all SIPs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SIPs'
    });
  }
};

// Update SIP
exports.updateSIP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sipId } = req.params;
    const updateData = req.body;

    const sip = await SIP.findOne({
      where: { id: sipId, user_id: userId }
    });

    if (!sip) {
      return res.status(404).json({
        success: false,
        error: 'SIP not found'
      });
    }

    // Remove restricted fields
    delete updateData.user_id;
    delete updateData.fund_id;
    delete updateData.sip_id;
    delete updateData.created_at;

    // If updating amount, validate minimum
    if (updateData.amount) {
      const fund = await Fund.findByPk(sip.fund_id);
      if (updateData.amount < fund.sip_minimum) {
        return res.status(400).json({
          success: false,
          error: `Minimum SIP amount is ${fund.sip_minimum}`
        });
      }
    }

    // If updating frequency or day, recalculate next execution
    if (updateData.frequency || updateData.day_of_month) {
      updateData.next_execution_date = calculateNextExecutionDate(
        sip.start_date,
        updateData.frequency || sip.frequency,
        updateData.day_of_month || sip.day_of_month
      );
    }

    await sip.update(updateData);

    // Send update notification
    const user = await User.findByPk(userId);
    await sendEmail({
      to: user.email,
      subject: 'SIP Updated Successfully',
      template: 'sip-updated',
      context: {
        name: user.first_name || user.username,
        sip_id: sip.sip_id,
        changes: Object.keys(updateData)
      }
    });

    res.json({
      success: true,
      data: sip.toJSON(),
      message: 'SIP updated successfully'
    });
  } catch (error) {
    logger.error('Update SIP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update SIP'
    });
  }
};

// Pause SIP
exports.pauseSIP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sipId } = req.params;
    const { reason } = req.body;

    const sip = await SIP.findOne({
      where: { id: sipId, user_id: userId, status: 'ACTIVE' }
    });

    if (!sip) {
      return res.status(404).json({
        success: false,
        error: 'Active SIP not found'
      });
    }

    await sip.update({
      status: 'PAUSED',
      pause_reason: reason
    });

    // Send pause notification
    const user = await User.findByPk(userId);
    await sendEmail({
      to: user.email,
      subject: 'SIP Paused Successfully',
      template: 'sip-paused',
      context: {
        name: user.first_name || user.username,
        sip_id: sip.sip_id,
        reason: reason || 'Not specified'
      }
    });

    res.json({
      success: true,
      message: 'SIP paused successfully'
    });
  } catch (error) {
    logger.error('Pause SIP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to pause SIP'
    });
  }
};

// Resume SIP
exports.resumeSIP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sipId } = req.params;

    const sip = await SIP.findOne({
      where: { id: sipId, user_id: userId, status: 'PAUSED' }
    });

    if (!sip) {
      return res.status(404).json({
        success: false,
        error: 'Paused SIP not found'
      });
    }

    // Calculate next execution date
    const nextExecutionDate = calculateNextExecutionDate(
      new Date().toISOString().split('T')[0],
      sip.frequency,
      sip.day_of_month
    );

    await sip.update({
      status: 'ACTIVE',
      next_execution_date: nextExecutionDate,
      pause_reason: null
    });

    // Send resume notification
    const user = await User.findByPk(userId);
    await sendEmail({
      to: user.email,
      subject: 'SIP Resumed Successfully',
      template: 'sip-resumed',
      context: {
        name: user.first_name || user.username,
        sip_id: sip.sip_id,
        next_execution_date: nextExecutionDate
      }
    });

    res.json({
      success: true,
      message: 'SIP resumed successfully'
    });
  } catch (error) {
    logger.error('Resume SIP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resume SIP'
    });
  }
};

// Cancel SIP
exports.cancelSIP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sipId } = req.params;
    const { reason } = req.body;

    const sip = await SIP.findOne({
      where: { id: sipId, user_id: userId }
    });

    if (!sip) {
      return res.status(404).json({
        success: false,
        error: 'SIP not found'
      });
    }

    await sip.update({
      status: 'CANCELLED',
      cancellation_reason: reason
    });

    // Send cancellation notification
    const user = await User.findByPk(userId);
    await sendEmail({
      to: user.email,
      subject: 'SIP Cancelled Successfully',
      template: 'sip-cancelled',
      context: {
        name: user.first_name || user.username,
        sip_id: sip.sip_id,
        reason: reason || 'Not specified',
        total_invested: sip.total_invested,
        total_units: sip.total_units
      }
    });

    res.json({
      success: true,
      message: 'SIP cancelled successfully'
    });
  } catch (error) {
    logger.error('Cancel SIP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel SIP'
    });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({
      where: { id: transactionId, user_id: userId },
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['id', 'fund_name', 'fund_code', 'fund_house', 'category']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...transaction.toJSON(),
        fund: transaction.fund?.toJSON(),
        user: transaction.user?.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get transaction by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction details'
    });
  }
};

// Cancel transaction
exports.cancelTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transactionId } = req.params;
    const { reason } = req.body;

    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        user_id: userId,
        status: ['PENDING', 'PROCESSING']
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Pending transaction not found'
      });
    }

    await transaction.update({
      status: 'CANCELLED',
      remarks: reason ? `${transaction.remarks || ''} - Cancelled: ${reason}` : 'Cancelled by user'
    });

    // If this was a purchase, reverse any portfolio updates
    if (transaction.type === 'PURCHASE') {
      const portfolio = await Portfolio.findOne({
        where: {
          user_id: userId,
          fund_id: transaction.fund_id,
          is_active: true
        }
      });

      if (portfolio) {
        // Revert the purchase
        const newUnits = parseFloat(portfolio.units_held) - parseFloat(transaction.units);
        if (newUnits <= 0) {
          await portfolio.destroy();
        } else {
          portfolio.units_held = newUnits;
          portfolio.total_investment = newUnits * portfolio.average_purchase_price;
          portfolio.current_value = newUnits * (await Fund.findByPk(transaction.fund_id)).nav;
          await portfolio.save();
        }
      }
    }

    // Send cancellation notification
    const user = await User.findByPk(userId);
    await sendEmail({
      to: user.email,
      subject: 'Transaction Cancelled',
      template: 'transaction-cancelled',
      context: {
        name: user.first_name || user.username,
        transaction_id: transaction.transaction_id,
        type: transaction.type,
        amount: transaction.total_amount,
        reason: reason || 'Not specified'
      }
    });

    res.json({
      success: true,
      message: 'Transaction cancelled successfully'
    });
  } catch (error) {
    logger.error('Cancel transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel transaction'
    });
  }
};

// Export transactions
exports.exportTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { format = 'csv', start_date, end_date } = req.query;

    const where = { user_id: userId };

    if (start_date || end_date) {
      where.transaction_date = {};
      if (start_date) where.transaction_date[Op.gte] = start_date;
      if (end_date) where.transaction_date[Op.lte] = end_date;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        {
          model: Fund,
          as: 'fund',
          attributes: ['fund_name', 'fund_code']
        }
      ],
      order: [['transaction_date', 'DESC']]
    });

    let exportData;
    if (format === 'csv') {
      exportData = generateCSV(transactions);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      return res.send(exportData);
    } else if (format === 'excel') {
      exportData = generateExcel(transactions);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');
      return res.send(exportData);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported export format'
      });
    }
  } catch (error) {
    logger.error('Export transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export transactions'
    });
  }
};

// Helper functions
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `TXN${timestamp}${random}`;
}

function generateSIPId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `SIP${timestamp}${random}`;
}

function calculateCharges(amount, fund) {
  const stt = amount * 0.001; // 0.1% STT
  const stampDuty = amount * 0.00005; // 0.005% stamp duty
  const gst = (stt + stampDuty) * 0.18; // 18% GST on charges
  const transactionCharges = amount * 0.0005; // 0.05% transaction charges

  return {
    stt,
    stamp_duty: stampDuty,
    gst,
    transaction_charges: transactionCharges,
    other_charges: 0,
    total_charges: stt + stampDuty + gst + transactionCharges
  };
}

function calculateExitLoad(fund, purchaseDate) {
  const holdingPeriod = (new Date() - new Date(purchaseDate)) / (1000 * 60 * 60 * 24);
  
  // Parse exit load rules from fund.exit_load
  // For now, return 1% if holding period < 365 days
  return holdingPeriod < 365 ? 0.01 : 0;
}

function calculateSTT(amount) {
  return amount * 0.001; // 0.1% STT on redemption
}

function calculateSettlementDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3); // T+3 settlement
  return date.toISOString().split('T')[0];
}

function calculateNextExecutionDate(startDate, frequency, dayOfMonth) {
  const date = new Date(startDate);
  
  switch (frequency) {
    case 'DAILY':
      date.setDate(date.getDate() + 1);
      break;
    case 'WEEKLY':
      date.setDate(date.getDate() + 7);
      break;
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1);
      if (dayOfMonth) {
        date.setDate(dayOfMonth);
      }
      break;
    case 'QUARTERLY':
      date.setMonth(date.getMonth() + 3);
      if (dayOfMonth) {
        date.setDate(dayOfMonth);
      }
      break;
  }
  
  return date.toISOString().split('T')[0];
}

async function initiatePayment(paymentData) {
  // This would integrate with actual payment gateway
  // For now, return mock response
  return {
    payment_id: `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    status: 'PENDING',
    redirect_url: null,
    message: 'Payment initiated successfully'
  };
}

function generateCSV(transactions) {
  const headers = ['Date', 'Transaction ID', 'Type', 'Fund Name', 'Units', 'NAV', 'Amount', 'Status'];
  const rows = transactions.map(t => [
    t.transaction_date,
    t.transaction_id,
    t.type,
    t.fund?.fund_name || '',
    t.units,
    t.nav,
    t.total_amount,
    t.status
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateExcel(transactions) {
  // This would use exceljs library to generate Excel file
  // For now, return CSV as fallback
  return generateCSV(transactions);
}