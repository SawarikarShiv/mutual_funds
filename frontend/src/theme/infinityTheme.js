import { createTheme } from '@mui/material/styles';

const infinityTheme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00b0ff', // Bright blue
      light: '#69e2ff',
      dark: '#0081cb',
      contrastText: '#000000',
    },
    accent: {
      main: '#ff6f00', // Orange accent
      light: '#ffa040',
      dark: '#c43e00',
    },
    success: {
      main: '#00c853',
      light: '#5efc82',
      dark: '#009624',
    },
    warning: {
      main: '#ff9100',
      light: '#ffc246',
      dark: '#c56200',
    },
    error: {
      main: '#ff1744',
      light: '#ff616f',
      dark: '#c4001d',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    text: {
      primary: '#1a237e',
      secondary: '#5a5a5a',
      disabled: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#1a237e',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#1a237e',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1a237e',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1a237e',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#1a237e',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#5a5a5a',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px 0 rgba(0, 118, 255, 0.23)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #000051 0%, #0081cb 100%)',
          },
        },
        outlinedPrimary: {
          border: '2px solid',
          '&:hover': {
            border: '2px solid',
            background: 'rgba(26, 35, 126, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
        elevation1: {
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
        },
        elevation3: {
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a237e',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default infinityTheme;