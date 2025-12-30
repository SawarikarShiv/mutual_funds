import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Tabs,
  Tab,
  Rating,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  FilterList,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  AccountBalance,
  ShowChart,
  Security,
  AttachMoney,
  Download,
  Share,
  CompareArrows,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InfinityMutualFundsLogo from '../../components/branding/InfinityLogo';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const InfinityFundsExplorer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    category: 'all',
    risk: 'all',
    rating: 0,
    minReturn: 0,
    maxReturn: 50,
    sortBy: 'returns',
  });
  const [favorites, setFavorites] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabChange(newValue);
  };

  const handleFilterChange = (filter, value) => {
    setFilters({ ...filters, [filter]: value });
  };

  const toggleFavorite = (fundId) => {
    if (favorites.includes(fundId)) {
      setFavorites(favorites.filter(id => id !== fundId));
    } else {
      setFavorites([...favorites, fundId]);
    }
  };

  const categories = [
    { value: 'equity', label: 'Equity Funds', count: 45 },
    { value: 'debt', label: 'Debt Funds', count: 32 },
    { value: 'hybrid', label: 'Hybrid Funds', count: 28 },
    { value: 'elss', label: 'ELSS', count: 15 },
    { value: 'sectoral', label: 'Sectoral Funds', count: 20 },
    { value: 'index', label: 'Index Funds', count: 12 },
  ];

  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: 'success' },
    { value: 'moderate', label: 'Moderate', color: 'warning' },
    { value: 'high', label: 'High Risk', color: 'error' },
  ];

  const sampleFunds = [
    {
      id: 1,
      name: 'Infinity Bluechip Fund',
      category: 'Equity',
      fundHouse: 'Infinity Mutual',
      nav: 125.50,
      change: 2.5,
      oneYearReturn: 18.5,
      threeYearReturn: 22.3,
      risk: 'High',
      rating: 4.5,
      aum: 1250,
      expenseRatio: 1.2,
      minInvestment: 5000,
      description: 'Large cap equity fund with consistent performance',
      tags: ['Large Cap', 'Growth', 'High Returns'],
    },
    {
      id: 2,
      name: 'Infinity Debt Advantage',
      category: 'Debt',
      fundHouse: 'Infinity Mutual',
      nav: 45.20,
      change: 0.8,
      oneYearReturn: 8.2,
      threeYearReturn: 9.5,
      risk: 'Low',
      rating: 4.2,
      aum: 850,
      expenseRatio: 0.8,
      minInvestment: 1000,
      description: 'Corporate bond fund with stable returns',
      tags: ['Corporate Bonds', 'Stable', 'Low Risk'],
    },
    {
      id: 3,
      name: 'Infinity Hybrid Advantage',
      category: 'Hybrid',
      fundHouse: 'Infinity Mutual',
      nav: 78.90,
      change: 1.2,
      oneYearReturn: 12.3,
      threeYearReturn: 14.8,
      risk: 'Moderate',
      rating: 4.7,
      aum: 920,
      expenseRatio: 1.0,
      minInvestment: 5000,
      description: 'Balanced fund with equity and debt allocation',
      tags: ['Balanced', 'Diversified', 'Moderate Risk'],
    },
    {
      id: 4,
      name: 'Infinity Small Cap Fund',
      category: 'Equity',
      fundHouse: 'Infinity Mutual',
      nav: 95.30,
      change: 3.2,
      oneYearReturn: 24.8,
      threeYearReturn: 28.5,
      risk: 'High',
      rating: 4.3,
      aum: 680,
      expenseRatio: 1.5,
      minInvestment: 5000,
      description: 'Small cap fund for aggressive investors',
      tags: ['Small Cap', 'High Growth', 'Aggressive'],
    },
    {
      id: 5,
      name: 'Infinity Liquid Fund',
      category: 'Debt',
      fundHouse: 'Infinity Mutual',
      nav: 102.50,
      change: 0.3,
      oneYearReturn: 6.5,
      threeYearReturn: 7.2,
      risk: 'Low',
      rating: 4.0,
      aum: 2100,
      expenseRatio: 0.2,
      minInvestment: 1000,
      description: 'Ultra short term debt fund for liquidity',
      tags: ['Liquid', 'Ultra Short', 'Parking'],
    },
    {
      id: 6,
      name: 'Infinity Gold Fund',
      category: 'Others',
      fundHouse: 'Infinity Mutual',
      nav: 112.80,
      change: -0.5,
      oneYearReturn: -2.3,
      threeYearReturn: 5.8,
      risk: 'Moderate',
      rating: 3.8,
      aum: 350,
      expenseRatio: 1.8,
      minInvestment: 5000,
      description: 'Gold ETF fund for portfolio diversification',
      tags: ['Gold', 'ETF', 'Diversification'],
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InfinityMutualFundsLogo size="medium" />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Infinity Funds Explorer
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Discover and invest in top-performing mutual funds
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CompareArrows />}
                onClick={() => navigate('/compare')}
              >
                Compare Funds
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Download List
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="primary.main">
                152
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Funds
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="success.main">
                12.8%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. 1Y Return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="warning.main">
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fund Houses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.accent?.main || '#ff6f00', 0.1)} 0%, ${alpha(theme.palette.accent?.main || '#ff6f00', 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.accent?.main || '#ff6f00', 0.2)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={800} color="accent.main">
                ₹2,450Cr
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total AUM
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search funds by name, category, or fund house..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                label="Sort By"
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="returns">Highest Returns</MenuItem>
                <MenuItem value="rating">Highest Rating</MenuItem>
                <MenuItem value="nav">Lowest NAV</MenuItem>
                <MenuItem value="aum">Highest AUM</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Advanced Filters */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: 200 }}>
                <Typography gutterBottom>Risk Level</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {riskLevels.map((risk) => (
                    <Chip
                      key={risk.value}
                      label={risk.label}
                      clickable
                      onClick={() => handleFilterChange('risk', risk.value)}
                      color={filters.risk === risk.value ? risk.color : 'default'}
                      variant={filters.risk === risk.value ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ minWidth: 200 }}>
                <Typography gutterBottom>Minimum Rating</Typography>
                <Rating
                  value={filters.rating}
                  onChange={(event, newValue) => handleFilterChange('rating', newValue)}
                  precision={0.5}
                  icon={<Star fontSize="inherit" />}
                  emptyIcon={<StarBorder fontSize="inherit" />}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography gutterBottom>1-Year Return Range</Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={[filters.minReturn, filters.maxReturn]}
                    onChange={(event, newValue) => {
                      handleFilterChange('minReturn', newValue[0]);
                      handleFilterChange('maxReturn', newValue[1]);
                    }}
                    valueLabelDisplay="auto"
                    min={-20}
                    max={50}
                    step={5}
                    valueLabelFormat={(value) => `${value}%`}
                    sx={{
                      color: theme.palette.primary.main,
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">-20%</Typography>
                    <Typography variant="caption">50%</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Category Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            borderRadius: 2,
            mx: 0.5,
          },
        }}
      >
        <Tab label="All Funds" />
        <Tab label="Equity" />
        <Tab label="Debt" />
        <Tab label="Hybrid" />
        <Tab label="ELSS" />
        <Tab label="Sectoral" />
        <Tab label="Index" />
      </Tabs>

      {/* Funds Grid */}
      <Grid container spacing={3}>
        {sampleFunds.map((fund) => (
          <Grid item xs={12} md={6} lg={4} key={fund.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Fund Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {fund.fundHouse}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {fund.name}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(fund.id)}
                    sx={{
                      color: favorites.includes(fund.id) ? theme.palette.error.main : 'inherit',
                    }}
                  >
                    {favorites.includes(fund.id) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Box>

                {/* Category and Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Chip
                    label={fund.category}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                    <Rating value={fund.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                      {fund.rating}
                    </Typography>
                  </Box>
                </Box>

                {/* Fund Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        NAV
                      </Typography>
                      <Typography variant="h5" fontWeight={700}>
                        ₹{fund.nav}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: fund.change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {fund.change >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                        {Math.abs(fund.change)}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        1Y Return
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                          color: fund.oneYearReturn >= 0 ? theme.palette.success.main : theme.palette.error.main,
                        }}
                      >
                        {formatPercentage(fund.oneYearReturn)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Risk and AUM */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security fontSize="small" color="action" />
                      <Typography variant="body2">
                        {fund.risk} Risk
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalance fontSize="small" color="action" />
                      <Typography variant="body2">
                        ₹{fund.aum}Cr AUM
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Tags */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
                  {fund.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: alpha(theme.palette.text.secondary, 0.3),
                      }}
                    />
                  ))}
                </Box>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" paragraph>
                  {fund.description}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/funds/${fund.id}`)}
                    startIcon={<ShowChart />}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/invest/${fund.id}`)}
                    startIcon={<AttachMoney />}
                    sx={{
                      borderRadius: 2,
                      minWidth: 'auto',
                      px: 2,
                    }}
                  >
                    Invest
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Why Choose Infinity */}
      <Paper sx={{ p: 4, borderRadius: 4, mt: 4 }}>
        <Typography variant="h4" fontWeight={800} textAlign="center" gutterBottom>
          Why Choose Infinity Mutual Funds?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 2,
                }}
              >
                <Security sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Secure & Regulated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All funds are SEBI registered with complete transparency
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                  mb: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Consistent Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Proven track record of superior risk-adjusted returns
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ff6f00 0%, #ffab00 100%)',
                  mb: 2,
                }}
              >
                <AccountBalance sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Expert Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Managed by experienced fund managers with deep expertise
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default InfinityFundsExplorer;