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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Print,
  Receipt,
  Visibility,
  Refresh,
  DateRange,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  AttachMoney,
  AutoGraph,
  SwapHoriz,
  Pending,
  CheckCircle,
  Cancel,
  MoreVert,
  FileDownload,
  Share,
  QrCode,
  History,
  Timeline,
  BarChart,
  PieChart,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  Title,
  Tooltip,
  Legend
);

const Transactions = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [transactionDetailsOpen, setTransactionDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    startDate: '',
    endDate: '',
    fund: 'all',
    amountRange: [0, 1000000],
  });

  const transactionTypes = [
    { value: 'purchase', label: 'Purchase', icon: <AccountBalance />, color: 'primary' },
    { value: 'sip', label: 'SIP', icon: <AutoGraph />, color: 'success' },
    { value: 'redemption', label: 'Redemption', icon: <AttachMoney />, color: 'warning' },
    { value: 'switch', label: 'Switch', icon: <SwapHoriz />, color: 'info' },
    { value: 'stp', label: 'STP', icon: <TrendingUp />, color: 'secondary' },
  ];

  const transactionStatuses = [
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'failed', label: 'Failed', color: 'error' },
    { value: 'cancelled', label: 'Cancelled', color: 'default' },
  ];

  const sampleTransactions = [
    {
      id: 'INF123456789',
      type: 'purchase',
      fundName: 'Infinity Bluechip Fund',
      fundHouse: 'Infinity Mutual',
      amount: 50000,
      units: 398.41,
      nav: 125.50,
      date: '2024-01-15',
      settlementDate: '2024-01-17',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionFee: 0,
      tax: 0,
      totalAmount: 50000,
      reference: 'UPI123456789',
      remarks: 'One-time investment',
    },
    {
      id: 'INF987654321',
      type: 'sip',
      fundName: 'Infinity Hybrid Fund',
      fundHouse: 'Infinity Mutual',
      amount: 10000,
      units: 126.74,
      nav: 78.90,
      date: '2024-01-10',
      settlementDate: '2024-01-11',
      status: 'completed',
      paymentMethod: 'Auto Debit',
      transactionFee: 0,
      tax: 0,
      totalAmount: 10000,
      reference: 'SIP123456789',
      remarks: 'Monthly SIP installment',
    },
    {
      id: 'INF456789123',
      type: 'redemption',
      fundName: 'Infinity Debt Advantage',
      fundHouse: 'Infinity Mutual',
      amount: 25000,
      units: 553.10,
      nav: 45.20,
      date: '2024-01-05',
      settlementDate: '2024-01-08',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      transactionFee: 0,
      tax: 0,
      totalAmount: 25000,
      reference: 'RED123456789',
      remarks: 'Partial redemption',
    },
    {
      id: 'INF789123456',
      type: 'purchase',
      fundName: 'Infinity Gold Fund',
      fundHouse: 'Infinity Mutual',
      amount: 15000,
      units: 133.00,
      nav: 112.80,
      date: '2024-01-01',
      settlementDate: '2024-01-03',
      status: 'pending',
      paymentMethod: 'Net Banking',
      transactionFee: 0,
      tax: 0,
      totalAmount: 15000,
      reference: 'NB123456789',
      remarks: 'New investment',
    },
    {
      id: 'INF321654987',
      type: 'switch',
      fundName: 'Infinity Small Cap Fund',
      fundHouse: 'Infinity Mutual',
      amount: 30000,
      units: 314.68,
      nav: 95.30,
      date: '2023-12-28',
      settlementDate: '2023-12-30',
      status: 'completed',
      paymentMethod: 'Switch',
      transactionFee: 0,
      tax: 0,
      totalAmount: 30000,
      reference: 'SW123456789',
      remarks: 'Switch from debt to equity',
    },
    {
      id: 'INF654987321',
      type: 'sip',
      fundName: 'Infinity Liquid Fund',
      fundHouse: 'Infinity Mutual',
      amount: 5000,
      units: 48.78,
      nav: 102.50,
      date: '2023-12-25',
      settlementDate: '2023-12-26',
      status: 'completed',
      paymentMethod: 'Auto Debit',
      transactionFee: 0,
      tax: 0,
      totalAmount: 5000,
      reference: 'SIP987654321',
      remarks: 'Monthly SIP',
    },
    {
      id: 'INF987321654',
      type: 'purchase',
      fundName: 'Infinity ELSS Fund',
      fundHouse: 'Infinity Mutual',
      amount: 75000,
      units: 625.00,
      nav: 120.00,
      date: '2023-12-20',
      settlementDate: '2023-12-22',
      status: 'failed',
      paymentMethod: 'Debit Card',
      transactionFee: 0,
      tax: 0,
      totalAmount: 75000,
      reference: 'DC123456789',
      remarks: 'Tax saving investment',
    },
    {
      id: 'INF123789456',
      type: 'stp',
      fundName: 'Infinity Balanced Fund',
      fundHouse: 'Infinity Mutual',
      amount: 20000,
      units: 256.41,
      nav: 78.00,
      date: '2023-12-15',
      settlementDate: '2023-12-17',
      status: 'completed',
      paymentMethod: 'STP',
      transactionFee: 0,
      tax: 0,
      totalAmount: 20000,
      reference: 'STP123456789',
      remarks: 'Systematic Transfer',
    },
  ];

  const stats = {
    totalTransactions: 152,
    totalInvestment: 1250000,
    totalRedemption: 250000,
    pendingTransactions: 3,
    successRate: 95.4,
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

  const handleFilterSubmit = () => {
    setFilterDialogOpen(false);
    // Apply filters logic
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      startDate: '',
      endDate: '',
      fund: 'all',
      amountRange: [0, 1000000],
    });
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDetailsOpen(true);
  };

  const handleDownloadReceipt = (transactionId) => {
    console.log('Downloading receipt for:', transactionId);
    // Implement download logic
  };

  const handlePrintTransaction = (transactionId) => {
    console.log('Printing transaction:', transactionId);
    // Implement print logic
  };

  const handleExportData = (format) => {
    console.log('Exporting data as:', format);
    // Implement export logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'failed': return <Cancel />;
      case 'cancelled': return <Cancel />;
      default: return <Pending />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'purchase': return 'primary';
      case 'sip': return 'success';
      case 'redemption': return 'warning';
      case 'switch': return 'info';
      case 'stp': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'purchase': return <AccountBalance />;
      case 'sip': return <AutoGraph />;
      case 'redemption': return <AttachMoney />;
      case 'switch': return <SwapHoriz />;
      case 'stp': return <TrendingUp />;
      default: return <AccountBalance />;
    }
  };

  // Chart data
  const monthlyTransactionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Investments',
        data: [50000, 45000, 60000, 55000, 70000, 65000, 80000, 75000, 90000, 85000, 95000, 100000],
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
      {
        label: 'Redemptions',
        data: [20000, 18000, 22000, 21000, 25000, 23000, 27000, 26000, 30000, 28000, 32000, 35000],
        backgroundColor: alpha(theme.palette.warning.main, 0.5),
        borderColor: theme.palette.warning.main,
        borderWidth: 2,
      },
    ],
  };

  const transactionTypeData = {
    labels: ['Purchase', 'SIP', 'Redemption', 'Switch', 'STP'],
    datasets: [
      {
        data: [45, 30, 15, 5, 5],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.secondary.main,
        ],
      },
    ],
  };

  const filteredTransactions = sampleTransactions.filter(transaction => {
    if (filters.search && !transaction.id.toLowerCase().includes(filters.search.toLowerCase()) && 
        !transaction.fundName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'all' && transaction.status !== filters.status) {
      return false;
    }
    if (filters.fund !== 'all' && transaction.fundName !== filters.fund) {
      return false;
    }
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    if (transaction.amount < filters.amountRange[0] || transaction.amount > filters.amountRange[1]) {
      return false;
    }
    return true;
  });

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
                  Transaction History
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Track all your mutual fund transactions in one place
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => setLoading(true)}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleExportData('excel')}
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                Export
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
                {stats.totalTransactions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Transactions
              </Typography>
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
                {formatCurrency(stats.totalInvestment)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Investment
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
                {formatCurrency(stats.totalRedemption)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Redemption
              </Typography>
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
          <Tab icon={<Receipt />} label="All Transactions" />
          <Tab icon={<AccountBalance />} label="Purchases" />
          <Tab icon={<AutoGraph />} label="SIPs" />
          <Tab icon={<AttachMoney />} label="Redemptions" />
          <Tab icon={<SwapHoriz />} label="Switches" />
          <Tab icon={<Timeline />} label="STPs" />
          <Tab icon={<History />} label="History" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Search and Filter Bar */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by Transaction ID or Fund Name..."
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
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Type"
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {transactionTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  {transactionStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDialogOpen(true)}
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
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Monthly Transaction Trend
                </Typography>
                <Box sx={{ height: 250 }}>
                  <Bar
                    data={monthlyTransactionData}
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
                  Transaction Type Distribution
                </Typography>
                <Box sx={{ height: 250 }}>
                  <PieChart
                    data={transactionTypeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
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

          {/* Transactions Table */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Transactions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Print">
                    <IconButton onClick={() => handlePrintTransaction('all')}>
                      <Print />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export PDF">
                    <IconButton onClick={() => handleExportData('pdf')}>
                      <FileDownload />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Fund Details</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <LinearProgress />
                        </TableCell>
                      </TableRow>
                    ) : filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="text.secondary" py={3}>
                            No transactions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((transaction) => (
                          <TableRow key={transaction.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {transaction.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getTypeIcon(transaction.type)}
                                label={transactionTypes.find(t => t.value === transaction.type)?.label || transaction.type}
                                size="small"
                                color={getTypeColor(transaction.type)}
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {transaction.fundName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {transaction.fundHouse}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight={600}>
                                ₹{formatCurrency(transaction.amount)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {transaction.units.toFixed(2)} units @ ₹{transaction.nav}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatDate(transaction.date)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Settles: {formatDate(transaction.settlementDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                icon={getStatusIcon(transaction.status)}
                                label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                size="small"
                                color={getStatusColor(transaction.status)}
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDetails(transaction)}
                                  >
                                    <Visibility />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Download Receipt">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDownloadReceipt(transaction.id)}
                                  >
                                    <Receipt />
                                  </IconButton>
                                </Tooltip>
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
                count={filteredTransactions.length}
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

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Advanced Filters
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Fund</InputLabel>
                <Select
                  value={filters.fund}
                  onChange={(e) => handleFilterChange('fund', e.target.value)}
                  label="Fund"
                >
                  <MenuItem value="all">All Funds</MenuItem>
                  <MenuItem value="Infinity Bluechip Fund">Infinity Bluechip Fund</MenuItem>
                  <MenuItem value="Infinity Hybrid Fund">Infinity Hybrid Fund</MenuItem>
                  <MenuItem value="Infinity Debt Advantage">Infinity Debt Advantage</MenuItem>
                  <MenuItem value="Infinity Gold Fund">Infinity Gold Fund</MenuItem>
                  <MenuItem value="Infinity Small Cap Fund">Infinity Small Cap Fund</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Amount Range</Typography>
              <Box sx={{ px: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(filters.amountRange[1] / 1000000) * 100}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">₹0</Typography>
                  <Typography variant="caption">₹10,00,000</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClearFilters} color="inherit">
            Clear All
          </Button>
          <Button
            onClick={() => setFilterDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleFilterSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog
        open={transactionDetailsOpen}
        onClose={() => setTransactionDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedTransaction && (
          <>
            <DialogTitle>
              <Typography variant="h6" fontWeight={600}>
                Transaction Details
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedTransaction.id}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Transaction Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Type</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedTransaction.type.toUpperCase()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip
                          label={selectedTransaction.status}
                          color={getStatusColor(selectedTransaction.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">
                          {formatDate(selectedTransaction.date)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Settlement Date</Typography>
                        <Typography variant="body1">
                          {formatDate(selectedTransaction.settlementDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Remarks</Typography>
                        <Typography variant="body1">
                          {selectedTransaction.remarks}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Fund Details
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {selectedTransaction.fundName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {selectedTransaction.fundName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedTransaction.fundHouse}
                        </Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Units</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedTransaction.units.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">NAV</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          ₹{selectedTransaction.nav}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Financial Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Amount</Typography>
                        <Typography variant="h6" fontWeight={600}>
                          ₹{formatCurrency(selectedTransaction.amount)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Transaction Fee</Typography>
                        <Typography variant="h6" fontWeight={600} color="success.main">
                          ₹{formatCurrency(selectedTransaction.transactionFee)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Tax</Typography>
                        <Typography variant="h6" fontWeight={600} color="warning.main">
                          ₹{formatCurrency(selectedTransaction.tax)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                        <Typography variant="h6" fontWeight={600} color="primary.main">
                          ₹{formatCurrency(selectedTransaction.totalAmount)}
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
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedTransaction.paymentMethod}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Reference Number</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedTransaction.reference}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Button
                onClick={() => handleDownloadReceipt(selectedTransaction.id)}
                startIcon={<FileDownload />}
                variant="outlined"
              >
                Download Receipt
              </Button>
              <Button
                onClick={() => handlePrintTransaction(selectedTransaction.id)}
                startIcon={<Print />}
                variant="outlined"
              >
                Print
              </Button>
              <Button
                onClick={() => setTransactionDetailsOpen(false)}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, borderRadius: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Receipt />}
              onClick={() => navigate('/app/transactions/statement')}
              sx={{ borderRadius: 3 }}
            >
              Statement
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DateRange />}
              onClick={() => navigate('/app/transactions/calendar')}
              sx={{ borderRadius: 3 }}
            >
              Calendar View
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BarChart />}
              onClick={() => navigate('/app/transactions/analytics')}
              sx={{ borderRadius: 3 }}
            >
              Analytics
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Share />}
              onClick={() => navigate('/app/transactions/share')}
              sx={{ borderRadius: 3 }}
            >
              Share Report
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<QrCode />}
              onClick={() => navigate('/app/transactions/qr')}
              sx={{ borderRadius: 3 }}
            >
              QR Code
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<History />}
              onClick={() => navigate('/app/transactions/history')}
              sx={{ borderRadius: 3 }}
            >
              Full History
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Transactions;