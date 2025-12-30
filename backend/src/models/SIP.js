const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SIP = sequelize.define('SIP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sip_id: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  fund_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'funds',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'),
    defaultValue: 'MONTHLY'
  },
  day_of_month: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 28
    },
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  installments: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Total number of installments if fixed'
  },
  completed_installments: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'FAILED'),
    defaultValue: 'ACTIVE'
  },
  next_execution_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  last_executed_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  total_invested: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00
  },
  total_units: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0.000000
  },
  average_nav: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  },
  payment_method: {
    type: DataTypes.ENUM('AUTO_DEBIT', 'MANUAL'),
    defaultValue: 'AUTO_DEBIT'
  },
  bank_account_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  is_auto_renew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  pause_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'sips',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['fund_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['next_execution_date']
    }
  ]
});

module.exports = SIP;