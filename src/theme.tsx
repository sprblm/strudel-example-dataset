import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

const bodyFontFamily =
  '"Inter", "Helvetica Neue", "Arial", "Segoe UI", sans-serif';
const displayFontFamily =
  '"Source Serif 4", "Iowan Old Style", "Times New Roman", serif';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f8f8f5',
      paper: '#ffffff',
    },
    primary: {
      main: '#1c336b',
      light: '#3f4f8f',
      dark: '#111c45',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6f7f6b',
      light: '#95a38f',
      dark: '#556452',
      contrastText: '#ffffff',
    },
    info: {
      main: '#55708e',
      light: '#7a93b0',
      dark: '#354c63',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2f6b3d',
      light: '#4b8758',
      dark: '#1b4d27',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#b36b04',
      light: '#d5851c',
      dark: '#764601',
      contrastText: '#ffffff',
    },
    error: {
      main: '#b23b3b',
      light: '#d15b5b',
      dark: '#7a2626',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1f1f1f',
      secondary: '#494943',
    },
    divider: '#e0e0da',
    neutral: {
      main: '#deded8',
      light: '#f1f1ed',
      dark: '#9f9f9a',
    },
    common: {
      black: '#0d0d0d',
      white: '#ffffff',
    },
    grey: {
      50: '#f4f4f0',
      100: '#e5e5e0',
      300: '#c7c7c0',
      500: '#8a8a84',
      700: '#5b5b57',
      900: '#1f1f1c',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: bodyFontFamily,
    fontSize: 15,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: displayFontFamily,
      fontWeight: 600,
      fontSize: '3rem',
      lineHeight: 1.08,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontFamily: displayFontFamily,
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: displayFontFamily,
      fontWeight: 600,
      fontSize: '1.8rem',
      lineHeight: 1.18,
    },
    h4: {
      fontFamily: bodyFontFamily,
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontFamily: bodyFontFamily,
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontFamily: bodyFontFamily,
      fontWeight: 600,
      fontSize: '1.1rem',
    },
    overline: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      fontSize: '0.75rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.015em',
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingBlock: '0.6rem',
          paddingInline: '1.25rem',
        },
        contained: {
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#1c336b',
          '&:hover': {
            backgroundColor: '#162856',
          },
        },
        outlined: {
          borderWidth: 1,
          borderColor: '#1c336b',
          color: '#1c336b',
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: '#162856',
            backgroundColor: 'rgba(28, 51, 107, 0.06)',
          },
        },
        text: {
          color: '#1c336b',
          paddingInline: '0.75rem',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #e0e0da',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 6,
          fontFamily: bodyFontFamily,
          fontWeight: 600,
          letterSpacing: '0.08em',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          borderColor: '#d0d0cc',
          '&.Mui-selected': {
            backgroundColor: 'rgba(28, 51, 107, 0.12)',
            borderColor: '#1c336b',
            color: '#1c336b',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-overlayWrapper': {
            minHeight: '4rem',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#1f1f1f',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          },
        },
      },
    },
  },
});

export const highContrastTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#060606',
      paper: '#111111',
    },
    primary: {
      main: '#ffbf47',
      dark: '#e09b00',
      light: '#ffd36d',
      contrastText: '#000000',
    },
    secondary: {
      main: '#64ffda',
      dark: '#1de9b6',
      light: '#9cfffb',
      contrastText: '#001b1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
    },
    divider: '#374151',
    neutral: {
      main: '#dadada',
      light: '#e0e0e0',
      dark: '#828282',
    },
    grey: {
      50: '#1f2937',
      500: '#6b7280',
      900: '#f3f4f6',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: bodyFontFamily,
    fontSize: 15,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontFamily: displayFontFamily,
      fontWeight: 600,
      fontSize: '3rem',
      lineHeight: 1.08,
    },
    h2: {
      fontFamily: displayFontFamily,
      fontWeight: 600,
      fontSize: '2.25rem',
    },
    h3: {
      fontFamily: displayFontFamily,
      fontWeight: 600,
      fontSize: '1.8rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #374151',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: 'none',
        },
      },
    },
  },
});
