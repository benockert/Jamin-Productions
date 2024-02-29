import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { northeastern2024 } from "../themes";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import FloatingImages from "../components/FloatingImages";
import PhotoMosaicForm from "../components/PhotoMosaicForm";

const Northeastern2024PhotoWallForm = () => {
  // const { eventId } = useParams(); // todo: create loader for url => event name conversion
  const eventId = "northeastern2024";

  const portraitBackground = "2024-N-CommencementBranding-v5_Page_1.png";
  const landscapeBackground = "2024-N-CommencementBranding-v5_Page_3.png";

  useEffect(() => {
    document.title = `Photo Mosaic`; // - ${eventInfo.name}`;
  });
  // }, [eventInfo]);

  console.log({ eventId });

  return (
    <ThemeProvider theme={northeastern2024}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundImage: {
            xs: `url(/images/photos/${landscapeBackground})`, //`url(/images/photos/${portraitBackground})`,
            md: `url(/images/photos/${landscapeBackground})`,
          },
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: {
            xs: "top",
            md: "center",
          },
        }}
      >
        <CssBaseline />
        <FloatingImages />
        <PhotoMosaicForm
          eventId={eventId}
          style={{ minWidth: "40vw", maxHeight: "70vh" }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Northeastern2024PhotoWallForm;
