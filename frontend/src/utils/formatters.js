export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value, decimals = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  
  switch (format) {
    case 'DD/MM/YYYY':
      return d.toLocaleDateString('en-IN');
    case 'MMM DD, YYYY':
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    case 'YYYY-MM-DD':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString();
  }
};

export const formatNumber = (num, decimals = 2) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(decimals) + 'Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(decimals) + 'L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  }
  return num.toFixed(decimals);
};

export const formatRiskLevel = (score) => {
  if (score <= 3) return { level: 'Low', color: 'green' };
  if (score <= 7) return { level: 'Medium', color: 'orange' };
  return { level: 'High', color: 'red' };
};