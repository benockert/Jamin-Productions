import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "../Components/NavBar";
import About from "../Sections/About";
import Landing from "../Sections/Landing";
import Gallery from "../Sections/Gallery";
import Services from "../Sections/Services";
import Testimonials from "../Sections/Testimonials";

import "./Main.css";

const Main = () => {
  const [mode, setColorMode] = useState("dark");
  const defaultTheme = createTheme({
    palette: { mode },
    typography: {
      // for headings and nav bar
      h6: {
        fontFamily: ["Resplendent", "sans-serif"].join(","),
        fontSize: 18,
      },
      h2: {
        fontFamily: ["Frest Style", "sans-serif"].join(","),
        fontSize: 40,
      },
      // for main body
      body1: {
        fontFamily: ["Red Hat Text", "sans-serif"].join(","),
        fontSize: 18,
        lineHeight: 1.7,
        textAlign: "left",
        padding: 5,
        fontWeight: 500,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 1000,
        lg: 1250,
        xl: 1650,
      },
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div className="topGradient"></div>
      <NavBar mode={mode} />
      <Landing />
      <Box sx={{ bgcolor: "background.default" }}>
        <About />
        <Services />
        <Testimonials />
        <Gallery />
      </Box>
      <div className="bottomGradient"></div>
    </ThemeProvider>
  );
};

export default Main;
