'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define the color palette based on Career Quill brand
const darkPalette = {
  mode: 'dark' as const,
  primary: {
    main: '#C87E42',
    light: '#E4B784',
    dark: '#A66835',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#5A64B3',
    light: '#8B92D9',
    dark: '#3F4682',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#1E1F23',
    paper: '#2A2B31',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#AEB1BA',
  },
  error: {
    main: '#FF5A5F',
  },
  success: {
    main: '#4CAF50',
  },
  warning: {
    main: '#FFA726',
  },
  divider: '#3C3E46',
};

const lightPalette = {
  mode: 'light' as const,
  primary: {
    main: '#C87E42',
    light: '#E4B784',
    dark: '#A66835',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#5A64B3',
    light: '#8B92D9',
    dark: '#3F4682',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8F9FB',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1A1B1D',
    secondary: '#4D4F57',
  },
  error: {
    main: '#C44545',
  },
  success: {
    main: '#4CAF50',
  },
  warning: {
    main: '#FFA726',
  },
  divider: '#D3D4D8',
};

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:focus-visible': {
            outline: '2px solid',
            outlineOffset: '2px',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
};

export const createCareerQuillTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    ...commonThemeOptions,
    palette: mode === 'dark' ? darkPalette : lightPalette,
  });
};
