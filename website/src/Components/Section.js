import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const Section = (props) => {
  return (
    <Box
      id={props.id}
      component="section"
      sx={(theme) => ({
        width: "100%",
        height: props.height ?? "auto",
        // backgroundImage: "none",
        // backgroundSize: "100% 20%",
        // backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          pt: { xs: 12, sm: 18 },
          pb: { xs: 8, sm: 18 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 3, sm: 6 },
        }}
        maxWidth="xl"
      >
        {props.children}
      </Container>
    </Box>
  );
};

export default Section;
