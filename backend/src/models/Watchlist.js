const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Watchlist = sequelize.define('Watchlist', {
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  target_price: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true
  },
  stop_loss: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true
  },
  alert_price: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: true
  },
  notifications_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'watchlist',
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

module.exports = Watchlist;