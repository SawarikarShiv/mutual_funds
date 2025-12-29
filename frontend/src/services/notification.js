import api from './api';

export const notificationService = {
  // Notifications
  getAllNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationId) => 
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  deleteNotification: (notificationId) => 
    api.delete(`/notifications/${notificationId}`),
  
  // Notification Preferences
  getPreferences: () => api.get('/notifications/preferences'),
  updatePreferences: (preferences) => 
    api.put('/notifications/preferences', preferences),
  
  // Alerts
  getAlerts: () => api.get('/notifications/alerts'),
  createAlert: (alertData) => api.post('/notifications/alerts', alertData),
  updateAlert: (alertId, alertData) => 
    api.put(`/notifications/alerts/${alertId}`, alertData),
  deleteAlert: (alertId) => api.delete(`/notifications/alerts/${alertId}`),
};