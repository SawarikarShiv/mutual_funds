import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Smartphone,
  Laptop,
  Tablet,
  Security,
  TrendingUp,
  AccountBalance,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import InfinityMutualFundsLogo from '../../components/branding/InfinityLogo';

const InfinityLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileView, setShowMobileView] = useState(true);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(login(values));
      if (login.fulfilled.match(result)) {
        navigate('/dashboard');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - App Previews */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={10}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                }}
              >
                OFA - One Financial Advisor
              </Typography>

              <Typography variant="h5" fontWeight={600} color="primary.main" gutterBottom>
                One Stop Solution for All Your Financial Services
              </Typography>

              <Typography paragraph sx={{ mb: 4, color: 'text.secondary' }}>
                A brilliant platform developed for Partners to build and improve their 
                client relationship and grow their business. Loaded with exciting features 
                to make Partners future-ready.
              </Typography>

              <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                STAY CONNECTED ON THE GO!
              </Typography>

              {/* App Previews */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={4}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      background: alpha(theme.palette.primary.main, 0.05),
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Smartphone sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Advisor App
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      background: alpha(theme.palette.secondary.main, 0.05),
                      border: `2px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                    }}
                  >
                    <Laptop sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      OKA Admin
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      background: alpha(theme.palette.accent?.main || '#ff6f00', 0.05),
                      border: `2px solid ${alpha(theme.palette.accent?.main || '#ff6f00', 0.1)}`,
                    }}
                  >
                    <Tablet sx={{ fontSize: 40, color: 'accent.main', mb: 1 }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Off-Action
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Features */}
              <Grid container spacing={2}>
                {[
                  { icon: <Security />, text: 'Secure Platform' },
                  { icon: <TrendingUp />, text: 'Real-time Analytics' },
                  { icon: <AccountBalance />, text: 'Portfolio Management' },
                ].map((feature, index) => (
                  <Grid item xs={4} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 1.5,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          mb: 1,
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          sx: { fontSize: 24, color: 'white' },
                        })}
                      </Box>
                      <Typography variant="caption" fontWeight={600}>
                        {feature.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={10}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Logo */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <InfinityMutualFundsLogo size="large" />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Omni Financial Advisor
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="User name"
                  margin="normal"
                  variant="outlined"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />

                <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
                  <Link
                    component={RouterLink}
                    to="/auth/forgot-password"
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #000051 0%, #0081cb 100%)',
                    },
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>

              {/* Login Error Solutions */}
              <Card
                sx={{
                  mt: 4,
                  p: 2,
                  background: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} color="warning.main" gutterBottom>
                  Login Error Solutions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Check your username and password<br />
                  • Reset password if forgotten<br />
                  • Contact support for account issues<br />
                  • Clear browser cache and cookies
                </Typography>
              </Card>

              {/* Mobile/Desktop Toggle */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowMobileView(!showMobileView)}
                  sx={{ borderRadius: 20 }}
                >
                  {showMobileView ? 'Switch to Desktop View' : 'Switch to Mobile View'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
            © {new Date().getFullYear()} Infinity Mutual Funds. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: 'white', opacity: 0.6 }}>
            A product of Omni Financial Advisor Platform
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default InfinityLogin;