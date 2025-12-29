import numeral from 'numeral';

export const formatCurrency = (value, currency = 'INR') => {
  if (value === null || value === undefined) return '₹ 0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.00%';
  
  return numeral(value).format(`0,0.${'0'.repeat(decimals)}`) + '%';
};

export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0';
  
  if (value >= 10000000) {
    return numeral(value).format('0,0.00a').toUpperCase();
  } else if (value >= 100000) {
    return numeral(value).format('0,0.0a').toUpperCase();
  } else {
    return numeral(value).format(`0,0.${'0'.repeat(decimals)}`);
  }
};

export const formatDate = (date, format = 'DD MMM YYYY') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getColorForValue = (value) => {
  if (value > 0) return '#10B981'; // Green for positive
  if (value < 0) return '#EF4444'; // Red for negative
  return '#6B7280'; // Gray for zero
};