const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fundRoutes = require('./routes/fundRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.unsplash.com"],
      connectSrc: ["'self'", process.env.FRONTEND_URL]
    }
  }
}));

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Request logging
app.use(morgan('combined', {
  skip: (req, res) => req.url === '/health'
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/funds', fundRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/reports', reportRoutes);

// Background images endpoint
app.get('/api/v1/background-images', (req, res) => {
  res.json({
    success: true,
    data: {
      home: {
        url: process.env.HOME_BG_IMAGE,
        title: "Mutual Fund Investment Platform",
        description: "Start your investment journey with us"
      },
      login: {
        url: process.env.LOGIN_BG_IMAGE,
        title: "Welcome Back",
        description: "Sign in to manage your investments"
      },
      admin: {
        url: process.env.ADMIN_BG_IMAGE,
        title: "Admin Dashboard",
        description: "Manage the entire platform"
      },
      dashboard: {
        url: process.env.DASHBOARD_BG_IMAGE,
        title: "Your Dashboard",
        description: "Track your investments"
      },
      register: {
        url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1920",
        title: "Join Us Today",
        description: "Create your investment account"
      },
      funds: {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920",
        title: "Explore Funds",
        description: "Discover investment opportunities"
      },
      portfolio: {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920",
        title: "Your Portfolio",
        description: "Monitor your investments"
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;