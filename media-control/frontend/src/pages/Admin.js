import React, { useEffect, useState, useRef } from "react";
import {
  get_event,
  get_screens,
  get_media,
  update_screen_media,
  set_playback_volume,
  update_video_playback,
} from "../api/api.js";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { CardActionArea } from "@mui/material";
import { dashboardTheme } from "../theme";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import io from "socket.io-client";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import Chip from "@mui/material/Chip";
import ChooseMediaPopupDialog from "../components/SelectMedia.js";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ReplayIcon from "@mui/icons-material/Replay";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const SOCKET_HOST =
  process.env.NODE_ENV === "production"
    ? "http://44.198.176.45:5002"
    : "http://localhost:5002";
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
}));

const NextChip = styled(Chip)(({ theme }) => ({
  outline: "1px solid",
  outlineColor: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.main,
  paddingLeft: 5,
  ".MuiChip-icon": {
    color: theme.palette.secondary.main,
  },
  fontSize: "12px",
  borderRadius: "0px",
}));

function ScreensView({
  event,
  screens,
  connectedScreens,
  screenSchedule,
  playbackData,
  onClickCallback,
  toggleVolumeDialog,
  sendVideoAction,
}) {
  const connectedScreenCards = [];
  const allScreens = screens.reduce(
    (acc, cur) => ((acc[cur.url_name] = cur), acc),
    {}
  );
  if (connectedScreens) {
    Object.keys(connectedScreens).forEach((screenUrl) => {
      const screenInfo = connectedScreens[screenUrl];
      connectedScreenCards.push(
        <Grid item xs={10} sm={8} md={6} key={`screen_${screenUrl}`}>
          <Card component={Item} sx={{ maxWidth: 280 }}>
            <CardMedia
              className="screen-image"
              component="iframe"
              scrolling="no"
              src={`${API_HOST}/${event.id}/${screenInfo.cur_media_url}`}
              sx={{ objectFit: "contain" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {screenInfo.name}
              </Typography>
              <Typography variant="h5" component="div">
                {screenSchedule[screenUrl] ? (
                  <NextChip
                    icon={<CastConnectedIcon />}
                    label={`Next: ${
                      screenSchedule[screenUrl].target_media_name
                    } at ${new Date(
                      screenSchedule[screenUrl].time
                    ).toLocaleTimeString()}
                    `}
                  />
                ) : (
                  <NextChip
                    icon={<WebAssetOffIcon />}
                    label="Screen is not scheduled"
                  />
                )}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                sx={{ width: "100%" }}
                xs={9}
                sm={9}
                md={9}
                onClick={() =>
                  onClickCallback({
                    screen_url: screenUrl,
                    media_url: screenInfo.cur_media_url,
                    screen_name: screenInfo.name,
                    orientation: allScreens[screenUrl]?.orientation,
                  })
                }
              >
                Update
              </Button>
              {allScreens?.hasOwnProperty(screenUrl) ? (
                allScreens[screenUrl].playback_enabled === 1 ? (
                  <IconButton
                    item
                    xs={3}
                    onClick={() => toggleVolumeDialog(playbackData.volume)}
                  >
                    {playbackData.volume === "0" ? (
                      <VolumeOffIcon />
                    ) : (
                      <VolumeUpIcon sx={{ color: "primary.main" }} />
                    )}
                  </IconButton>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </CardActions>
            <CardActions>
              {allScreens?.hasOwnProperty(screenUrl) ? (
                allScreens[screenUrl].playback_enabled === 2 ? (
                  <>
                    <IconButton
                      onClick={() => sendVideoAction(screenUrl, "play-video")}
                    >
                      <PlayArrowIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => sendVideoAction(screenUrl, "pause-video")}
                    >
                      <PauseIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                    <IconButton
                      onClick={() => sendVideoAction(screenUrl, "reset-video")}
                    >
                      <ReplayIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </CardActions>
          </Card>
        </Grid>
      );
    });
  }

  const disconnectedScreenCards = [];
  if (screens) {
    Array.from(screens).forEach((screen) => {
      if (!connectedScreens?.hasOwnProperty(screen.url_name)) {
        disconnectedScreenCards.push(
          <Grid item xs={10} sm={8} md={6} key={`screen_${screen.url_name}`}>
            <Card component={Item} sx={{ maxWidth: 280 }}>
              <CardActionArea>
                <CardMedia
                  className="screen-image"
                  component="img"
                  src={`${STATIC_URL}/screens/screen_not_online.jpg`}
                  alt="Screen not online"
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {screen.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      }
    });
  }

  if (connectedScreenCards || disconnectedScreenCards) {
    return (
      <>
        {connectedScreenCards}
        {disconnectedScreenCards}
      </>
    );
  } else {
    return (
      <Typography gutterBottom variant="h5" component="div">
        There are no screens for this event.
      </Typography>
    );
  }
}

function Admin() {
  const [event, setEvent] = useState();
  const [screens, setScreens] = useState();
  const [media, setMedia] = useState();
  const [realtimeScreenData, setRealtimeScreenData] = useState();
  const [openChooseMediaDialog, setOpenChooseMediaDialog] = useState(false);
  const [playbackData, setPlaybackData] = useState({});
  const [error, setError] = useState();
  const [selected, setSelected] = useState("");
  const [openVolumeDialog, setOpenVolumeDialog] = useState(false);
  const [dialogVolume, setDialogVolume] = useState();
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  useEffect(() => {
    if (event) {
      const socket = io(SOCKET_HOST);

      socket.on("connect", () => {
        socket.emit("admin_connected", { token: token.current });
      });

      socket.on("screen_updates", (data) => {
        setRealtimeScreenData(data);
      });

      socket.on("playback_updates", (data) => {
        setPlaybackData(data);
      });

      socket.on("disconnect", () => window.location.reload(false));
    }
  }, [event]);

  useEffect(() => {
    get_event(token.current).then((event) => {
      console.log(event);
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

  const onScreenCardClick = (screenInfo) => {
    setOpenChooseMediaDialog(screenInfo);
    setSelected(screenInfo.media_url);
  };

  const toggleVolumeDialog = (value) => {
    setDialogVolume(Number(value));
    setOpenVolumeDialog(true);
  };

  const sendVideoAction = (screenUrl, action) => {
    update_video_playback(token.current, screenUrl, action).then((resp) => {
      if (resp.status != 204) {
        setError(resp.body.message);
      }
    });
  };

  const closeVolumeDialog = () => {
    setOpenVolumeDialog(false);
  };

  const handleVolumeChangeCommitted = () => {
    set_playback_volume(token.current, dialogVolume).then((resp) => {
      if (resp.status != 204) {
        setError(resp.body.message);
      }
    });
  };

  const handleVolumeChange = (event, newVolume) => {
    setDialogVolume(newVolume);
  };

  const onScreenNameDialogCancel = (event) => {
    event.preventDefault();
    setSelected("");
    setOpenChooseMediaDialog(false);
  };

  const onScreenNameDialogSubmit = (event, selectedMedia) => {
    event.preventDefault();
    update_screen_media(
      token.current,
      openChooseMediaDialog.screen_url,
      selectedMedia
    ).then((resp) => {
      if (resp.message === "success") {
        setSelected("");
        setOpenChooseMediaDialog(false);
      } else {
      }
    });
  };

  return (
    event &&
    media &&
    realtimeScreenData && (
      <ThemeProvider theme={dashboardTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
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
              <Container>
                <Typography
                  component="h1"
                  variant="h4"
                  align="center"
                  color="secondary.main"
                  gutterBottom
                >
                  {event?.name}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  color="secondary.main"
                >
                  Admin Dashboard
                </Typography>
              </Container>
              <Divider
                sx={{ marginBottom: 4, width: "100%" }}
                role="presentation"
              />
              <ScreensView
                event={event}
                screens={screens}
                connectedScreens={realtimeScreenData.screenMedia}
                screenSchedule={realtimeScreenData.screenSchedule}
                playbackData={playbackData}
                onClickCallback={onScreenCardClick}
                toggleVolumeDialog={toggleVolumeDialog}
                sendVideoAction={sendVideoAction}
              ></ScreensView>
              <ChooseMediaPopupDialog
                openDialog={openChooseMediaDialog}
                media={media}
                handleClose={onScreenNameDialogCancel}
                handleSubmit={onScreenNameDialogSubmit}
                selected={selected}
                setSelected={setSelected}
              ></ChooseMediaPopupDialog>
              <Dialog onClose={closeVolumeDialog} open={openVolumeDialog}>
                <DialogTitle>Playback volume</DialogTitle>
                <DialogContent>
                  <Box sx={{ width: 200, padding: 1 }}>
                    <Stack
                      spacing={2}
                      direction="row"
                      sx={{ mb: 1 }}
                      alignItems="center"
                    >
                      <VolumeOffIcon />
                      <Slider
                        min={0}
                        max={100}
                        aria-label="Volume"
                        value={dialogVolume}
                        onChange={handleVolumeChange}
                        onChangeCommitted={handleVolumeChangeCommitted}
                      />
                      <VolumeUpIcon />
                    </Stack>
                  </Box>
                </DialogContent>
                <DialogActions sx={{ marginTop: -3 }}>
                  <Button onClick={closeVolumeDialog}>Close</Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
          <Snackbar
            open={!!error}
            autoHideDuration={5000}
            onClose={toggleError}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          </Snackbar>
        </Grid>
      </ThemeProvider>
    )
  );
}

export default Admin;
