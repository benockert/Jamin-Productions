import { createTheme } from "@mui/material/styles";

const mainColor = "#fff";
const success = "#66bb6a";
const error = "red";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: mainColor,
      success: success,
      error: error,
      brand: "#C8102E",
    },
    secondary: {
      main: "#171717",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: mainColor,
        },
      },
    },
  },
});
