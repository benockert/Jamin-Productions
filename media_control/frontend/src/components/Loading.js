import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider } from "@mui/material/styles";
import { dashboardTheme } from "../theme";

const Loading = () => {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress sx={{ color: "secondary.main" }} />
      </Stack>
    </ThemeProvider>
  );
};

export default Loading;
