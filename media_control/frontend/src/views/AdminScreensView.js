import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import IconButton from "@mui/material/IconButton";
import ConnectedTvIcon from "@mui/icons-material/ConnectedTv";
import DesktopAccessDisabledIcon from "@mui/icons-material/DesktopAccessDisabled";
import { ScreenInfoChip } from "../theme/custom.js";
import { styled } from "@mui/system";
import { IS_PROD } from "../config/config.js";

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginBottom: 30,
  height: "auto",
  maxWidth: "100%",
  width: "100vw",
  borderStyle: "solid",
  borderWeight: 2,
  borderColor: theme.palette.secondary.main,
  boxShadow: "1px 2px 20px 5px rgba(50, 50, 50) !important",
}));

const formatTimestamp = (timstampString) => {
  const date = new Date(parseInt(timstampString)).toLocaleTimeString();
  return `${date.slice(0, date.lastIndexOf(":"))}${date.slice(
    date.lastIndexOf(":") + 4
  )}`;
};

const ActiveScreen = ({
  screen,
  allMedia,
  onUpdateClickCallback,
  onVolumeClickCallback,
}) => {
  return (
    <Grid
      item
      xs={10}
      sm={9}
      md={8}
      lg={7}
      xl={6}
      key={`screen_${screen.id}`}
      sx={{ position: "relative" }}
    >
      <Card component={Item}>
        <CardMedia
          component="img"
          alt=""
          height="170"
          image={allMedia[`media.${screen.current_media_id}`]?.image_url ?? ""}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {screen.name}
          </Typography>
          <Typography variant="body3" component="div">
            {allMedia[`media.${screen.current_media_id}`]?.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              borderWidth: 2,
            }}
            xs={9}
            sm={9}
            md={9}
            onClick={() => onUpdateClickCallback(screen)}
          >
            Update
          </Button>
          {screen.playback_enabled && (
            <IconButton xs={3} onClick={() => onVolumeClickCallback(screen)}>
              {Number(screen.playback_volume) === 0 ? (
                <VolumeOffIcon />
              ) : (
                <VolumeUpIcon sx={{ color: "primary.main" }} />
              )}
            </IconButton>
          )}
        </CardActions>
      </Card>
      {/* position schedule chip at top left of card media */}
      <Typography
        variant="h3"
        component="div"
        style={{ position: "absolute", left: 10, top: 10 }}
      >
        {screen.next_scheduled_change && screen.next_media_id ? (
          <ScreenInfoChip
            icon={<ConnectedTvIcon />}
            label={`Next: ${
              allMedia[`media.${screen.next_media_id}`]?.short_name
            } at ${formatTimestamp(screen.next_scheduled_change)}
                   `}
          />
        ) : (
          <ScreenInfoChip
            icon={<DesktopAccessDisabledIcon />}
            label="Screen is not scheduled"
          />
        )}
      </Typography>
    </Grid>
  );
};

const InactiveScreen = ({ screen }) => {
  return (
    <Grid item xs={10} sm={9} md={8} lg={7} xl={6} key={`screen_${screen.id}`}>
      <Card component={Item}>
        <CardMedia
          component="img"
          alt=""
          height="170"
          image={`https://static.jaminproductions.com/${
            IS_PROD ? "prod" : "dev"
          }/media_control/images/screen_offline_lg.png`}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {screen.name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

// TODO: sorting to put inactive at bottom always
const AdminScreensView = ({
  screens,
  media,
  openChoseMediaDialog,
  openVolumeControlDialog,
}) => {
  return Object.keys(screens).length > 0 ? (
    <>
      {Array.from(Object.values(screens)).map((screen, idx) => {
        return screen.current_media_id ? (
          <ActiveScreen
            screen={screen}
            allMedia={media}
            onUpdateClickCallback={openChoseMediaDialog}
            onVolumeClickCallback={openVolumeControlDialog}
            key={screen.id}
          ></ActiveScreen>
        ) : (
          <InactiveScreen screen={screen} key={screen.id}></InactiveScreen>
        );
      })}
    </>
  ) : (
    <Typography
      variant="body1"
      component="div"
      sx={{ color: "secondary.main", fontStyle: "italic" }}
    >
      There are no screens for this event.
    </Typography>
  );
};
export default AdminScreensView;
