import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Section from "../Components/Section";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/material/styles";

import "./About.css";

const ContentContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "100%",
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: "center",
  zIndex: 1,
  borderRadius: 20,
  bgcolor: "transparent",
}));

const About = () => {
  return (
    <Section id="about">
      {/* <ContentContainer elevation={3}> */}
      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={8} sx={{ textAlign: "center" }}>
          <Typography variant="h2" gutterBottom>
            About 'Jamin Productions
          </Typography>
        </Grid>
        <Grid item xs={12} md={2}></Grid>
        <Grid item xs={12} md={6}>
          <div className="video-container">
            <iframe
              className="video-iframe"
              src="https://player.vimeo.com/video/468265565?h=66b7c99fec&title=0&byline=0&portrait=0&pip=0"
            ></iframe>
          </div>
          <div
            style={{
              fontSize: "16px",
              fontStyle: "italic",
              textAlign: "right",
            }}
          >
            Recorded 2020
          </div>
          <script src="https://player.vimeo.com/api/player.js"></script>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" gutterBottom>
            Ben has been DJing since he was 14 years old. With more than 150
            events under his belt, Ben knows his way around a mixer, microphone,
            and music library. From the Rock ‘n’ Roll records of the 60s to the
            R&B charts of the 90s and the pop hits of today, you can be
            confident that Ben knows what works and what doesn’t when it comes
            to curating a playlist for your special day.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ben’s understanding and appreciation of music comes from 18 years of
            playing piano, 10 years of trumpet, 6 years of drumming, and 5 years
            of singing. His performing has taken him around the country and
            world, most notably to London, San Francisco, and The White House,
            making him comfortable and confident in front of a crowd and behind
            the decks.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ben prides himself in being able to skillfully read the dance floor
            and choose the perfect variety of songs to keep the energy going all
            night! He constantly adapts his playlists to match the vibe of the
            crowd and mixes the tunes together without missing a beat. He also
            loves taking requests (if allowed by the client, of course)!
          </Typography>
        </Grid>
      </Grid>
      {/* </ContentContainer> */}
    </Section>
  );
};

export default About;
