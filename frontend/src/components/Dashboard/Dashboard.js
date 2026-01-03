import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { usePortfolio } from '../../hooks/usePortfolio';
import PortfolioSummary from './PortfolioSummary';
import RecentTransactions from './RecentTransactions';
import Watchlist from './Watchlist';
import RiskMeter from '../Common/Charts/RiskMeter';
import LineChart from '../Common/Charts/LineChart';
import './Dashboard.css';

const Dashboard = () => {
  const { portfolio, loading } = usePortfolio();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Calculate dashboard stats
    if (portfolio) {
      const totalValue = portfolio.totalValue || 0;
      const todayChange = portfolio.todayChange || 0;
      const totalGain = portfolio.totalGain || 0;
      const investedAmount = portfolio.investedAmount || 0;

      setStats([
        {
          title: 'Portfolio Value',
          value: `₹${totalValue.toLocaleString()}`,
          change: todayChange,
          icon: <DollarSign />,
          color: 'blue',
        },
        {
          title: 'Total Returns',
          value: `₹${totalGain.toLocaleString()}`,
          change: investedAmount > 0 ? (totalGain / investedAmount) * 100 : 0,
          icon: <TrendingUp />,
          color: totalGain >= 0 ? 'green' : 'red',
        },
        {
          title: 'Current Investment',
          value: `₹${investedAmount.toLocaleString()}`,
          change: 0,
          icon: <PieChartIcon />,
          color: 'purple',
        },
        {
          title: 'Risk Score',
          value: 'Medium',
          change: 0,
          icon: <TrendingDown />,
          color: 'orange',
        },
      ]);
    }
  }, [portfolio]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your financial overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              {stat.change !== 0 && (
                <p className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="content-left">
          <div className="chart-section">
            <h2 className="section-title">Portfolio Performance</h2>
            <LineChart />
          </div>
          
          <div className="portfolio-section">
            <PortfolioSummary />
          </div>
        </div>

        <div className="content-right">
          <div className="risk-section">
            <h2 className="section-title">Risk Profile</h2>
            <RiskMeter />
          </div>
          
          <div className="transactions-section">
            <RecentTransactions />
          </div>
          
          <div className="watchlist-section">
            <Watchlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;