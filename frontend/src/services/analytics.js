import api from './api';

export const analyticsService = {
  // Dashboard Analytics
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getUserGrowth: (period) => 
    api.get('/analytics/user-growth', { params: { period } }),
  getTransactionVolume: (period) => 
    api.get('/analytics/transaction-volume', { params: { period } }),
  
  // Fund Analytics
  getFundAnalytics: () => api.get('/analytics/funds'),
  getTopPerformingFunds: (limit = 10) => 
    api.get('/analytics/top-funds', { params: { limit } }),
  getPopularFunds: (limit = 10) => 
    api.get('/analytics/popular-funds', { params: { limit } }),
  
  // Portfolio Analytics
  getPortfolioInsights: () => api.get('/analytics/portfolio-insights'),
  getRiskDistribution: () => api.get('/analytics/risk-distribution'),
  
  // Market Analytics
  getMarketTrends: () => api.get('/analytics/market-trends'),
  getSectorPerformance: () => api.get('/analytics/sector-performance'),
  
  // User Analytics (Admin)
  getUserAnalytics: () => api.get('/admin/analytics/users'),
  getTransactionAnalytics: () => api.get('/admin/analytics/transactions'),
  getRevenueAnalytics: (period) => 
    api.get('/admin/analytics/revenue', { params: { period } }),
};