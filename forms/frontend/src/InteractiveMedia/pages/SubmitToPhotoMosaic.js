import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../themes";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import FloatingImages from "../components/FloatingImages";
import PhotoMosaicForm from "../components/PhotoMosaicForm";
import { getData } from "../../api";
import { useLoaderData, useParams, redirect } from "react-router-dom";

export async function submitToPhotoMosaicPageLoader({ params, request }) {
  const eventId = params.eventId;
  return await getData(`events/${eventId}?type=photomosaic`).then((res) => {
    if (res.statusCode === 404) {
      return redirect("/");
    } else {
      return res.data ?? {};
    }
  });
}

const SubmitToPhotoMosaic = () => {
  const { eventId } = useParams();
  const eventInfo = useLoaderData();

  useEffect(() => {
    document.title = `Photo Mosaic Submission - ${eventInfo.name}`;
  }, [eventInfo]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundImage: {
            xs: `url(${eventInfo.background_portrait})`,
            md: `url(${eventInfo.background_landscape})`,
          },
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: {
            xs: "top",
            md: "center",
          },
          backgroundColor: eventInfo.brand_color ?? "#171717",
        }}
      >
        <CssBaseline />
        <FloatingImages eventInfo={eventInfo} />
        <PhotoMosaicForm
          eventId={eventId}
          formTitle={eventInfo.form_title}
          maxMessageLength={eventInfo.message_length_max}
          style={{ minWidth: "40vw", maxHeight: "70vh" }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default SubmitToPhotoMosaic;