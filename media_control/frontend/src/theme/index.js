import { createTheme } from '@mui/material/styles';

export const loginTheme = createTheme({
  palette: {
    primary: {
      main: '#C8102E' // likely brand primary as well
    },
    secondary: {
      main: '#f6f6f6' // likely brand light
    },
    background: {
      default: '#1a1a1a' // likely brand dark as well, or a dark grey
    },
    brand_colors: {
      primary: '#C8102E',
      secondary: '#1a1a1a',
      dark: '#1a1a1a',
      light: '#f6f6f6',
    }
  },
});

export const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: '#C8102E', // likely brand primary as well
    },
    secondary: {
      main: '#f6f6f6', // likely brand light
    },
    background: {
      default: '#1a1a1a', // likely brand dark as well, or a dark grey
      white: '#f6f6f6',
      grey: '#fafafa',
      transparent_grey: '#C0C0C0CB'
    },
    brand_colors: {
      primary: '#C8102E',
      secondary: '#1a1a1a',
      dark: '#1a1a1a',
      light: '#f6f6f6',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            backgroundColor: theme.palette.divider,
            color: theme.palette.secondary.main,
          }),
        label: {
          padding: '20px',
        }
      },
    },
  }
});