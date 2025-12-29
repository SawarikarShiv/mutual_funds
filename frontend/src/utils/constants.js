export const APP_CONSTANTS = {
  APP_NAME: 'Mutual Fund Platform',
  VERSION: '1.0.0',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/users/profile',
    KYC: '/users/kyc',
  },
  FUNDS: {
    LIST: '/funds',
    DETAILS: '/funds/:id',
    SEARCH: '/funds/search',
    COMPARE: '/funds/compare',
    SCREENER: '/funds/screener',
  },
  PORTFOLIO: {
    SUMMARY: '/portfolio/summary',
    HOLDINGS: '/portfolio/holdings',
    PERFORMANCE: '/portfolio/performance',
    RISK_ANALYSIS: '/portfolio/risk-analysis',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    PURCHASE: '/transactions/purchase',
    REDEEM: '/transactions/redeem',
    SIP: '/transactions/sips',
  },
};

export const FUND_CATEGORIES = [
  { id: 'equity', name: 'Equity Funds', color: '#3B82F6' },
  { id: 'debt', name: 'Debt Funds', color: '#10B981' },
  { id: 'hybrid', name: 'Hybrid Funds', color: '#8B5CF6' },
  { id: 'solution', name: 'Solution Oriented', color: '#F59E0B' },
  { id: 'other', name: 'Other Schemes', color: '#EF4444' },
];

export const RISK_PROFILES = [
  { id: 'low', name: 'Low Risk', color: '#10B981' },
  { id: 'moderate', name: 'Moderate Risk', color: '#F59E0B' },
  { id: 'high', name: 'High Risk', color: '#EF4444' },
];

export const TRANSACTION_TYPES = {
  PURCHASE: 'PURCHASE',
  REDEMPTION: 'REDEMPTION',
  SIP: 'SIP',
  DIVIDEND: 'DIVIDEND',
  SWITCH: 'SWITCH',
};

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

export const KYC_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'hh:mm A',
};

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};