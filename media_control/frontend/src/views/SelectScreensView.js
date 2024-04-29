import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PreviewIcon from "@mui/icons-material/Preview";
import { ScreenInfoChip } from "../theme/custom";
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
    backgroundColor: theme.palette.background.grey,
  },
}));

// todo update to const
const SelectScreensView = ({ screens, media, redirectPageCallback }) => {
  if (Object.keys(screens).length > 0) {
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
              sx={{ position: "relative" }}
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
                    component="img"
                    alt=""
                    height="170"
                    image={screen.image_url}
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
              {/* display current media info at top left of card */}
              <Typography
                variant="h3"
                component="div"
                style={{ position: "absolute", left: 10, top: 10 }}
              >
                {screen.current_media_id ? (
                  <ScreenInfoChip
                    icon={<PreviewIcon />}
                    label={`Current: ${
                      media[`media.${screen.current_media_id}`]?.short_name
                    }
                   `}
                  />
                ) : screen.default_media_id ? (
                  <ScreenInfoChip
                    icon={<PreviewIcon />}
                    label={`Current: ${
                      media[`media.${screen.default_media_id}`]?.short_name
                    }
                   `}
                  />
                ) : (
                  <></>
                )}
              </Typography>
            </Grid>
          );
        })}
      </>
    );
  } else {
    return (
      <Typography
        variant="body1"
        component="div"
        sx={{ color: "secondary.main", fontStyle: "italic" }}
      >
        There are no screens for this event.
      </Typography>
    );
  }
};

export default SelectScreensView;
