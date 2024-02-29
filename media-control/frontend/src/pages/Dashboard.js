import React, { useEffect, useState, useRef } from "react";
import {
  get_event,
  get_screens,
  get_media,
  new_screen,
  get_screen_media,
} from "../api/api.js";
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
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const API_HOST =
  process.env.NODE_ENV === "production"
    ? "http://44.198.176.45:5002/api/v1"
    : "http://localhost:5002/api/v1";
const STATIC_URL = "https://static.event-media-control.com";

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

const Tab = styled(Chip)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    outline: "1px solid",
    outlineColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.divider,
  },
  "&.active-tab": {
    backgroundColor: theme.palette.primary.main,
    outline: "1px solid",
    outlineColor: theme.palette.secondary.main,
  },
}));

function AddAScreenCard({ callback }) {
  return (
    <Grid
      className="add-screen-plus"
      item
      xs={2}
      sm={6}
      md={6}
      key={`screen_new`}
    >
      <Card
        component={Item}
        sx={{ maxWidth: "100%", width: "100vw", height: "200px" }}
      >
        <CardActionArea
          className="add-screen-plus"
          sx={{
            height: "100%",
            width: "100%",
            backgroundColor: "background.transparent_grey",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
          onClick={() => callback()}
        >
          <AddIcon
            sx={{
              color: "secondary.main",
              fontSize: "100px",
              position: "relative",
            }}
          />
        </CardActionArea>
      </Card>
    </Grid>
  );
}

function MediaView({ data: medias, onCardClickCallback }) {
  if (medias) {
    return (
      <>
        {Array.from(medias).map((media, idx) => (
          <Grid item xs={10} sm={8} md={6} key={`media_${idx}`}>
            <Card component={Item}>
              <CardActionArea
                onClick={() => onCardClickCallback(media.url_name)}
              >
                <CardMedia
                  className="screen-image"
                  component="img"
                  height="140"
                  image={STATIC_URL + media.thumbnail_image}
                  alt={media.description}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {media.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {media.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </>
    );
  } else {
    return <div></div>;
  }
}

function ScreensView({
  data: screens,
  addScreenCallback,
  redirectPageCallback,
}) {
  if (screens) {
    return (
      <>
        {Array.from(screens).map((screen, idx) => (
          <Grid item xs={10} sm={8} md={6} key={`screen_${idx}`}>
            <Card component={Item}>
              <CardActionArea
                onClick={() =>
                  redirectPageCallback(screen.url_name, screen.name)
                }
              >
                <CardMedia
                  className="screen-image"
                  component="img"
                  height="140"
                  image={STATIC_URL + screen.image_url}
                  alt={screen.description}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {screen.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {screen.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        {/* <AddAScreenCard callback={addScreenCallback}></AddAScreenCard> */}
      </>
    );
  } else {
    return <div></div>;
  }
}

function NewScreenPopupDialog({ open, onCancelCallback, onSubmitCallback }) {
  const [screenName, setScreenName] = useState("");
  return (
    <Dialog
      open={open}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Enter A New Screen Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="screen-name"
          label="Screen Name"
          fullWidth
          variant="standard"
          value={screenName}
          onChange={(event) => setScreenName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={(event) => onCancelCallback(event)}>Cancel</Button>
        <Button
          type="submit"
          onClick={(event) => onSubmitCallback(event, screenName)}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Dashboard() {
  let navigate = useNavigate();
  const [event, setEvent] = useState();
  const [screens, setScreens] = useState();
  const [media, setMedia] = useState([]);
  const [onScreenTab, setOnScreenTab] = useState(true);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [error, setError] = useState();
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  useEffect(() => {
    get_event(token.current).then((event) => {
      setEvent(event);
    });

    get_screens(token.current).then((screens) => {
      setScreens(screens);
    });

    get_media(token.current).then((media) => {
      setMedia(media);
    });
  }, []);

  const toggleError = () => {
    setError();
  };

  const onMediaCardClick = (mediaName) => {
    setOpenMediaDialog(mediaName);
  };

  const redirectToMediaPage = (screen_url, screen_name) => {
    get_screen_media(screen_url, token.current).then((media) => {
      if (media.status === 200) {
        window.location.href = `${API_HOST}/${event.id}/${screen_url}/${
          media.media_url
        }?name=${encodeURIComponent(screen_name)}`;
      } else {
        setError(media.message);
      }
    });
  };

  const onScreenNameDialogCancel = (event) => {
    event.preventDefault();
    setOpenMediaDialog(false);
  };

  const onScreenNameDialogSubmit = (e, userScreenName) => {
    e.preventDefault();

    new_screen(token.current, openMediaDialog, userScreenName).then((res) => {
      if (res.status === 200) {
        const newScreenUrl = res.screen_url;
        const mediaUrl = res.media_url;
        window.location.href = `${API_HOST}/${
          event.id
        }/${newScreenUrl}/${mediaUrl}?name=${encodeURIComponent(
          userScreenName
        )}`;
      } else {
        setError(res.message);
      }
    });
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
              backgroundImage: `url(${STATIC_URL + event.banner_image_name})`,
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
            <Typography
              sx={{ color: "secondary.main" }}
              align="center"
              variant="h3"
            >
              {event?.name}
            </Typography>
            <Divider sx={{ m: 4, width: "100%" }} role="presentation">
              <Tab
                className={onScreenTab ? "active-tab" : ""}
                onClick={() => setOnScreenTab(true)}
                sx={{ mr: 1 }}
                label="Scheduled Screens"
              ></Tab>
              <Tab
                sx={{ ml: 1 }}
                className={!onScreenTab ? "active-tab" : ""}
                onClick={() => setOnScreenTab(false)}
                label="Available Media"
              ></Tab>
            </Divider>
            {onScreenTab ? (
              <ScreensView
                data={screens}
                redirectPageCallback={redirectToMediaPage}
              ></ScreensView>
            ) : (
              <MediaView
                data={media}
                onCardClickCallback={onMediaCardClick}
              ></MediaView>
            )}
            <NewScreenPopupDialog
              open={!!openMediaDialog}
              onCancelCallback={onScreenNameDialogCancel}
              onSubmitCallback={onScreenNameDialogSubmit}
            ></NewScreenPopupDialog>
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
