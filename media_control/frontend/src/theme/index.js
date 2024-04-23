import { createTheme } from "@mui/material/styles";

export const loginTheme = createTheme({
  palette: {
    primary: {
      main: "#C8102E", // likely brand primary as well
    },
    secondary: {
      main: "#f6f6f6", // likely brand light
    },
    background: {
      default: "#1a1a1a", // likely brand dark as well, or a dark grey
    },
    brand_colors: {
      primary: "#C8102E",
      secondary: "#1a1a1a",
      dark: "#1a1a1a",
      light: "#f6f6f6",
    },
  },
});

export const dashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#C8102E", // likely brand primary as well
    },
    secondary: {
      main: "#f6f6f6", // likely brand light
    },
    background: {
      default: "#1a1a1a", // likely brand dark as well, or a dark grey
      white: "#f6f6f6",
      grey: "#fafafa",
      transparent_grey: "#C0C0C0CB",
    },
    brand_colors: {
      primary: "#C8102E",
      secondary: "#1a1a1a",
      dark: "#1a1a1a",
      light: "#f6f6f6",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    h3: {
      fontFamily: ["Elaine Sans", "sans-serif"].join(","),
      fontSize: 26,
    },
    h5: {
      fontFamily: ["Red Hat Text", "sans-serif"].join(","),
      fontSize: 22,
      fontWeight: "600",
    },
    h6: {
      fontFamily: ["Red Hat Text", "sans-serif"].join(","),
      fontSize: 18,
      fontWeight: "600",
    },
    body2: {
      fontFamily: ["Red Hat Text", "sans-serif"].join(","),
      fontSize: 16,
      fontWeight: "600",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      lg: 1250,
      xl: 1650,
    },
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
          padding: "20px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          ":hover": {
            borderWidth: 2,
          },
        },
      },
    },
  },
});
