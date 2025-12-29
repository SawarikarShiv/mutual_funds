import api from './api';

export const authService = {
  // User Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, newPassword }),

  // User Management
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (data) => api.put('/users/change-password', data),
  
  // KYC Management
  submitKYC: (kycData) => api.post('/users/kyc', kycData),
  getKYCStatus: () => api.get('/users/kyc/status'),
  
  // Admin User Management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, status) => 
    api.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};