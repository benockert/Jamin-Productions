import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const Item = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  marginBottom: 50,
  height: "auto",
}));

const ActiveScreen = ({ screen, allMedia, onClickCallback }) => {
  return (
    <Grid item xs={10} sm={9} md={8} lg={7} xl={6} key={`screen_${screen.id}`}>
      <Card component={Item}>
        <CardMedia
          className="screen-image"
          component="img"
          image={allMedia[`media.${screen.current_media_id}`]?.image_url ?? ""}
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {screen.name}
          </Typography>
          {/* <Typography variant="h5" component="div">
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
              </Typography> */}
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            sx={{ width: "100%" }}
            xs={9}
            sm={9}
            md={9}
            onClick={() => onClickCallback(screen)}
          >
            Update
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

const InactiveScreen = ({ screen }) => {
  return (
    <Grid item xs={10} sm={9} md={8} lg={7} xl={6} key={`screen_${screen.id}`}>
      <Card component={Item}>
        <CardMedia
          className="screen-image"
          component="img"
          image="https://static.jaminproductions.com/emc/images/screen_not_online.jpg"
          sx={{ objectFit: "contain" }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {screen.name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

// TODO: sorting to put inactive at bottom always
const AdminScreensView = ({ screens, media, openChoseMediaDialog }) => {
  return screens ? (
    <>
      {Array.from(Object.values(screens)).map((screen, idx) => {
        return screen.current_media_id ? (
          <ActiveScreen
            screen={screen}
            allMedia={media}
            onClickCallback={openChoseMediaDialog}
          ></ActiveScreen>
        ) : (
          <InactiveScreen screen={screen}></InactiveScreen>
        );
      })}
    </>
  ) : (
    <Typography gutterBottom variant="h5" component="div">
      There are no screens for this event.
    </Typography>
  );
};
export default AdminScreensView;
