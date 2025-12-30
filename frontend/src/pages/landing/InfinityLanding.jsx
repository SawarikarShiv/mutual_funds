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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InfinityMutualFundsLogo from '../../components/branding/InfinityLogo';

const InfinityLanding = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp />,
      title: 'Superior Returns',
      description: 'Consistent performance with market-beating returns',
    },
    {
      icon: <Security />,
      title: '100% Secure',
      description: 'Bank-level security with SEBI regulation',
    },
    {
      icon: <AccountBalance />,
      title: 'Expert Management',
      description: 'Managed by industry veterans with 20+ years experience',
    },
    {
      icon: <People />,
      title: '5 Million+ Investors',
      description: 'Trusted by investors across India',
    },
  ];

  const products = [
    {
      title: 'Equity Funds',
      description: 'Long-term wealth creation',
      returns: '12-18%',
      risk: 'High',
      color: theme.palette.primary.main,
    },
    {
      title: 'Debt Funds',
      description: 'Stable income generation',
      returns: '7-9%',
      risk: 'Low',
      color: theme.palette.success.main,
    },
    {
      title: 'Hybrid Funds',
      description: 'Balanced growth & income',
      returns: '9-12%',
      risk: 'Moderate',
      color: theme.palette.warning.main,
    },
    {
      title: 'ELSS Funds',
      description: 'Tax saving with growth',
      returns: '12-15%',
      risk: 'High',
      color: theme.palette.accent?.main || '#ff6f00',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
          color: 'white',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <InfinityMutualFundsLogo size="large" />
              </Box>
              <Typography variant="h2" fontWeight={800} gutterBottom>
                Your Journey to
                <Box component="span" sx={{ color: '#ff6f00' }}>
                  {' '}Financial Freedom
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                India's most trusted mutual fund platform with
                <Box component="span" fontWeight={700}> ₹2,450+ Crores</Box> AUM
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/auth/register')}
                  sx={{
                    background: 'white',
                    color: 'black',
                    '&:hover': { background: alpha('#ffffff', 0.9) },
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
                    '&:hover': { borderColor: 'white', background: alpha('#ffffff', 0.1) },
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
                  <PhoneAndroid sx={{ fontSize: 100, opacity: 0.8 }} />
                  <Laptop sx={{ fontSize: 100, opacity: 0.8 }} />
                  <Tablet sx={{ fontSize: 100, opacity: 0.8 }} />
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
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>
          Why Choose Infinity?
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          Experience the future of mutual fund investing
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
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
        <Container>
          <Typography variant="h3" fontWeight={800} textAlign="center" gutterBottom>
            Our Investment Products
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            Choose from our wide range of mutual fund schemes
          </Typography>

          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderTop: `4px solid ${product.color}`,
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
                    <Typography color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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

      {/* CTA Section */}
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Ready to Start Your Investment Journey?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
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
            '&:hover': {
              background: 'linear-gradient(135deg, #000051 0%, #0081cb 100%)',
            },
          }}
        >
          Get Started Free
        </Button>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #000051 100%)',
          color: 'white',
          py: 6,
        }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <InfinityMutualFundsLogo size="large" />
              <Typography sx={{ mt: 2, opacity: 0.8 }}>
                One stop solution for all your financial services needs
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Products
              </Typography>
              {['Equity Funds', 'Debt Funds', 'Hybrid Funds', 'ELSS', 'SIP'].map((item) => (
                <Typography key={item} sx={{ opacity: 0.7, mb: 1 }}>
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Company
              </Typography>
              {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                <Typography key={item} sx={{ opacity: 0.7, mb: 1 }}>
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Download Our App
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{ background: 'white', color: 'black' }}
                >
                  App Store
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  sx={{ background: 'white', color: 'black' }}
                >
                  Play Store
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, opacity: 0.2 }} />
          <Typography textAlign="center" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Infinity Mutual Funds. All rights reserved.
            <Box component="span" sx={{ mx: 2 }}>•</Box>
            SEBI Registration No: INF/12345/2010
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default InfinityLanding;