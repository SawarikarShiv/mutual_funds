const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
  units_held: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0.000000,
    allowNull: false
  },
  average_purchase_price: {
    type: DataTypes.DECIMAL(15, 4),
    defaultValue: 0.0000
  },
  total_investment: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00
  },
  current_value: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00
  },
  unrealized_gain: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00
  },
  unrealized_gain_percentage: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0.0000
  },
  realized_gain: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00
  },
  day_gain: {
    type: DataTypes.DECIMAL(20, 2),
    defaultValue: 0.00
  },
  day_gain_percentage: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0.0000
  },
  xirr: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0.0000
  },
  first_purchase_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_purchase_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  custom_tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'portfolio',
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
      fields: ['user_id', 'fund_id'],
      unique: true
    }
  ]
});

module.exports = Portfolio;