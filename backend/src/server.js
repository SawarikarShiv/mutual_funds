const app = require('./app');
const config = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, async () => {
  try {
    // Test database connection
    await config.sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Sync database models
    if (process.env.NODE_ENV === 'development') {
      await config.sequelize.sync({ alter: true });
      logger.info('Database synced successfully.');
    }

    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
    logger.info(`API Base URL: http://localhost:${PORT}/api/v1`);
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
    process.exit(0);
  });
});

module.exports = server;