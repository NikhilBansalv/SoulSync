// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Vibrant blue
    },
    secondary: {
      main: '#ff4081', // Pink for accents
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
