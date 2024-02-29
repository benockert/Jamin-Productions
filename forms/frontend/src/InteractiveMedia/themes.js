import { createTheme } from "@mui/material/styles";

const mainColor = "#fff";

export const northeastern2024 = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: mainColor,
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
          background: "linear-gradient(to right, #f21f4d, #f7eb3b)",
          color: mainColor,
        },
      },
    },
  },
});
