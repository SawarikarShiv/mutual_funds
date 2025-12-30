const { sequelize } = require('../config/database');
const User = require('./User');
const Fund = require('./Fund');
const Portfolio = require('./Portfolio');
const Transaction = require('./Transaction');
const SIP = require('./SIP');
const Watchlist = require('./Watchlist');
const Report = require('./Report');
const Notification = require('./Notification');
const Document = require('./Document');
const AuditLog = require('./AuditLog');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Portfolio, { foreignKey: 'user_id', as: 'portfolios' });
  User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
  User.hasMany(SIP, { foreignKey: 'user_id', as: 'sips' });
  User.hasMany(Watchlist, { foreignKey: 'user_id', as: 'watchlists' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  User.hasMany(Document, { foreignKey: 'user_id', as: 'documents' });
  User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });

  // Fund associations
  Fund.hasMany(Portfolio, { foreignKey: 'fund_id', as: 'portfolios' });
  Fund.hasMany(Transaction, { foreignKey: 'fund_id', as: 'transactions' });
  Fund.hasMany(SIP, { foreignKey: 'fund_id', as: 'sips' });
  Fund.hasMany(Watchlist, { foreignKey: 'fund_id', as: 'watchlists' });

  // Portfolio associations
  Portfolio.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Portfolio.belongsTo(Fund, { foreignKey: 'fund_id', as: 'fund' });

  // Transaction associations
  Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Transaction.belongsTo(Fund, { foreignKey: 'fund_id', as: 'fund' });

  // SIP associations
  SIP.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  SIP.belongsTo(Fund, { foreignKey: 'fund_id', as: 'fund' });

  // Watchlist associations
  Watchlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Watchlist.belongsTo(Fund, { foreignKey: 'fund_id', as: 'fund' });

  // Document associations
  Document.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Report associations
  Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
};

// Initialize models
const initModels = async () => {
  defineAssociations();
  
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
  }
};

module.exports = {
  sequelize,
  User,
  Fund,
  Portfolio,
  Transaction,
  SIP,
  Watchlist,
  Report,
  Notification,
  Document,
  AuditLog,
  initModels
};