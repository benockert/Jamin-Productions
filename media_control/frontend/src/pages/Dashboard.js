import React, { useEffect, useState, useRef } from "react";
import { get_event, get_screens, get_screen_media } from "../api/api.js";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { dashboardTheme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";
import { API_HOST } from "../api/api.js";

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginBottom: 50,
  maxWidth: "100%",
  width: "100vw",
  height: "auto",
  "&:hover": {
    transition: "all .2s ease",
    MozTransition: "all .2s ease",
    OTransition: "all .2s ease",
    WebkitTransition: "all .2s ease",
    transform: "scale(1.05)",
    transition: ".4s ease",
    backgroundColor: theme.palette.background.grey,
  },
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
  fontSize: "18px",
}));

function ScreensView({ data: screens, redirectPageCallback }) {
  if (screens) {
    return (
      <>
        {Array.from(screens).map((screen, idx) => {
          return (
            <Grid
              item
              xs={10}
              sm={9}
              md={8}
              lg={7}
              xl={6}
              key={`screen_${idx}`}
            >
              <Card component={Item}>
                <CardActionArea
                  onClick={() =>
                    redirectPageCallback(
                      screen.event_id,
                      screen.id,
                      screen.default_media_id
                    )
                  }
                >
                  <CardMedia
                    className="screen-image"
                    component="img"
                    height="140"
                    image={screen.image_url}
                    alt={screen.description}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {screen.name}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="body2"
                      color="text.secondary"
                    >
                      {screen.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Media:</b> {screen.default_media_id}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </>
    );
  } else {
    return <div></div>;
  }
}

function Dashboard() {
  let navigate = useNavigate();
  const [event, setEvent] = useState();
  const [screens, setScreens] = useState();
  const [error, setError] = useState();
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  useEffect(() => {
    get_event(token.current).then((response) => {
      setEvent(response);
    });

    get_screens(token.current).then((response) => {
      setScreens(response.screens);
    });
  }, []);

  const toggleError = () => {
    setError();
  };

  const redirectToMediaPage = (event_id, screen_id, media_id) => {
    // get_screen_media(screen_url, token.current).then((media) => {
    //   if (media.status === 200) {
    //     // navigate
    //     window.location.href = `${API_HOST}/${event.id}/${screen_url}/${
    //       media.media_url
    //     }?name=${encodeURIComponent(screen_name)}`;
    //   } else {
    //     setError(media.message);
    //   }
    // });
    window.location.href = `${API_HOST}/v1/html/${event_id}/${screen_id}/${media_id}`;
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        {event && (
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
        )}
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
              my: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {event?.header_image_url ? (
              <Box
                component="img"
                src={event?.header_image_url}
                sx={{ width: "clamp(350px, 70%, 85%)" }}
              />
            ) : (
              <Typography
                sx={{ color: "secondary.main", mt: 2 }}
                align="center"
                variant="h3"
              >
                {event?.name}
              </Typography>
            )}
            <SectionDivider
              sx={{ color: "secondary.main", m: 4 }}
              align="center"
              variant="h6"
            >
              Screen Selection
            </SectionDivider>
            <ScreensView
              data={screens}
              redirectPageCallback={redirectToMediaPage}
            ></ScreensView>
          </Box>
        </Grid>
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={toggleError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Grid>
    </ThemeProvider>
  );
}

export default Dashboard;
