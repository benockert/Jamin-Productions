import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { dashboardTheme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";

const SectionDivider = styled(Divider)(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
  fontSize: "18px",
}));

function DashboardLayout({ title, event, error, toggleError, children }) {
  return (
    <ThemeProvider theme={dashboardTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${event.banner_image_url})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: "background.default",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            backgroundColor: "background.default",
            maxHeight: "100vh",
            overflow: "auto",
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                backgroundColor: "#696768",
                color: "secondary.main",
                mb: 4,
                width: "100%",
                p: 0.5,
              }}
              align="center"
              variant="h3"
            >
              EVENT MEDIA CONTROL
            </Typography>
            {event.header_image_url ? (
              <Box
                component="img"
                src={event.header_image_url}
                sx={{ width: "clamp(350px, 70%, 85%)", mb: 4 }}
              />
            ) : (
              <Typography
                sx={{ color: "secondary.main", mb: 4 }}
                align="center"
                variant="h3"
              >
                {event.name}
              </Typography>
            )}
            <SectionDivider
              sx={{ color: "secondary.main", mb: 4 }}
              align="center"
              variant="h6"
            >
              {title}
            </SectionDivider>
            {children}
          </Box>
        </Grid>
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={toggleError}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          sx={{
            minWidth: "25%",
          }}
        >
          <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Grid>
    </ThemeProvider>
  );
}

export default DashboardLayout;
