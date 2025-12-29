import api from './api';

export const reportService = {
  // Report Generation
  generatePortfolioStatement: (params) => 
    api.post('/reports/portfolio-statement', params),
  generateTaxReport: (financialYear) => 
    api.post('/reports/tax-report', { financialYear }),
  generateTransactionReport: (params) => 
    api.post('/reports/transaction-report', params),
  generateCapitalGainsReport: (params) => 
    api.post('/reports/capital-gains', params),
  
  // Report History
  getReportHistory: () => api.get('/reports/history'),
  downloadReport: (reportId) => api.get(`/reports/download/${reportId}`),
  
  // Scheduled Reports
  scheduleReport: (scheduleData) => api.post('/reports/schedule', scheduleData),
  getScheduledReports: () => api.get('/reports/scheduled'),
  updateReportSchedule: (scheduleId, scheduleData) => 
    api.put(`/reports/schedule/${scheduleId}`, scheduleData),
  deleteReportSchedule: (scheduleId) => 
    api.delete(`/reports/schedule/${scheduleId}`),
};