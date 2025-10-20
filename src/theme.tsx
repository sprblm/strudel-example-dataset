import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

/**
 * MUI Theme object for setting app-wide and component-wide styles.
 * Specify colors, spacing, fonts, and more.
 * Learn more about theme options: https://mui.com/material-ui/customization/theming/
 */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0d0d',
      paper: '#131313',
    },
    primary: {
      main: '#f5f5f0',
      contrastText: '#0a0a0a',
    },
    secondary: {
      main: '#5c5c5c',
      light: '#6f6f6f',
      dark: '#3c3c3c',
      contrastText: '#f5f5f0',
    },
    info: {
      main: '#8ba7ff',
      light: '#a6bbff',
      dark: '#5163c9',
      contrastText: '#0a0a0a',
    },
    success: {
      main: '#7ed17a',
      contrastText: '#0a0a0a',
    },
    warning: {
      main: '#f5c16c',
      contrastText: '#0a0a0a',
    },
    error: {
      main: '#ff8080',
      contrastText: '#0a0a0a',
    },
    neutral: {
      main: '#262626',
      light: '#2f2f2f',
      dark: '#191919',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    grey: {
      50: '#f2f2f2',
      200: '#d1d1d1',
      500: '#8a8a8a',
      700: '#3e3e3e',
      900: '#1a1a1a',
    },
    divider: '#1f1f1f',
    text: {
      primary: '#f5f5f5',
      secondary: '#b0b0b0',
    },
  },
  shape: {
    borderRadius: 6,
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: `"Space Grotesk", "Helvetica Neue", "Arial", sans-serif`,
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '3.25rem',
      fontWeight: 300,
      letterSpacing: '-0.035em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 300,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.7,
      fontSize: '1rem',
    },
    body2: {
      lineHeight: 1.6,
      fontSize: '0.95rem',
    },
    overline: {
      fontSize: '0.75rem',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0d0d0d',
          color: '#f5f5f5',
          letterSpacing: '0.01em',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          letterSpacing: '0.02em',
          paddingInline: '1.4rem',
          paddingBlock: '0.65rem',
        },
        containedPrimary: {
          backgroundColor: '#f5f5f0',
          color: '#0a0a0a',
          '&:hover': {
            backgroundColor: '#e2e2da',
          },
        },
        outlined: {
          borderColor: '#2d2d2d',
          color: '#f5f5f5',
          '&:hover': {
            borderColor: '#404040',
            backgroundColor: 'rgba(255,255,255,0.04)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#f5f5f5',
          textDecoration: 'none',
          '&:hover': {
            color: '#ffffff',
            textDecoration: 'underline',
            textDecorationThickness: '1px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131313',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#131313',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          backgroundColor: '#131313',
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-overlayWrapper': {
            minHeight: '4rem',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#e1e1e1',
            fontSize: '0.85rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          },
        },
      },
    },
  },
});
