import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const InfinityMutualFundsLogo = ({ size = 'medium' }) => {
  const theme = useTheme();
  
  const sizes = {
    small: { fontSize: 20, spacing: 1 },
    medium: { fontSize: 32, spacing: 1.5 },
    large: { fontSize: 48, spacing: 2 },
  };

  const { fontSize, spacing } = sizes[size] || sizes.medium;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing,
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      {/* Infinity Symbol */}
      <Box
        sx={{
          position: 'relative',
          width: fontSize,
          height: fontSize,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: fontSize * 0.8,
            height: fontSize * 0.4,
            border: `3px solid ${theme.palette.primary.main}`,
            borderRadius: '50%',
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            transform: 'rotate(45deg)',
            top: fontSize * 0.1,
            left: fontSize * 0.1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: fontSize * 0.8,
            height: fontSize * 0.4,
            border: `3px solid ${theme.palette.primary.main}`,
            borderRadius: '50%',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            transform: 'rotate(45deg)',
            top: fontSize * 0.1,
            right: fontSize * 0.1,
          }}
        />
      </Box>

      {/* Text */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            fontSize: fontSize * 0.9,
          }}
        >
          Infinity
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.secondary,
            lineHeight: 1,
            fontSize: fontSize * 0.4,
            display: 'block',
            mt: -0.5,
          }}
        >
          Mutual Funds
        </Typography>
      </Box>
    </Box>
  );
};

export default InfinityMutualFundsLogo;