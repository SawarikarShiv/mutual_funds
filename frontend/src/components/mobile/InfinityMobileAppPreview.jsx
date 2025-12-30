import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import {
  PhoneAndroid,
  QrCode,
  Download,
  Apple,
  Android,
} from '@mui/icons-material';

const InfinityMobileAppPreview = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: alpha('#ffffff', 0.1),
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: alpha('#ffffff', 0.05),
        }}
      />

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Infinity Mobile App
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Stay connected on the go with our powerful mobile application
          </Typography>

          <Box sx={{ mb: 3 }}>
            {[
              'Real-time portfolio tracking',
              'Instant investment & redemption',
              'SIP management on the go',
              'Market insights & alerts',
              'Secure biometric login',
            ].map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    mr: 2,
                  }}
                />
                <Typography>{feature}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Apple />}
              sx={{
                background: 'white',
                color: 'black',
                '&:hover': {
                  background: alpha('#ffffff', 0.9),
                },
              }}
            >
              App Store
            </Button>
            <Button
              variant="contained"
              startIcon={<Android />}
              sx={{
                background: 'white',
                color: 'black',
                '&:hover': {
                  background: alpha('#ffffff', 0.9),
                },
              }}
            >
              Play Store
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  background: alpha('#ffffff', 0.1),
                },
              }}
            >
              Download APK
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-block',
                position: 'relative',
                p: 2,
                background: alpha('#000000', 0.2),
                borderRadius: 4,
                backdropFilter: 'blur(10px)',
              }}
            >
              <PhoneAndroid
                sx={{
                  fontSize: 200,
                  color: 'white',
                  opacity: 0.8,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" fontWeight={800}>
                  ∞
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Infinity App
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                p: 2,
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <QrCode sx={{ fontSize: 100, color: 'black' }} />
              <Typography variant="caption" color="black" display="block">
                Scan to Download
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfinityMobileAppPreview;