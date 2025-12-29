import api from './api';

export const transactionService = {
  // Transactions
  getAllTransactions: (params) => api.get('/transactions', { params }),
  getTransactionById: (transactionId) => 
    api.get(`/transactions/${transactionId}`),
  getTransactionSummary: () => api.get('/transactions/summary'),
  
  // Purchase/Redemption
  purchaseFund: (purchaseData) => api.post('/transactions/purchase', purchaseData),
  redeemFund: (redemptionData) => api.post('/transactions/redeem', redemptionData),
  cancelTransaction: (transactionId) => 
    api.delete(`/transactions/${transactionId}`),
  
  // SIP Management
  getAllSIPs: () => api.get('/transactions/sips'),
  registerSIP: (sipData) => api.post('/transactions/sips', sipData),
  updateSIP: (sipId, sipData) => api.put(`/transactions/sips/${sipId}`, sipData),
  pauseSIP: (sipId) => api.post(`/transactions/sips/${sipId}/pause`),
  resumeSIP: (sipId) => api.post(`/transactions/sips/${sipId}/resume`),
  cancelSIP: (sipId) => api.delete(`/transactions/sips/${sipId}`),
  
  // Transaction History
  getTransactionHistory: (params) => 
    api.get('/transactions/history', { params }),
  exportTransactions: (format) => 
    api.get('/transactions/export', { params: { format } }),
  
  // Payment Gateway
  initiatePayment: (paymentData) => api.post('/payment/initiate', paymentData),
  verifyPayment: (paymentId) => api.get(`/payment/verify/${paymentId}`),
  getPaymentMethods: () => api.get('/payment/methods'),
  
  // Bank & Wallet
  getBankAccounts: () => api.get('/users/bank-accounts'),
  addBankAccount: (bankData) => api.post('/users/bank-accounts', bankData),
  getWalletBalance: () => api.get('/users/wallet'),
  addWalletFunds: (amount) => api.post('/users/wallet/add', { amount }),
};