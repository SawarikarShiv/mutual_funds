export const calculateXIRR = (cashFlows, dates) => {
  // Simple XIRR approximation
  if (cashFlows.length !== dates.length || cashFlows.length < 2) {
    return 0;
  }

  let minDate = new Date(dates[0]);
  let maxDate = new Date(dates[0]);
  
  dates.forEach(date => {
    const d = new Date(date);
    if (d < minDate) minDate = d;
    if (d > maxDate) maxDate = d;
  });

  const years = (maxDate - minDate) / (1000 * 60 * 60 * 24 * 365.25);
  if (years <= 0) return 0;

  const totalInvestment = cashFlows
    .filter(cf => cf < 0)
    .reduce((sum, cf) => sum + Math.abs(cf), 0);
  
  const finalValue = cashFlows[cashFlows.length - 1];
  
  if (totalInvestment === 0) return 0;

  const cagr = Math.pow(finalValue / totalInvestment, 1 / years) - 1;
  return cagr * 100; // Return as percentage
};

export const calculateReturns = (purchasePrice, currentPrice, quantity) => {
  const investedAmount = purchasePrice * quantity;
  const currentValue = currentPrice * quantity;
  const absoluteReturn = currentValue - investedAmount;
  const percentageReturn = (absoluteReturn / investedAmount) * 100;
  
  return {
    investedAmount,
    currentValue,
    absoluteReturn,
    percentageReturn,
  };
};

export const calculateRiskScore = (holdings) => {
  if (!holdings.length) return 0;
  
  const riskWeights = {
    'Equity': 0.8,
    'Hybrid': 0.5,
    'Debt': 0.2,
    'Other': 0.3,
  };

  let totalValue = 0;
  let weightedRisk = 0;

  holdings.forEach(holding => {
    const value = holding.currentValue || 0;
    const category = holding.fund?.category || 'Other';
    const riskWeight = riskWeights[category] || 0.3;
    
    totalValue += value;
    weightedRisk += value * riskWeight;
  });

  return totalValue > 0 ? (weightedRisk / totalValue) * 10 : 0; // Scale 0-10
};

export const calculatePortfolioMetrics = (holdings) => {
  if (!holdings.length) {
    return {
      totalInvestment: 0,
      currentValue: 0,
      totalGain: 0,
      totalGainPercentage: 0,
      dayGain: 0,
      dayGainPercentage: 0,
    };
  }

  let totalInvestment = 0;
  let currentValue = 0;
  let dayGain = 0;

  holdings.forEach(holding => {
    totalInvestment += holding.investedAmount || 0;
    currentValue += holding.currentValue || 0;
    dayGain += holding.dayGain || 0;
  });

  const totalGain = currentValue - totalInvestment;
  const totalGainPercentage = totalInvestment > 0 
    ? (totalGain / totalInvestment) * 100 
    : 0;
  const dayGainPercentage = currentValue > 0 
    ? (dayGain / currentValue) * 100 
    : 0;

  return {
    totalInvestment,
    currentValue,
    totalGain,
    totalGainPercentage,
    dayGain,
    dayGainPercentage,
  };
};