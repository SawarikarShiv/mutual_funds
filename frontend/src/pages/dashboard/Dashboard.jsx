import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  ShowChart,
  Wallet,
  Savings,
  AutoGraph,
  Security,
  Notifications,
  Search,
  FilterList,
  MoreVert,
  Download,
  Share,
  Add,
  ArrowUpward,
  ArrowDownward,
  PieChart,
  BarChart,
  Timeline,
  Receipt,
  PersonAdd,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import InfinityLogo from '../../components/branding/InfinityLogo';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [portfolioData, setPortfolioData] = useState({
    totalInvestment: 1250000,
    currentValue: 1450000,
    totalReturns: 200000,
    totalReturnsPercentage: 16.0,
    riskScore: 65,
    holdings: 8,
    activeSIPs: 3,
    clients: 24,
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Portfolio Performance Chart Data
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [1000000, 1050000, 1100000, 1080000, 1150000, 1200000, 1250000, 1300000, 1350000, 1400000, 1420000, 1450000],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  // Asset Allocation Data
  const assetAllocationData = {
    labels: ['Equity', 'Debt', 'Hybrid', 'Gold', 'Others'],
    datasets: [
      {
        data: [45, 30, 15, 5, 5],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.accent?.main || '#ff6f00',
          theme.palette.text.secondary,
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  // Top Performing Funds
  const topFunds = [
    {
      name: 'Infinity Bluechip Fund',
      category: 'Equity',
      returns: 18.5,
      risk: 'High',
      nav: 125.50,
      change: 2.5,
    },
    {
      name: 'Infinity Debt Advantage',
      category: 'Debt',
      returns: 8.2,
      risk: 'Low',
      nav: 45.20,
      change: 0.8,
    },
    {
      name: 'Infinity Hybrid Fund',
      category: 'Hybrid',
      returns: 12.3,
      risk: 'Moderate',
      nav: 78.90,
      change: 1.2,
    },
  ];

  // Recent Transactions
  const recentTransactions = [
    { type: 'Purchase', fund: 'Infinity Bluechip', amount: 50000, date: '2024-01-15', status: 'Completed' },
    { type: 'SIP', fund: 'Infinity Hybrid', amount: 10000, date: '2024-01-10', status: 'Active' },
    { type: 'Redemption', fund: 'Infinity Debt', amount: 25000, date: '2024-01-05', status: 'Completed' },
    { type: 'Purchase', fund: 'Infinity Gold', amount: 15000, date: '2024-01-01', status: 'Pending' },
  ];

  const statsCards = [
    {
      title: 'Total Investment',
      value: portfolioData.totalInvestment,
      icon: <AccountBalance />,
      color: theme.palette.primary.main,
      change: '+5.2%',
      trend: 'up',
    },
    {
      title: 'Current Value',
      value: portfolioData.currentValue,
      icon: <ShowChart />,
      color: theme.palette.success.main,
      change: '+16.0%',
      trend: 'up',
    },
    {
      title: 'Total Returns',
      value: portfolioData.totalReturns,
      icon: <TrendingUp />,
      color: theme.palette.success.main,
      change: formatPercentage(portfolioData.totalReturnsPercentage),
      trend: 'up',
    },
    {
      title: 'Active Clients',
      value: portfolioData.clients,
      icon: <PersonAdd />,
      color: theme.palette.accent?.main || '#ff6f00',
      change: '+3 this month',
      trend: 'up',
    },
  ];

  const quickActions = [
    { label: 'New Investment', icon: <Add />, color: 'primary', action: () => navigate('/app/funds') },
    { label: 'Start SIP', icon: <AutoGraph />, color: 'success', action: () => navigate('/app/sip') },
    { label: 'Redeem', icon: <Wallet />, color: 'warning', action: () => navigate('/app/transactions') },
    { label: 'Add Client', icon: <PersonAdd />, color: 'accent', action: () => navigate('/app/clients') },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InfinityLogo size="medium" />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Welcome back, Partner!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Here's your complete financial dashboard overview
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => window.print()}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/app/funds')}
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                New Investment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 10px 30px ${alpha(stat.color, 0.2)}`,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      background: alpha(stat.color, 0.1),
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: { fontSize: 24, color: stat.color },
                    })}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    icon={stat.trend === 'up' ? <ArrowUpward sx={{ fontSize: 14 }} /> : 
                          stat.trend === 'down' ? <ArrowDownward sx={{ fontSize: 14 }} /> : null}
                    sx={{
                      backgroundColor: stat.trend === 'up' ? alpha(theme.palette.success.main, 0.1) :
                                      stat.trend === 'down' ? alpha(theme.palette.error.main, 0.1) :
                                      alpha(theme.palette.text.secondary, 0.1),
                      color: stat.trend === 'up' ? theme.palette.success.main :
                             stat.trend === 'down' ? theme.palette.error.main :
                             theme.palette.text.secondary,
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 1 }}>
                  {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={action.icon}
                onClick={action.action}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  borderWidth: 2,
                  borderColor: alpha(theme.palette[action.color]?.main || theme.palette.primary.main, 0.3),
                  color: theme.palette[action.color]?.main || theme.palette.primary.main,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: theme.palette[action.color]?.main || theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette[action.color]?.main || theme.palette.primary.main, 0.05),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                Portfolio Performance
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Timeline />} variant="outlined">
                  1Y
                </Button>
                <Button size="small" startIcon={<BarChart />} variant="outlined">
                  6M
                </Button>
                <Button size="small" startIcon={<PieChart />} variant="outlined">
                  3M
                </Button>
              </Box>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value) {
                          return '₹' + formatCurrency(value);
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Asset Allocation
            </Typography>
            <Box sx={{ height: 250, mb: 3 }}>
              <Doughnut
                data={assetAllocationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '70%',
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Box>
            <Grid container spacing={1}>
              {assetAllocationData.labels.map((label, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: assetAllocationData.datasets[0].backgroundColor[index],
                      }}
                    />
                    <Typography variant="body2">{label}</Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ ml: 'auto' }}>
                      {assetAllocationData.datasets[0].data[index]}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
              Top Performing Funds
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fund Name</TableCell>
                    <TableCell align="right">Returns</TableCell>
                    <TableCell align="right">NAV</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topFunds.map((fund, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {fund.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {fund.category} • {fund.risk} Risk
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body1"
                          sx={{
                            color: fund.returns >= 0 ? theme.palette.success.main : theme.palette.error.main,
                            fontWeight: 600,
                          }}
                        >
                          {formatPercentage(fund.returns)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600}>
                          ₹{fund.nav}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: fund.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                          }}
                        >
                          {fund.change >= 0 ? '+' : ''}{fund.change}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/app/funds`)}
                        >
                          Invest
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight={700}>
                Recent Transactions
              </Typography>
              <Button size="small" startIcon={<FilterList />} variant="outlined">
                Filter
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {transaction.type} • {transaction.fund}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.date).toLocaleDateString('en-IN')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" fontWeight={600}>
                          ₹{formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={transaction.status}
                          size="small"
                          sx={{
                            backgroundColor: transaction.status === 'Completed' ? alpha(theme.palette.success.main, 0.1) :
                                            transaction.status === 'Active' ? alpha(theme.palette.primary.main, 0.1) :
                                            alpha(theme.palette.warning.main, 0.1),
                            color: transaction.status === 'Completed' ? theme.palette.success.main :
                                   transaction.status === 'Active' ? theme.palette.primary.main :
                                   theme.palette.warning.main,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Client Stats */}
      <Paper sx={{ p: 3, borderRadius: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Client Overview
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="primary.main">
                {portfolioData.clients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Clients
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="success.main">
                {portfolioData.activeSIPs}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active SIPs
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AvatarGroup total={portfolioData.clients} sx={{ justifyContent: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>B</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>C</Avatar>
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Client Portfolio
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;