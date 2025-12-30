import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  AccountBalance,
  People,
  Star,
  Download,
  ArrowForward,
  PhoneAndroid,
  Laptop,
  Tablet,
  CheckCircle,
  BarChart,
  Savings,
  AutoGraph,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InfinityLogo from '../../components/branding/InfinityLogo';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp />,
      title: 'Superior Returns',
      description: 'Consistent performance with market-beating returns',
      color: theme.palette.primary.main,
    },
    {
      icon: <Security />,
      title: '100% Secure',
      description: 'Bank-level security with SEBI regulation',
      color: theme.palette.success.main,
    },
    {
      icon: <AccountBalance />,
      title: 'Expert Management',
      description: 'Managed by industry veterans with 20+ years experience',
      color: theme.palette.warning.main,
    },
    {
      icon: <People />,
      title: '5 Million+ Investors',
      description: 'Trusted by investors across India',
      color: theme.palette.accent?.main || '#ff6f00',
    },
  ];

  const products = [
    {
      title: 'Equity Funds',
      description: 'Long-term wealth creation through stock market investments',
      returns: '12-18%',
      risk: 'High',
      color: theme.palette.primary.main,
    },
    {
      title: 'Debt Funds',
      description: 'Stable income with lower risk through bonds',
      returns: '7-9%',
      risk: 'Low',
      color: theme.palette.success.main,
    },
    {
      title: 'Hybrid Funds',
      description: 'Balanced growth with equity and debt mix',
      returns: '9-12%',
      risk: 'Moderate',
      color: theme.palette.warning.main,
    },
    {
      title: 'ELSS Funds',
      description: 'Tax saving with equity-linked returns',
      returns: '12-15%',
      risk: 'High',
      color: theme.palette.accent?.main || '#ff6f00',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <InfinityLogo size="large" />
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Your Journey to
                <Box component="span" sx={{ color: '#ff6f00', ml: 1 }}>
                  Financial Freedom
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  opacity: 0.9,
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                }}
              >
                India's most trusted mutual fund platform with
                <Box component="span" sx={{ fontWeight: 700, ml: 1 }}>
                  ₹2,450+ Crores
                </Box>{' '}
                AUM
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/auth/register')}
                  sx={{
                    background: 'white',
                    color: '#1a237e',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      background: alpha('#ffffff', 0.9),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Start Investing
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/auth/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      background: alpha('#ffffff', 0.1),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Partner Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    gap: 3,
                    p: 4,
                    background: alpha('#ffffff', 0.1),
                    borderRadius: 4,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <PhoneAndroid sx={{ fontSize: { xs: 60, md: 100 }, opacity: 0.8 }} />
                  <Laptop sx={{ fontSize: { xs: 60, md: 100 }, opacity: 0.8 }} />
                  <Tablet sx={{ fontSize: { xs: 60, md: 100 }, opacity: 0.8 }} />
                </Box>
                <Typography variant="h6" sx={{ mt: 3, opacity: 0.9 }}>
                  Available on all platforms
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Why Choose Infinity?
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
        >
          Experience the future of mutual fund investing with our cutting-edge platform
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  border: `2px solid ${alpha(feature.color, 0.1)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${feature.color} 0%, ${alpha(feature.color, 0.5)} 100%)`,
                    mb: 3,
                  }}
                >
                  {React.cloneElement(feature.icon, {
                    sx: { fontSize: 32, color: 'white' },
                  })}
                </Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Products Section */}
      <Box sx={{ background: alpha(theme.palette.primary.main, 0.02), py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Our Investment Products
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Choose from our wide range of mutual fund schemes designed for every investor
          </Typography>

          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderTop: `4px solid ${product.color}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(product.color, 0.2)}`,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {product.title}
                    </Typography>
                    <Typography color="text.secondary" paragraph sx={{ mb: 3 }}>
                      {product.description}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 3,
                        pt: 3,
                        borderTop: `1px solid ${alpha('#000000', 0.1)}`,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Avg Returns
                        </Typography>
                        <Typography variant="h6" color={product.color} fontWeight={700}>
                          {product.returns}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Risk Level
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {product.risk}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            textAlign: 'center',
            mb: 6,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          All-in-One Financial Platform
        </Typography>

        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                OFA - One Financial Advisor
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                One Stop Solution for All Your Financial Services
              </Typography>
              <Typography paragraph sx={{ mb: 3, color: 'text.secondary' }}>
                A brilliant platform developed for Partners to build and improve their 
                client relationship and grow their business. Loaded with exciting features 
                to make Partners future-ready.
              </Typography>
              
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                STAY CONNECTED ON THE GO!
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { icon: <PhoneAndroid />, label: 'Advisor App' },
                  { icon: <Laptop />, label: 'OKA Admin' },
                  { icon: <Tablet />, label: 'Off-Action' },
                ].map((app, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: 3,
                          background: alpha(theme.palette.primary.main, 0.1),
                          mb: 1,
                        }}
                      >
                        {React.cloneElement(app.icon, {
                          sx: { fontSize: 32, color: theme.palette.primary.main },
                        })}
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {app.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/auth/login')}
                  sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                  }}
                >
                  Login to Platform
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open('/demo', '_blank')}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                  }}
                >
                  View Demo
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Key Features
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                {[
                  'Real-time portfolio tracking',
                  'Instant investment & redemption',
                  'SIP management on the go',
                  'Market insights & alerts',
                  'Secure biometric login',
                  'Multi-platform access',
                  'Advanced reporting',
                  'Client management tools',
                ].map((feature, idx) => (
                  <Box component="li" key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <CheckCircle sx={{ fontSize: 20, mr: 2, opacity: 0.8 }} />
                    <Typography>{feature}</Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/auth/register')}
                sx={{
                  background: 'white',
                  color: '#1a237e',
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    background: alpha('#ffffff', 0.9),
                  },
                }}
              >
                Get Started Free
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Ready to Start Your Investment Journey?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            Join 5 million+ investors who trust Infinity Mutual Funds for their financial growth
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/register')}
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #000051 0%, #0081cb 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(26, 35, 126, 0.3)',
              },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #000051 100%)',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <InfinityLogo size="large" />
              <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 300 }}>
                One stop solution for all your financial services needs. Empowering partners and investors since 2010.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Products
              </Typography>
              {['Equity Funds', 'Debt Funds', 'Hybrid Funds', 'ELSS', 'SIP', 'NFOs'].map((item) => (
                <Typography key={item} sx={{ opacity: 0.7, mb: 1, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Company
              </Typography>
              {['About Us', 'Careers', 'Blog', 'Press', 'Contact Us', 'Support'].map((item) => (
                <Typography key={item} sx={{ opacity: 0.7, mb: 1, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Download Our App
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{
                    background: 'white',
                    color: '#1a237e',
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  App Store
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{
                    background: 'white',
                    color: '#1a237e',
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  Play Store
                </Button>
              </Box>
              <Typography sx={{ mt: 3, opacity: 0.7 }}>
                Need help? Call us at: 1800-123-4567
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, opacity: 0.2 }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} Infinity Mutual Funds. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: { md: 'flex-end' } }}>
                <Typography sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Privacy Policy
                </Typography>
                <Typography sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  Terms of Service
                </Typography>
                <Typography sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                  SEBI Registration No: INF/12345/2010
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;