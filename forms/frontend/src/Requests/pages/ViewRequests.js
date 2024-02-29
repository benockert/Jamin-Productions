import React, { useEffect } from "react";
import { useLoaderData, redirect } from "react-router-dom";
import { getData } from "../../api";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import PersonIcon from "@mui/icons-material/Person";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { ThemeProvider } from "@mui/material/styles";
import { requestsFormTheme } from "../themes";

import "./ViewRequests.css";

const noRequestsMessage = "No requests yet!";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export async function viewRequestsPageLoader({ params, request }) {
  const eventId = params.eventId;
  const { data: eventInfo, statusCode } = await getData(`events/${eventId}`);
  const { data: eventRequests } = await getData(`requests/${eventId}`);

  if (statusCode === 404) {
    return redirect("/");
  } else {
    return { eventInfo, eventRequests };
  }
}

const NoRequests = () => {
  return <Item>{noRequestsMessage}</Item>;
};

const ViewRequests = () => {
  const { eventInfo, eventRequests } = useLoaderData();

  useEffect(() => {
    document.title = `View Requests - ${eventInfo.name}`;
  }, [eventInfo]);

  return (
    <ThemeProvider theme={requestsFormTheme}>
      <div className="container">
        <Header title={eventInfo.name} subtitle={eventInfo.date}></Header>
        <Box
          sx={{
            "& .MuiChip-outlined": {
              border: "none",
              fontSize: "1rem",
            },
          }}
          className="requests-view"
        >
          <Stack spacing={2}>
            {eventRequests?.length ? (
              eventRequests.map((request, idx) => {
                return (
                  <Item key={idx}>
                    <Stack
                      justifyContent="center"
                      alignItems="center"
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                    >
                      <Chip
                        icon={<MusicNoteIcon />}
                        label={request.song_title}
                        variant="outlined"
                      />
                      <Chip
                        icon={<PersonIcon />}
                        label={request.artist_name}
                        variant="outlined"
                      />
                    </Stack>
                  </Item>
                );
              })
            ) : (
              <NoRequests />
            )}
          </Stack>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default ViewRequests;
