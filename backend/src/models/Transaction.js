const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transaction_id: {
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
  type: {
    type: DataTypes.ENUM('PURCHASE', 'REDEMPTION', 'SWITCH', 'DIVIDEND', 'SIP'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  },
  units: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false
  },
  nav: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  },
  charges: {
    type: DataTypes.JSONB,
    defaultValue: {
      stt: 0,
      stamp_duty: 0,
      gst: 0,
      transaction_charges: 0,
      other_charges: 0
    }
  },
  net_amount: {
    type: DataTypes.DECIMAL(20, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'PROCESSING'),
    defaultValue: 'PENDING'
  },
  payment_method: {
    type: DataTypes.ENUM('UPI', 'NET_BANKING', 'DEBIT_CARD', 'CREDIT_CARD', 'WALLET', 'NEFT', 'RTGS'),
    allowNull: true
  },
  payment_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payment_status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  settlement_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  initiated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'transactions',
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
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['transaction_date']
    }
  ]
});

module.exports = Transaction;