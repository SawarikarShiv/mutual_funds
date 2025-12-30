const Redis = require('redis');
const logger = require('../utils/logger');

// Redis configuration
const redisClient = Redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || '',
});

// Redis event handlers
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redisClient.on('end', () => {
  logger.warn('Redis client disconnected');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection failed:', error);
  }
};

// Cache helper functions
const cache = {
  set: async (key, value, ttl = 3600) => {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttl
      });
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  get: async (key) => {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  del: async (key) => {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  clearPattern: async (pattern) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      logger.error('Cache clear pattern error:', error);
    }
  }
};

module.exports = {
  redisClient,
  connectRedis,
  cache
};