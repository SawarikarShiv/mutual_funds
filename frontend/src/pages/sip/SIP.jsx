import React, { useState, useEffect } from 'react';
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormLabel,
  useTheme,
  alpha,
  Slider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  PlayArrow,
  Pause,
  Stop,
  Edit,
  Delete,
  Download,
  Print,
  Share,
  TrendingUp,
  CalendarToday,
  AccountBalance,
  AutoGraph,
  AttachMoney,
  Savings,
  Schedule,
  Notifications,
  QrCode,
  CompareArrows,
  BarChart,
  PieChart,
  Timeline,
  History,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Info,
  MoreVert,
  FileDownload,
  Receipt,
  Visibility,
  PhoneAndroid,
  Laptop,
  Tablet,
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
import { formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';

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

const SIP = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newSipDialogOpen, setNewSipDialogOpen] = useState(false);
  const [editSipDialogOpen, setEditSipDialogOpen] = useState(false);
  const [viewSipDialogOpen, setViewSipDialogOpen] = useState(false);
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false);
  const [selectedSIP, setSelectedSIP] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    fund: 'all',
    frequency: 'all',
    amountRange: [500, 50000],
  });

  const [newSipData, setNewSipData] = useState({
    fund: '',
    amount: 1000,
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    duration: 60, // months
    paymentMethod: 'auto-debit',
    bankAccount: '',
    mandateId: '',
  });

  const [calculatorData, setCalculatorData] = useState({
    monthlyInvestment: 5000,
    expectedReturn: 12,
    duration: 5, // years
    frequency: 'monthly',
  });

  const sipStatuses = [
    { value: 'active', label: 'Active', color: 'success', icon: <PlayArrow /> },
    { value: 'paused', label: 'Paused', color: 'warning', icon: <Pause /> },
    { value: 'completed', label: 'Completed', color: 'info', icon: <CheckCircle /> },
    { value: 'cancelled', label: 'Cancelled', color: 'error', icon: <Stop /> },
    { value: 'pending', label: 'Pending', color: 'default', icon: <Schedule /> },
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  const sampleSIPs = [
    {
      id: 'SIP123456789',
      fundName: 'Infinity Bluechip Fund',
      fundHouse: 'Infinity Mutual',
      amount: 10000,
      frequency: 'monthly',
      startDate: '2023-01-15',
      nextDate: '2024-02-15',
      endDate: '2028-01-15',
      status: 'active',
      units: 2564.32,
      totalInvested: 130000,
      currentValue: 156800,
      returns: 20.62,
      installments: 13,
      totalInstallments: 60,
      paymentMethod: 'Auto Debit',
      bankAccount: 'XXXXXX1234',
      mandateId: 'MAND123456',
      lastPaymentDate: '2024-01-15',
      lastPaymentStatus: 'success',
    },
    {
      id: 'SIP987654321',
      fundName: 'Infinity Hybrid Fund',
      fundHouse: 'Infinity Mutual',
      amount: 5000,
      frequency: 'monthly',
      startDate: '2023-03-10',
      nextDate: '2024-02-10',
      endDate: '2026-03-10',
      status: 'active',
      units: 1892.15,
      totalInvested: 55000,
      currentValue: 63250,
      returns: 15.00,
      installments: 11,
      totalInstallments: 36,
      paymentMethod: 'Auto Debit',
      bankAccount: 'XXXXXX5678',
      mandateId: 'MAND987654',
      lastPaymentDate: '2024-01-10',
      lastPaymentStatus: 'success',
    },
    {
      id: 'SIP456789123',
      fundName: 'Infinity Debt Advantage',
      fundHouse: 'Infinity Mutual',
      amount: 3000,
      frequency: 'monthly',
      startDate: '2022-06-01',
      nextDate: '2024-02-01',
      endDate: '2025-06-01',
      status: 'active',
      units: 1234.56,
      totalInvested: 60000,
      currentValue: 65400,
      returns: 9.00,
      installments: 20,
      totalInstallments: 36,
      paymentMethod: 'Auto Debit',
      bankAccount: 'XXXXXX9012',
      mandateId: 'MAND456789',
      lastPaymentDate: '2024-01-01',
      lastPaymentStatus: 'success',
    },
    {
      id: 'SIP789123456',
      fundName: 'Infinity Small Cap Fund',
      fundHouse: 'Infinity Mutual',
      amount: 2000,
      frequency: 'monthly',
      startDate: '2023-08-20',
      nextDate: '2024-02-20',
      endDate: '2026-08-20',
      status: 'paused',
      units: 456.78,
      totalInvested: 10000,
      currentValue: 11200,
      returns: 12.00,
      installments: 5,
      totalInstallments: 36,
      paymentMethod: 'Auto Debit',
      bankAccount: 'XXXXXX3456',
      mandateId: 'MAND789123',
      lastPaymentDate: '2023-12-20',
      lastPaymentStatus: 'success',
    },
    {
      id: 'SIP321654987',
      fundName: 'Infinity ELSS Fund',
      fundHouse: 'Infinity Mutual',
      amount: 15000,
      frequency: 'monthly',
      startDate: '2022-01-01',
      nextDate: '2024-02-01',
      endDate: '2027-01-01',
      status: 'completed',
      units: 3125.00,
      totalInvested: 375000,
      currentValue: 468750,
      returns: 25.00,
      installments: 25,
      totalInstallments: 60,
      paymentMethod: 'Auto Debit',
      bankAccount: 'XXXXXX7890',
      mandateId: 'MAND321654',
      lastPaymentDate: '2024-01-01',
      lastPaymentStatus: 'success',
    },
    {
      id: 'SIP654987321',
      fundName: 'Infinity Gold Fund',
      fundHouse: 'Infinity Mutual',
      amount: 2500,
      frequency: 'monthly',
      startDate: '2023-11-05',
      nextDate: '2024-02-05',
      endDate: '2026-11-05',
      status: 'pending',
      units: 112.50,
      totalInvested: 7500,
      currentValue: 7125,
      returns: -5.00,
      installments: 3,
      totalInstallments: 36,
      paymentMethod: 'Manual',
      bankAccount: 'XXXXXX2345',
      mandateId: 'PENDING',
      lastPaymentDate: '2024-01-05',
      lastPaymentStatus: 'pending',
    },
  ];

  const stats = {
    totalSIPs: 6,
    activeSIPs: 3,
    totalMonthlyInvestment: 18000,
    totalInvested: 587500,
    totalCurrentValue: 706525,
    totalReturns: 119025,
    avgReturns: 14.52,
    successRate: 95.8,
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSipAction = (action, sip) => {
    switch (action) {
      case 'pause':
        console.log('Pausing SIP:', sip.id);
        break;
      case 'resume':
        console.log('Resuming SIP:', sip.id);
        break;
      case 'stop':
        console.log('Stopping SIP:', sip.id);
        break;
      case 'edit':
        setSelectedSIP(sip);
        setEditSipDialogOpen(true);
        break;
      case 'view':
        setSelectedSIP(sip);
        setViewSipDialogOpen(true);
        break;
      case 'delete':
        console.log('Deleting SIP:', sip.id);
        break;
      default:
        break;
    }
  };

  const handleNewSipSubmit = () => {
    console.log('Creating new SIP:', newSipData);
    setNewSipDialogOpen(false);
    setNewSipData({
      fund: '',
      amount: 1000,
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      duration: 60,
      paymentMethod: 'auto-debit',
      bankAccount: '',
      mandateId: '',
    });
    setActiveStep(0);
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateSIPReturns = () => {
    const { monthlyInvestment, expectedReturn, duration, frequency } = calculatorData;
    const n = duration * 12; // convert years to months
    const r = expectedReturn / 100 / 12; // monthly rate
    
    let totalInvestment = monthlyInvestment * n;
    let futureValue = 0;
    
    if (frequency === 'monthly') {
      futureValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    } else if (frequency === 'quarterly') {
      const quarterlyInvestment = monthlyInvestment * 3;
      const quarterlyRate = Math.pow(1 + r, 3) - 1;
      futureValue = quarterlyInvestment * ((Math.pow(1 + quarterlyRate, n/3) - 1) / quarterlyRate) * (1 + quarterlyRate);
    }
    
    return {
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(futureValue - totalInvestment),
      futureValue: Math.round(futureValue),
      xirr: expectedReturn,
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <PlayArrow />;
      case 'paused': return <Pause />;
      case 'completed': return <CheckCircle />;
      case 'cancelled': return <Stop />;
      case 'pending': return <Schedule />;
      default: return <Schedule />;
    }
  };

  // Chart data
  const sipGrowthData = {
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    datasets: [
      {
        label: 'Total Investment',
        data: [60000, 120000, 180000, 240000, 300000],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Estimated Value',
        data: [64500, 138000, 223000, 322000, 438000],
        borderColor: theme.palette.success.main,
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const sipDistributionData = {
    labels: ['Equity SIPs', 'Debt SIPs', 'Hybrid SIPs', 'ELSS SIPs', 'Others'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.secondary.main,
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const filteredSIPs = sampleSIPs.filter(sip => {
    if (filters.search && !sip.id.toLowerCase().includes(filters.search.toLowerCase()) && 
        !sip.fundName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && sip.status !== filters.status) {
      return false;
    }
    if (filters.fund !== 'all' && sip.fundName !== filters.fund) {
      return false;
    }
    if (filters.frequency !== 'all' && sip.frequency !== filters.frequency) {
      return false;
    }
    if (sip.amount < filters.amountRange[0] || sip.amount > filters.amountRange[1]) {
      return false;
    }
    return true;
  });

  const calculatorResults = calculateSIPReturns();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InfinityLogo size="medium" />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Systematic Investment Plans (SIP)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Automate your investments and build wealth systematically
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<BarChart />}
                onClick={() => setCalculatorDialogOpen(true)}
              >
                SIP Calculator
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setNewSipDialogOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                New SIP
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h2" fontWeight={800} color="primary.main" gutterBottom>
                {stats.totalSIPs}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total SIPs
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Chip label={`${stats.activeSIPs} Active`} size="small" color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h2" fontWeight={800} color="success.main" gutterBottom>
                {formatCurrency(stats.totalMonthlyInvestment)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Investment
              </Typography>
              <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                +5.2% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h2" fontWeight={800} color="warning.main" gutterBottom>
                {formatCurrency(stats.totalCurrentValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Value
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main">
                  {formatPercentage(stats.avgReturns)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h2" fontWeight={800} color="info.main" gutterBottom>
                {formatPercentage(stats.successRate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                98/102 payments successful
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
            },
          }}
        >
          <Tab icon={<AutoGraph />} label="All SIPs" />
          <Tab icon={<PlayArrow />} label="Active" />
          <Tab icon={<Pause />} label="Paused" />
          <Tab icon={<CheckCircle />} label="Completed" />
          <Tab icon={<Schedule />} label="Pending" />
          <Tab icon={<Timeline />} label="Growth" />
          <Tab icon={<History />} label="History" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Search and Filter Bar */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by SIP ID or Fund Name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
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
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Status"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {sipStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={filters.frequency}
                  onChange={(e) => handleFilterChange('frequency', e.target.value)}
                  label="Frequency"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">All Frequencies</MenuItem>
                  {frequencies.map((freq) => (
                    <MenuItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Min Amount"
                type="number"
                value={filters.amountRange[0]}
                onChange={(e) => handleFilterChange('amountRange', [parseInt(e.target.value), filters.amountRange[1]])}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => handleFilterChange('showAdvanced', true)}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    SIP Growth Projection
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<Timeline />} variant="outlined">
                      5Y
                    </Button>
                    <Button size="small" startIcon={<BarChart />} variant="outlined">
                      3Y
                    </Button>
                    <Button size="small" startIcon={<PieChart />} variant="outlined">
                      1Y
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ height: 250 }}>
                  <Line
                    data={sipGrowthData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
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
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  SIP Distribution
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Doughnut
                    data={sipDistributionData}
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
              </Card>
            </Grid>
          </Grid>

          {/* SIPs Table */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Your Systematic Investment Plans
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Refresh">
                    <IconButton onClick={() => setLoading(true)}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export">
                    <IconButton onClick={() => console.log('Export SIPs')}>
                      <FileDownload />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton onClick={() => window.print()}>
                      <Print />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SIP ID</TableCell>
                      <TableCell>Fund Details</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Next Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Returns</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <LinearProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredSIPs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography color="text.secondary" py={3}>
                            No SIPs found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSIPs
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((sip) => (
                          <TableRow key={sip.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {sip.id}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Started: {formatDate(sip.startDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {sip.fundName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {sip.fundHouse}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {sip.units.toFixed(2)} units
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight={600}>
                                ₹{formatCurrency(sip.amount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {sip.installments}/{sip.totalInstallments} installments
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={sip.frequency.charAt(0).toUpperCase() + sip.frequency.slice(1)}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {formatDate(sip.nextDate)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Auto debit
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(sip.status)}
                                label={sip.status.charAt(0).toUpperCase() + sip.status.slice(1)}
                                size="small"
                                color={getStatusColor(sip.status)}
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body1"
                                sx={{
                                  color: sip.returns >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                  fontWeight: 600,
                                }}
                              >
                                {formatPercentage(sip.returns)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ₹{formatCurrency(sip.currentValue - sip.totalInvested)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleSipAction('view', sip)}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit SIP">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleSipAction('edit', sip)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                                {sip.status === 'active' && (
                                  <Tooltip title="Pause SIP">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleSipAction('pause', sip)}
                                    >
                                      <Pause />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                {sip.status === 'paused' && (
                                  <Tooltip title="Resume SIP">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleSipAction('resume', sip)}
                                    >
                                      <PlayArrow />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="More Actions">
                                  <IconButton size="small">
                                    <MoreVert />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredSIPs.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* New SIP Dialog */}
      <Dialog
        open={newSipDialogOpen}
        onClose={() => setNewSipDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Start New Systematic Investment Plan
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step><StepLabel>Select Fund</StepLabel></Step>
            <Step><StepLabel>Configure SIP</StepLabel></Step>
            <Step><StepLabel>Payment Setup</StepLabel></Step>
            <Step><StepLabel>Review & Confirm</StepLabel></Step>
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Select Mutual Fund
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Select Fund"
                    value={newSipData.fund}
                    onChange={(e) => setNewSipData({ ...newSipData, fund: e.target.value })}
                  >
                    <MenuItem value="infinity-bluechip">Infinity Bluechip Fund</MenuItem>
                    <MenuItem value="infinity-hybrid">Infinity Hybrid Fund</MenuItem>
                    <MenuItem value="infinity-debt">Infinity Debt Advantage</MenuItem>
                    <MenuItem value="infinity-smallcap">Infinity Small Cap Fund</MenuItem>
                    <MenuItem value="infinity-elss">Infinity ELSS Fund</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Card sx={{ p: 2, background: alpha(theme.palette.info.main, 0.05) }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Recommended:</strong> Infinity Bluechip Fund - 15.2% average returns, suitable for long-term wealth creation
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Configure Your SIP
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SIP Amount (₹)"
                    type="number"
                    value={newSipData.amount}
                    onChange={(e) => setNewSipData({ ...newSipData, amount: parseInt(e.target.value) })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Minimum: ₹500 | Maximum: ₹1,00,000
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={newSipData.frequency}
                      onChange={(e) => setNewSipData({ ...newSipData, frequency: e.target.value })}
                      label="Frequency"
                    >
                      {frequencies.map((freq) => (
                        <MenuItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={newSipData.startDate}
                    onChange={(e) => setNewSipData({ ...newSipData, startDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration (months)"
                    type="number"
                    value={newSipData.duration}
                    onChange={(e) => setNewSipData({ ...newSipData, duration: parseInt(e.target.value) })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Payment Setup
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Payment Method</FormLabel>
                    <RadioGroup
                      value={newSipData.paymentMethod}
                      onChange={(e) => setNewSipData({ ...newSipData, paymentMethod: e.target.value })}
                    >
                      <FormControlLabel value="auto-debit" control={<Radio />} label="Auto Debit from Bank Account" />
                      <FormControlLabel value="manual" control={<Radio />} label="Manual Payment Each Month" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                {newSipData.paymentMethod === 'auto-debit' && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bank Account Number"
                        value={newSipData.bankAccount}
                        onChange={(e) => setNewSipData({ ...newSipData, bankAccount: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Alert severity="info">
                        A one-time mandate will be created for auto-debit. You can cancel anytime.
                      </Alert>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Review Your SIP
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      SIP Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Fund</Typography>
                      <Typography>Infinity Bluechip Fund</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Amount</Typography>
                      <Typography>₹{newSipData.amount} / {newSipData.frequency}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Duration</Typography>
                      <Typography>{newSipData.duration} months</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Start Date</Typography>
                      <Typography>{formatDate(newSipData.startDate)}</Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, background: alpha(theme.palette.success.main, 0.05) }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Investment Summary
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Total Investment</Typography>
                      <Typography variant="h6">₹{newSipData.amount * newSipData.duration}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">Estimated Value (12% returns)</Typography>
                      <Typography variant="h6" color="success.main">
                        ₹{Math.round(newSipData.amount * newSipData.duration * 1.12)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Estimated Returns</Typography>
                      <Typography variant="h6" color="success.main">
                        ₹{Math.round(newSipData.amount * newSipData.duration * 0.12)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="success">
                    Your SIP will start on {formatDate(newSipData.startDate)}. You will receive notifications before each installment.
                  </Alert>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {activeStep > 0 && (
            <Button onClick={handlePrevStep} variant="outlined">
              Back
            </Button>
          )}
          {activeStep < 3 ? (
            <Button
              onClick={handleNextStep}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleNewSipSubmit}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
              }}
            >
              Start SIP
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* SIP Calculator Dialog */}
      <Dialog
        open={calculatorDialogOpen}
        onClose={() => setCalculatorDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            SIP Returns Calculator
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Input Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Monthly Investment (₹)"
                    type="number"
                    value={calculatorData.monthlyInvestment}
                    onChange={(e) => setCalculatorData({ ...calculatorData, monthlyInvestment: parseInt(e.target.value) })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          ₹
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Expected Annual Return: {calculatorData.expectedReturn}%
                  </Typography>
                  <Slider
                    value={calculatorData.expectedReturn}
                    onChange={(e, value) => setCalculatorData({ ...calculatorData, expectedReturn: value })}
                    min={1}
                    max={30}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Investment Duration: {calculatorData.duration} years
                  </Typography>
                  <Slider
                    value={calculatorData.duration}
                    onChange={(e, value) => setCalculatorData({ ...calculatorData, duration: value })}
                    min={1}
                    max={30}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={calculatorData.frequency}
                      onChange={(e) => setCalculatorData({ ...calculatorData, frequency: e.target.value })}
                      label="Frequency"
                    >
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="quarterly">Quarterly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Estimated Results
              </Typography>
              <Card sx={{ p: 3, background: alpha(theme.palette.success.main, 0.05) }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary">Total Investment</Typography>
                  <Typography variant="h4" fontWeight={800}>
                    ₹{formatCurrency(calculatorResults.totalInvestment)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary">Estimated Returns</Typography>
                  <Typography variant="h4" fontWeight={800} color="success.main">
                    ₹{formatCurrency(calculatorResults.estimatedReturns)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary">Future Value</Typography>
                  <Typography variant="h4" fontWeight={800} color="primary.main">
                    ₹{formatCurrency(calculatorResults.futureValue)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Annualized Return (XIRR)</Typography>
                  <Typography variant="h4" fontWeight={800} color="warning.main">
                    {calculatorResults.xirr}%
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setCalculatorDialogOpen(false)}
            variant="outlined"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setCalculatorDialogOpen(false);
              setNewSipDialogOpen(true);
            }}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
            }}
          >
            Start SIP with These Values
          </Button>
        </DialogActions>
      </Dialog>

      {/* View SIP Dialog */}
      {selectedSIP && (
        <Dialog
          open={viewSipDialogOpen}
          onClose={() => setViewSipDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              SIP Details - {selectedSIP.id}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Fund Name</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedSIP.fundName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Status</Typography>
                      <Chip
                        label={selectedSIP.status}
                        color={getStatusColor(selectedSIP.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Start Date</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedSIP.startDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Next Date</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(selectedSIP.nextDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">End Date</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedSIP.endDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Frequency</Typography>
                      <Typography variant="body1">
                        {selectedSIP.frequency.charAt(0).toUpperCase() + selectedSIP.frequency.slice(1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Financial Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">SIP Amount</Typography>
                      <Typography variant="h6" fontWeight={600}>
                        ₹{formatCurrency(selectedSIP.amount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Units</Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedSIP.units.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Invested</Typography>
                      <Typography variant="h6" fontWeight={600}>
                        ₹{formatCurrency(selectedSIP.totalInvested)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Current Value</Typography>
                      <Typography variant="h6" fontWeight={600} color="success.main">
                        ₹{formatCurrency(selectedSIP.currentValue)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Returns</Typography>
                      <Typography variant="h4" fontWeight={800} color="success.main">
                        {formatPercentage(selectedSIP.returns)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Payment Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedSIP.paymentMethod}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Bank Account</Typography>
                      <Typography variant="body1">
                        {selectedSIP.bankAccount}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Mandate ID</Typography>
                      <Typography variant="body1">
                        {selectedSIP.mandateId}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">Installments</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedSIP.installments}/{selectedSIP.totalInstallments}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ p: 3, borderRadius: 3, background: alpha(theme.palette.info.main, 0.05) }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Recent Payments
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Reference</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{formatDate(selectedSIP.lastPaymentDate)}</TableCell>
                          <TableCell>₹{formatCurrency(selectedSIP.amount)}</TableCell>
                          <TableCell>
                            <Chip
                              label={selectedSIP.lastPaymentStatus}
                              size="small"
                              color={selectedSIP.lastPaymentStatus === 'success' ? 'success' : 'warning'}
                            />
                          </TableCell>
                          <TableCell>PAY{selectedSIP.id.slice(3)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => handleSipAction('edit', selectedSIP)}
              variant="outlined"
              startIcon={<Edit />}
            >
              Edit SIP
            </Button>
            <Button
              onClick={() => handleDownloadReceipt(selectedSIP.id)}
              variant="outlined"
              startIcon={<Download />}
            >
              Download Statement
            </Button>
            <Button
              onClick={() => setViewSipDialogOpen(false)}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Benefits Section */}
      <Paper sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
          Why Choose Infinity SIP?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 2,
                }}
              >
                <AutoGraph sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Rupee Cost Averaging
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Buy more units when prices are low, fewer when prices are high
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                  mb: 2,
                }}
              >
                <Savings sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Financial Discipline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Automate savings and build wealth systematically over time
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ff6f00 0%, #ffab00 100%)',
                  mb: 2,
                }}
              >
                <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Power of Compounding
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Small regular investments grow significantly over long term
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SIP;