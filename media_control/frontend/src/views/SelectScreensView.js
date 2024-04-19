import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { styled } from "@mui/system";

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

function SelectScreensView({ data: screens, redirectPageCallback }) {
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

export default SelectScreensView;
