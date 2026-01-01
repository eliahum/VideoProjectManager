import { createTheme } from '@mui/material/styles';
import { heIL } from '@mui/material/locale';

export const theme = createTheme(
  {
    direction: 'rtl',
    palette: {
      mode: 'dark',
      primary: {
        main: '#a78bfa',
        light: '#c4b5fd',
        dark: '#8b5cf6',
      },
      secondary: {
        main: '#818cf8',
      },
      background: {
        default: '#1a1a2e',
        paper: 'rgba(26, 26, 46, 0.8)',
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: '"Heebo", "Roboto", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
    },
  },
  heIL
);
