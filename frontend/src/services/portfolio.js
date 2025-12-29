import api from './api';

export const portfolioService = {
  // Portfolio Overview
  getPortfolioSummary: () => api.get('/portfolio/summary'),
  getHoldings: (params) => api.get('/portfolio/holdings', { params }),
  getHoldingById: (holdingId) => api.get(`/portfolio/holdings/${holdingId}`),
  
  // Portfolio Performance
  getPortfolioPerformance: (period) => 
    api.get('/portfolio/performance', { params: { period } }),
  getReturnsAnalysis: () => api.get('/portfolio/returns-analysis'),
  
  // Risk Analysis
  getRiskAnalysis: () => api.get('/portfolio/risk-analysis'),
  getAssetAllocation: () => api.get('/portfolio/asset-allocation'),
  getSectorAllocation: () => api.get('/portfolio/sector-allocation'),
  
  // Portfolio Management
  addHolding: (holdingData) => api.post('/portfolio/holdings', holdingData),
  updateHolding: (holdingId, holdingData) => 
    api.put(`/portfolio/holdings/${holdingId}`, holdingData),
  removeHolding: (holdingId) => api.delete(`/portfolio/holdings/${holdingId}`),
  
  // Portfolio Metrics
  getPortfolioMetrics: () => api.get('/portfolio/metrics'),
  getXIRR: () => api.get('/portfolio/xirr'),
  
  // Alerts & Notifications
  getPortfolioAlerts: () => api.get('/portfolio/alerts'),
  setAlert: (alertData) => api.post('/portfolio/alerts', alertData),
};