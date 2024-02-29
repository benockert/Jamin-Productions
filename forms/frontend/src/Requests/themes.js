import { createTheme } from "@mui/material/styles";

export const requestsFormTheme = createTheme({
  palette: {
    mode: "dark",
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
    MuiChip: {
      styleOverrides: {
        label: {
          whiteSpace: "normal", // to allow line break where necessary (mobile devices)
        },
      },
    },
  },
});
