import api from './api';

export const fundService = {
  // Mutual Funds
  getAllFunds: (params) => api.get('/funds', { params }),
  getFundById: (fundId) => api.get(`/funds/${fundId}`),
  searchFunds: (query) => api.get('/funds/search', { params: { q: query } }),
  filterFunds: (filters) => api.post('/funds/filter', filters),
  
  // Fund Categories
  getFundCategories: () => api.get('/funds/categories'),
  getFundsByCategory: (categoryId) => api.get(`/funds/category/${categoryId}`),
  
  // Fund Performance
  getFundPerformance: (fundId, period) => 
    api.get(`/funds/${fundId}/performance`, { params: { period } }),
  getFundNAVHistory: (fundId, fromDate, toDate) =>
    api.get(`/funds/${fundId}/nav-history`, { params: { fromDate, toDate } }),
  
  // Fund Comparison
  compareFunds: (fundIds) => api.post('/funds/compare', { fundIds }),
  
  // Screener
  fundScreener: (criteria) => api.post('/funds/screener', criteria),
  
  // Watchlist
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (fundId) => api.post('/watchlist', { fundId }),
  removeFromWatchlist: (fundId) => api.delete(`/watchlist/${fundId}`),
  
  // Admin Fund Management
  createFund: (fundData) => api.post('/admin/funds', fundData),
  updateFund: (fundId, fundData) => api.put(`/admin/funds/${fundId}`, fundData),
  deleteFund: (fundId) => api.delete(`/admin/funds/${fundId}`),
  uploadFundNAV: (fundId, navData) => 
    api.post(`/admin/funds/${fundId}/nav`, navData),
};