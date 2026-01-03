import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyToken: () => api.get('/auth/verify'),
};

export const fundsAPI = {
  getAllFunds: (params) => api.get('/funds', { params }),
  getFundById: (id) => api.get(`/funds/${id}`),
  searchFunds: (query) => api.get(`/funds/search?q=${query}`),
  getFundPerformance: (id, period) => api.get(`/funds/${id}/performance?period=${period}`),
  compareFunds: (fundIds) => api.post('/funds/compare', { fundIds }),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  getHoldings: () => api.get('/portfolio/holdings'),
  getPerformance: (period) => api.get(`/portfolio/performance?period=${period}`),
  addHolding: (holding) => api.post('/portfolio/holdings', holding),
  updateHolding: (id, data) => api.put(`/portfolio/holdings/${id}`, data),
  deleteHolding: (id) => api.delete(`/portfolio/holdings/${id}`),
};

export const transactionsAPI = {
  getTransactions: (params) => api.get('/transactions', { params }),
  createTransaction: (transaction) => api.post('/transactions', transaction),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  cancelTransaction: (id) => api.post(`/transactions/${id}/cancel`),
  getSIPs: () => api.get('/transactions/sips'),
  createSIP: (sipData) => api.post('/transactions/sips', sipData),
  cancelSIP: (id) => api.delete(`/transactions/sips/${id}`),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getReports: (type) => api.get(`/analytics/reports/${type}`),
  generateReport: (data) => api.post('/analytics/reports', data),
  getTaxStatement: (year) => api.get(`/analytics/tax/${year}`),
};