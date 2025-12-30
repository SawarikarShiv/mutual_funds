import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import {
  fetchPortfolioSummary,
  fetchHoldings,
} from '../redux/slices/portfolioSlice';

export const usePortfolio = () => {
  const dispatch = useDispatch();
  const {
    summary,
    holdings,
    performance,
    riskAnalysis,
    assetAllocation,
    loading,
    error,
    metrics,
  } = useSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolioSummary());
    dispatch(fetchHoldings({}));
  }, [dispatch]);

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (!holdings.length) return metrics;

    const totalInvestment = holdings.reduce(
      (sum, holding) => sum + (holding.investedAmount || 0),
      0
    );
    const currentValue = holdings.reduce(
      (sum, holding) => sum + (holding.currentValue || 0),
      0
    );
    const totalGain = currentValue - totalInvestment;
    const totalGainPercentage = totalInvestment > 0 
      ? (totalGain / totalInvestment) * 100 
      : 0;

    return {
      ...metrics,
      totalInvestment,
      currentValue,
      totalGain,
      totalGainPercentage,
    };
  }, [holdings, metrics]);

  // Group holdings by category
  const holdingsByCategory = useMemo(() => {
    const groups = {};
    holdings.forEach(holding => {
      const category = holding.fund?.category || 'Others';
      if (!groups[category]) {
        groups[category] = {
          category,
          holdings: [],
          totalValue: 0,
          percentage: 0,
        };
      }
      groups[category].holdings.push(holding);
      groups[category].totalValue += holding.currentValue || 0;
    });

    const total = Object.values(groups).reduce(
      (sum, group) => sum + group.totalValue,
      0
    );

    Object.values(groups).forEach(group => {
      group.percentage = total > 0 ? (group.totalValue / total) * 100 : 0;
    });

    return Object.values(groups);
  }, [holdings]);

  return {
    summary,
    holdings,
    performance,
    riskAnalysis,
    assetAllocation,
    loading,
    error,
    metrics: derivedMetrics,
    holdingsByCategory,
  };
};