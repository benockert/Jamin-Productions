import React, { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "../Components/NavBar";
import About from "../Sections/About";
import Landing from "../Sections/Landing";

import "./Home.css";

const Home = () => {
  const [mode, setColorMode] = useState("dark");
  const defaultTheme = createTheme({
    palette: { mode },
    typography: {
      fontFamily: ["Resplendent", "sans-serif"].join(","),
      fontSize: 16,
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <NavBar mode={mode} />
      <Landing />
      <Box sx={{ bgcolor: "background.default" }}>
        <About />
      </Box>
    </ThemeProvider>
  );
};

export default Home;
