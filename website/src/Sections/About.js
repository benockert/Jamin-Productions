import React from "react";
import Container from "@mui/material/Container";

import "./About.css";

const About = () => {
  return (
    <Container
      id="about"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <div className="video-container">
        <iframe
          className="video-iframe"
          src="https://player.vimeo.com/video/468265565?h=66b7c99fec&title=0&byline=0&portrait=0&pip=0"
        ></iframe>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
    </Container>
  );
};

export default About;
