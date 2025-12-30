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
  Avatar,
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
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  useTheme,
  alpha,
  CircularProgress,
  Rating,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Assignment,
  AccountBalance,
  Security,
  TrendingUp,
  Receipt,
  CreditCard,
  Notifications,
  Lock,
  Edit,
  Save,
  Cancel,
  VerifiedUser,
  Warning,
  CheckCircle,
  Error,
  QrCode,
  Download,
  Print,
  Share,
  PhotoCamera,
  History,
  Timeline,
  BarChart,
  PieChart,
  Help,
  Logout,
  Face,
  Fingerprint,
  Smartphone,
  Laptop,
  Tablet,
  Delete,
  Backup,
  Restore,
  Visibility,
  VisibilityOff,
  Language,
  DarkMode,
  LightMode,
  Palette,
  FontDownload,
  VolumeUp,
  Vibration,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import InfinityLogo from '../../components/branding/InfinityLogo';
import { formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Rajesh',
    lastName: user?.lastName || 'Sharma',
    email: user?.email || 'rajesh.sharma@example.com',
    phone: '+91 9876543210',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    panNumber: 'ABCDE1234F',
    aadhaarNumber: 'XXXX XXXX 5678',
    riskProfile: 'Moderate',
    investmentExperience: 'Intermediate',
    kycStatus: 'verified',
    registrationDate: '2022-01-15',
    lastLogin: '2024-01-25 14:30',
    
    address: {
      street: '123, Infinity Towers',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
    },
    
    bankDetails: {
      accountNumber: 'XXXXXXXX1234',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0000123',
      accountHolderName: 'Rajesh Sharma',
      accountType: 'Savings',
    },
    
    nominee: {
      name: 'Priya Sharma',
      relationship: 'Spouse',
      share: '100%',
      dateOfBirth: '1988-09-20',
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: true,
    sessionTimeout: 30,
    loginAlerts: true,
    transactionAlerts: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'english',
    currency: 'INR',
    dashboardView: 'standard',
    chartType: 'line',
    defaultTab: 'dashboard',
    autoRefresh: true,
    compactView: false,
  });

  const stats = {
    totalInvestment: 1250000,
    currentValue: 1450000,
    totalReturns: 200000,
    activeSIPs: 3,
    totalTransactions: 45,
    portfolioHoldings: 8,
    riskScore: 65,
    successRate: 95.4,
  };

  const kycStatus = {
    status: 'verified',
    verifiedDate: '2022-01-20',
    verifiedBy: 'Infinity KYC Team',
    level: 'Full KYC',
    documents: ['PAN', 'Aadhaar', 'Bank Proof', 'Address Proof'],
    nextReview: '2025-01-20',
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setEditMode(false);
      }, 1000);
    } else {
      setEditMode(true);
    }
  };

  const handleProfileChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [field]: value,
      });
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setChangePasswordOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully');
    }, 1000);
  };

  const handleKycUpload = (documentType) => {
    console.log('Uploading KYC document:', documentType);
    // Implement file upload logic
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getKycStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <VerifiedUser />;
      case 'pending': return <Warning />;
      case 'rejected': return <Error />;
      default: return <Warning />;
    }
  };

  // Chart data
  const portfolioAllocationData = {
    labels: ['Equity Funds', 'Debt Funds', 'Hybrid Funds', 'Gold ETF', 'Others'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.accent?.main || '#ff6f00',
          theme.palette.secondary.main,
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const riskProfileData = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        data: [20, 50, 30],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const documents = [
    { type: 'PAN Card', status: 'verified', uploadedDate: '2022-01-15' },
    { type: 'Aadhaar Card', status: 'verified', uploadedDate: '2022-01-16' },
    { type: 'Bank Statement', status: 'verified', uploadedDate: '2022-01-17' },
    { type: 'Address Proof', status: 'verified', uploadedDate: '2022-01-18' },
    { type: 'Photograph', status: 'verified', uploadedDate: '2022-01-19' },
    { type: 'Signature', status: 'verified', uploadedDate: '2022-01-20' },
  ];

  const devices = [
    { device: 'iPhone 13 Pro', browser: 'Safari', location: 'Mumbai', lastActive: '2 hours ago', status: 'active' },
    { device: 'MacBook Pro', browser: 'Chrome', location: 'Mumbai', lastActive: '1 day ago', status: 'active' },
    { device: 'Samsung Galaxy S22', browser: 'Chrome', location: 'Delhi', lastActive: '1 week ago', status: 'inactive' },
  ];

  const sessions = [
    { id: 'SESS001', startTime: '2024-01-25 14:30', endTime: '2024-01-25 15:45', duration: '1h 15m', ip: '103.21.34.45' },
    { id: 'SESS002', startTime: '2024-01-24 10:15', endTime: '2024-01-24 11:30', duration: '1h 15m', ip: '103.21.34.45' },
    { id: 'SESS003', startTime: '2024-01-23 09:00', endTime: '2024-01-23 10:30', duration: '1h 30m', ip: '203.45.67.89' },
  ];

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
                  My Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage your account settings and preferences
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => console.log('Download Profile')}
              >
                Export Data
              </Button>
              <Button
                variant="contained"
                startIcon={editMode ? <Save /> : <Edit />}
                onClick={handleEditToggle}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                {loading ? 'Saving...' : editMode ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4} lg={3}>
          {/* Profile Card */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      onClick={() => setAvatarDialogOpen(true)}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': { bgcolor: theme.palette.primary.dark },
                      }}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '3rem',
                      bgcolor: 'primary.main',
                      border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </Avatar>
                </Badge>
              </Box>
              
              <Typography variant="h5" fontWeight={800}>
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profileData.email}
              </Typography>
              
              <Chip
                icon={getKycStatusIcon(profileData.kycStatus)}
                label={profileData.kycStatus.toUpperCase()}
                color={getKycStatusColor(profileData.kycStatus)}
                sx={{ mb: 3, fontWeight: 600 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
                <Tooltip title="Risk Profile">
                  <Chip
                    icon={<TrendingUp />}
                    label={profileData.riskProfile}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Tooltip>
                <Tooltip title="Member Since">
                  <Chip
                    icon={<CalendarToday />}
                    label={new Date(profileData.registrationDate).getFullYear()}
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Tooltip>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QrCode />}
                onClick={() => console.log('Show QR Code')}
                sx={{ mb: 2 }}
              >
                Show QR Code
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<Share />}
                onClick={() => console.log('Share Profile')}
                sx={{
                  mb: 2,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                Share Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Stats
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalance sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Investment"
                    secondary={formatCurrency(stats.totalInvestment)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: 'success.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Current Value"
                    secondary={formatCurrency(stats.currentValue)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Receipt sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Active SIPs"
                    secondary={stats.activeSIPs}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CreditCard sx={{ color: 'info.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Portfolio Holdings"
                    secondary={stats.portfolioHoldings}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Risk Profile */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Risk Profile
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h2" fontWeight={800} color="warning.main">
                  {stats.riskScore}/100
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.riskScore > 70 ? 'High Risk' : stats.riskScore > 40 ? 'Moderate Risk' : 'Low Risk'}
                </Typography>
              </Box>
              <Box sx={{ height: 150 }}>
                <Doughnut
                  data={riskProfileData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ borderRadius: 3 }}>
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
                  fontSize: '0.9rem',
                },
              }}
            >
              <Tab icon={<Person />} label="Personal Info" />
              <Tab icon={<Security />} label="Security" />
              <Tab icon={<AccountBalance />} label="Bank & Nominee" />
              <Tab icon={<Assignment />} label="KYC Documents" />
              <Tab icon={<Notifications />} label="Notifications" />
              <Tab icon={<Palette />} label="Preferences" />
              <Tab icon={<Timeline />} label="Activity" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Personal Information Tab */}
              {tabValue === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Update your personal details and contact information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                        disabled={!editMode}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={profileData.gender}
                          onChange={(e) => handleProfileChange('gender', e.target.value)}
                          disabled={!editMode}
                          label="Gender"
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                          <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                        Address Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Street Address"
                        value={profileData.address.street}
                        onChange={(e) => handleProfileChange('address.street', e.target.value)}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={profileData.address.city}
                        onChange={(e) => handleProfileChange('address.city', e.target.value)}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="State"
                        value={profileData.address.state}
                        onChange={(e) => handleProfileChange('address.state', e.target.value)}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        value={profileData.address.pincode}
                        onChange={(e) => handleProfileChange('address.pincode', e.target.value)}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={profileData.address.country}
                        onChange={(e) => handleProfileChange('address.country', e.target.value)}
                        disabled={!editMode}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 3 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            Investment Profile
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Your investment preferences and experience
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/app/profile/risk-assessment')}
                        >
                          Retake Assessment
                        </Button>
                      </Box>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Risk Profile</InputLabel>
                            <Select
                              value={profileData.riskProfile}
                              onChange={(e) => handleProfileChange('riskProfile', e.target.value)}
                              disabled={!editMode}
                              label="Risk Profile"
                            >
                              <MenuItem value="Low">Low (Conservative)</MenuItem>
                              <MenuItem value="Moderate">Moderate (Balanced)</MenuItem>
                              <MenuItem value="High">High (Aggressive)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Investment Experience</InputLabel>
                            <Select
                              value={profileData.investmentExperience}
                              onChange={(e) => handleProfileChange('investmentExperience', e.target.value)}
                              disabled={!editMode}
                              label="Investment Experience"
                            >
                              <MenuItem value="Beginner">Beginner (Less than 1 year)</MenuItem>
                              <MenuItem value="Intermediate">Intermediate (1-3 years)</MenuItem>
                              <MenuItem value="Advanced">Advanced (More than 3 years)</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Security Tab */}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Security Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage your account security and authentication methods
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Password & Authentication
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Lock color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Password"
                                secondary="Last changed 30 days ago"
                              />
                              <ListItemSecondaryAction>
                                <Button
                                  variant="outlined"
                                  onClick={() => setChangePasswordOpen(true)}
                                >
                                  Change Password
                                </Button>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Fingerprint color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Two-Factor Authentication"
                                secondary="Add an extra layer of security"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.twoFactorAuth}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    twoFactorAuth: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Face color="primary" />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Biometric Login"
                                secondary="Use fingerprint or face recognition"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.biometricLogin}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    biometricLogin: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Session Settings
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              Session Timeout: {securitySettings.sessionTimeout} minutes
                            </Typography>
                            <Slider
                              value={securitySettings.sessionTimeout}
                              onChange={(e, value) => setSecuritySettings({
                                ...securitySettings,
                                sessionTimeout: value,
                              })}
                              min={5}
                              max={120}
                              step={5}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.loginAlerts}
                                onChange={(e) => setSecuritySettings({
                                  ...securitySettings,
                                  loginAlerts: e.target.checked,
                                })}
                              />
                            }
                            label="Login Alerts"
                          />
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Active Devices
                          </Typography>
                          <List dense>
                            {devices.map((device, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  {device.device.includes('iPhone') || device.device.includes('Samsung') ? (
                                    <Smartphone />
                                  ) : (
                                    <Laptop />
                                  )}
                                </ListItemIcon>
                                <ListItemText
                                  primary={device.device}
                                  secondary={`${device.browser} • ${device.location}`}
                                />
                                <ListItemSecondaryAction>
                                  <Chip
                                    label={device.status}
                                    size="small"
                                    color={device.status === 'active' ? 'success' : 'default'}
                                  />
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Delete />}
                            sx={{ mt: 2 }}
                          >
                            Logout All Devices
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                          For security reasons, please review your active sessions regularly and log out from unknown devices.
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Bank & Nominee Tab */}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Bank & Nominee Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage your bank account for transactions and nominee information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Bank Account Details
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText 
                                primary="Bank Name"
                                secondary={profileData.bankDetails.bankName}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Account Number"
                                secondary={profileData.bankDetails.accountNumber}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="IFSC Code"
                                secondary={profileData.bankDetails.ifscCode}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Account Holder"
                                secondary={profileData.bankDetails.accountHolderName}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Account Type"
                                secondary={profileData.bankDetails.accountType}
                              />
                            </ListItem>
                          </List>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Edit />}
                            sx={{ mt: 2 }}
                            disabled={!editMode}
                          >
                            Update Bank Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Nominee Information
                          </Typography>
                          <List dense>
                            <ListItem>
                              <ListItemText 
                                primary="Nominee Name"
                                secondary={profileData.nominee.name}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Relationship"
                                secondary={profileData.nominee.relationship}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Share Percentage"
                                secondary={profileData.nominee.share}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Date of Birth"
                                secondary={formatDate(profileData.nominee.dateOfBirth)}
                              />
                            </ListItem>
                          </List>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Edit />}
                            sx={{ mt: 2 }}
                            disabled={!editMode}
                          >
                            Update Nominee
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Alert severity="info">
                        <Typography variant="body2">
                          Bank details are used for SIP mandates and redemption payouts. Nominee details are crucial for inheritance planning.
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* KYC Documents Tab */}
              {tabValue === 3 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    KYC Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Your KYC status and uploaded documents as per SEBI regulations
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            KYC Status
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Chip
                              icon={getKycStatusIcon(kycStatus.status)}
                              label={kycStatus.status.toUpperCase()}
                              color={getKycStatusColor(kycStatus.status)}
                              sx={{ fontSize: '1rem', fontWeight: 600 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Level: {kycStatus.level}
                            </Typography>
                          </Box>
                          
                          <List dense>
                            <ListItem>
                              <ListItemText 
                                primary="Verified Date"
                                secondary={formatDate(kycStatus.verifiedDate)}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Verified By"
                                secondary={kycStatus.verifiedBy}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Next Review Date"
                                secondary={formatDate(kycStatus.nextReview)}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Required Documents
                          </Typography>
                          <List dense>
                            {kycStatus.documents.map((doc, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText primary={doc} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Uploaded Documents
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Document Type</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Uploaded Date</TableCell>
                                  <TableCell align="right">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {documents.map((doc, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={doc.status}
                                        size="small"
                                        color={doc.status === 'verified' ? 'success' : 'warning'}
                                      />
                                    </TableCell>
                                    <TableCell>{formatDate(doc.uploadedDate)}</TableCell>
                                    <TableCell align="right">
                                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Tooltip title="View">
                                          <IconButton size="small">
                                            <Visibility />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download">
                                          <IconButton size="small">
                                            <Download />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Re-upload">
                                          <IconButton size="small">
                                            <Backup />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Notifications Tab */}
              {tabValue === 4 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Notification Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Control how and when you receive notifications
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Notification Channels
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Email />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Email Notifications"
                                secondary="Receive updates via email"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.emailNotifications}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    emailNotifications: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Phone />
                              </ListItemIcon>
                              <ListItemText 
                                primary="SMS Notifications"
                                secondary="Receive updates via SMS"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.smsNotifications}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    smsNotifications: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Notifications />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Push Notifications"
                                secondary="Receive app notifications"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.pushNotifications}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    pushNotifications: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Notification Types
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="Transaction Alerts"
                                secondary="Notify on successful/failed transactions"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.transactionAlerts}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    transactionAlerts: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="SIP Reminders"
                                secondary="Remind before SIP due dates"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.pushNotifications}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    pushNotifications: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Market Updates"
                                secondary="Daily market news and updates"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.pushNotifications}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    pushNotifications: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Portfolio Updates"
                                secondary="Weekly portfolio performance"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={securitySettings.pushNotifications}
                                  onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    pushNotifications: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Alert severity="info">
                        <Typography variant="body2">
                          Important account notifications will always be sent regardless of your preferences.
                        </Typography>
                      </Alert>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Preferences Tab */}
              {tabValue === 5 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Preferences
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Customize your Infinity experience
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Display Settings
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemIcon>
                                <Palette />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Theme"
                                secondary={preferences.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={preferences.theme === 'dark'}
                                  onChange={(e) => setPreferences({
                                    ...preferences,
                                    theme: e.target.checked ? 'dark' : 'light',
                                  })}
                                  icon={<LightMode />}
                                  checkedIcon={<DarkMode />}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Language />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Language"
                                secondary="English"
                              />
                              <ListItemSecondaryAction>
                                <Select
                                  value={preferences.language}
                                  onChange={(e) => setPreferences({
                                    ...preferences,
                                    language: e.target.value,
                                  })}
                                  size="small"
                                  sx={{ width: 120 }}
                                >
                                  <MenuItem value="english">English</MenuItem>
                                  <MenuItem value="hindi">हिन्दी</MenuItem>
                                  <MenuItem value="gujarati">ગુજરાતી</MenuItem>
                                  <MenuItem value="tamil">தமிழ்</MenuItem>
                                </Select>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <FontDownload />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Font Size"
                                secondary="Medium"
                              />
                              <ListItemSecondaryAction>
                                <Select
                                  value="medium"
                                  size="small"
                                  sx={{ width: 120 }}
                                >
                                  <MenuItem value="small">Small</MenuItem>
                                  <MenuItem value="medium">Medium</MenuItem>
                                  <MenuItem value="large">Large</MenuItem>
                                </Select>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Dashboard Preferences
                          </Typography>
                          <List>
                            <ListItem>
                              <ListItemText 
                                primary="Default Dashboard View"
                                secondary="Choose your default dashboard layout"
                              />
                              <ListItemSecondaryAction>
                                <Select
                                  value={preferences.dashboardView}
                                  onChange={(e) => setPreferences({
                                    ...preferences,
                                    dashboardView: e.target.value,
                                  })}
                                  size="small"
                                  sx={{ width: 120 }}
                                >
                                  <MenuItem value="standard">Standard</MenuItem>
                                  <MenuItem value="compact">Compact</MenuItem>
                                  <MenuItem value="detailed">Detailed</MenuItem>
                                </Select>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Default Chart Type"
                                secondary="Choose your preferred chart style"
                              />
                              <ListItemSecondaryAction>
                                <Select
                                  value={preferences.chartType}
                                  onChange={(e) => setPreferences({
                                    ...preferences,
                                    chartType: e.target.value,
                                  })}
                                  size="small"
                                  sx={{ width: 120 }}
                                >
                                  <MenuItem value="line">Line Chart</MenuItem>
                                  <MenuItem value="bar">Bar Chart</MenuItem>
                                  <MenuItem value="pie">Pie Chart</MenuItem>
                                </Select>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem>
                              <ListItemText 
                                primary="Auto Refresh"
                                secondary="Automatically refresh data"
                              />
                              <ListItemSecondaryAction>
                                <Switch
                                  checked={preferences.autoRefresh}
                                  onChange={(e) => setPreferences({
                                    ...preferences,
                                    autoRefresh: e.target.checked,
                                  })}
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Sound & Vibration
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={preferences.autoRefresh}
                                    onChange={(e) => setPreferences({
                                      ...preferences,
                                      autoRefresh: e.target.checked,
                                    })}
                                  />
                                }
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <VolumeUp />
                                    <Typography>Sound Notifications</Typography>
                                  </Box>
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={preferences.compactView}
                                    onChange={(e) => setPreferences({
                                      ...preferences,
                                      compactView: e.target.checked,
                                    })}
                                  />
                                }
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Vibration />
                                    <Typography>Vibration Alerts</Typography>
                                  </Box>
                                }
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Activity Tab */}
              {tabValue === 6 && (
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Activity History
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Track your account activity and login sessions
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Recent Sessions
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Session ID</TableCell>
                                  <TableCell>Start Time</TableCell>
                                  <TableCell>Duration</TableCell>
                                  <TableCell>IP Address</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {sessions.map((session, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{session.id}</TableCell>
                                    <TableCell>{session.startTime}</TableCell>
                                    <TableCell>{session.duration}</TableCell>
                                    <TableCell>{session.ip}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Portfolio Allocation
                          </Typography>
                          <Box sx={{ height: 200, mb: 2 }}>
                            <Doughnut
                              data={portfolioAllocationData}
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
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Account Statistics
                          </Typography>
                          <Grid container spacing={3}>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight={800} color="primary.main">
                                  {stats.totalTransactions}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Total Transactions
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight={800} color="success.main">
                                  {stats.activeSIPs}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Active SIPs
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight={800} color="warning.main">
                                  {formatPercentage(stats.successRate)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Success Rate
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight={800} color="info.main">
                                  {new Date(profileData.registrationDate).getFullYear()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Member Since
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Change Password
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setChangePasswordOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
            }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Account Actions */}
      <Paper sx={{ p: 3, borderRadius: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Account Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Help />}
              onClick={() => navigate('/help')}
              sx={{ borderRadius: 3 }}
            >
              Help Center
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Download />}
              onClick={() => console.log('Download Data')}
              sx={{ borderRadius: 3 }}
            >
              Download Data
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Print />}
              onClick={() => window.print()}
              sx={{ borderRadius: 3 }}
            >
              Print Profile
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Restore />}
              onClick={() => console.log('Restore Defaults')}
              sx={{ borderRadius: 3 }}
            >
              Restore Defaults
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Delete />}
              onClick={() => console.log('Delete Account')}
              color="error"
              sx={{ borderRadius: 3 }}
            >
              Delete Account
            </Button>
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              color="error"
              sx={{ borderRadius: 3 }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;