const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fund = sequelize.define('Fund', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fund_code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  fund_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  fund_house: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'Equity',
      'Debt',
      'Hybrid',
      'Solution Oriented',
      'Other',
      'Index',
      'Sectoral',
      'ETF',
      'Fund of Funds'
    ),
    allowNull: false
  },
  sub_category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fund_type: {
    type: DataTypes.ENUM('Open Ended', 'Close Ended', 'Interval'),
    defaultValue: 'Open Ended'
  },
  risk_level: {
    type: DataTypes.ENUM('Low', 'Moderately Low', 'Moderate', 'Moderately High', 'High'),
    allowNull: false
  },
  nav: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  },
  previous_nav: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  },
  nav_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nav_change: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0.0000
  },
  nav_change_percentage: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0.0000
  },
  aum: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00,
    comment: 'Assets Under Management in Crores'
  },
  expense_ratio: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  minimum_investment: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 500.00
  },
  sip_minimum: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 500.00
  },
  exit_load: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  returns: {
    type: DataTypes.JSONB,
    defaultValue: {
      '1d': 0,
      '1w': 0,
      '1m': 0,
      '3m': 0,
      '6m': 0,
      '1y': 0,
      '3y': 0,
      '5y': 0,
      '10y': 0,
      'since_inception': 0
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    allowNull: true
  },
  fund_manager: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  inception_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  benchmark: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  portfolio_turnover: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  sector_allocation: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  top_holdings: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'funds',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['risk_level']
    },
    {
      fields: ['fund_house']
    },
    {
      fields: ['is_featured']
    }
  ]
});

module.exports = Fund;