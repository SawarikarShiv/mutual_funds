const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mutual_fund_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? msg => logger.debug(msg) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize
};