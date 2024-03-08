import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import { useParams, redirect } from "react-router-dom";
import { Form } from "../components/Form";
import Header from "../components/Header";
import { postData, getData } from "../../api";
import Chip from "@mui/material/Chip";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import Box from "@mui/material/Box";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ThemeProvider } from "@mui/material/styles";
import { requestsFormTheme } from "../themes";

import "./RequestASong.css";

// Note: I don't love each loader having to implement this logic,
// but at least it allows each page to decide what to do if the
// url is invalid
export async function requestASongPageLoader({ params, request }) {
  const eventId = params.eventId;
  return await getData(`events/${eventId}`).then((res) => {
    if (res.statusCode === 404) {
      return redirect("/");
    } else {
      return res.data ?? {};
    }
  });
}

const localStorageAccessDenied =
  "Unable to access local storage to retrieve request count.";
const requestLimitReachedMessage =
  "Your request limit has been reached. Thank you!";

function RequestASong() {
  const { eventId } = useParams();
  const eventInfo = useLoaderData();
  const limitEnforced = !!eventInfo.requestLimit;
  const [formMessage, setFormMessage] = useState({});
  const [formDisabled, setFormDisabled] = useState(true);
  const [requestCount, setRequestCount] = useState(() => {
    // load request count from local storage
    let count = 0;
    try {
      count =
        parseInt(
          localStorage.getItem(
            `jamin-productions-requests-form-${eventId.toLowerCase()}-count`
          )
        ) || 0;
    } catch (error) {
      console.error(localStorageAccessDenied);
    }

    // compare to limit
    if (limitEnforced && count >= eventInfo.requestLimit) {
      setFormDisabled(true);
      setFormMessage({ message: requestLimitReachedMessage });
    } else {
      // if under limit, enable the form
      setFormDisabled(false);
    }

    return count;
  });

  useEffect(() => {
    document.title = `Request A Song - ${eventInfo.name}`;
  }, [eventInfo]);

  const RequestsRemainingText = (count) => {
    if (limitEnforced) {
      const requestsRemaining = eventInfo.requestLimit - count;
      return ` You have ${requestsRemaining} song request${
        requestsRemaining - 1 ? "s" : ""
      } remaining.`;
    } else {
      return "";
    }
  };

  const SubmitForm = (values) => {
    setFormMessage({});

    const {
      song: songTitle,
      artist: artistName,
      name: requestorName,
      notes: requestNotes,
    } = values;
    postData(`requests/${eventId}`, {
      songTitle,
      artistName,
      requestorName,
      requestNotes,
    }).then((data) => {
      let message = data;
      if (data.result === "success") {
        // upload to spotify playlist (don't await)
        try {
          postData(`spotify/${eventId}/add_to_playlist`, {
            songTitle,
            artistName,
          });
        } catch (error) {
          console.log({ error });
        }

        // display submission message and determine remaining request count
        const count = requestCount + 1;
        setRequestCount(count);
        try {
          localStorage.setItem(
            `jamin-productions-requests-form-${eventId.toLowerCase()}-count`,
            count
          );
        } catch (error) {
          console.error(localStorageAccessDenied);
        }

        // disable the form if we have reached our limit
        if (limitEnforced && count >= eventInfo.requestLimit) {
          setFormDisabled(true);
          message = {
            ...message,
            message: `${message.message} ${requestLimitReachedMessage}`,
          };
        } else {
          message = {
            ...message,
            message: `${message.message}${RequestsRemainingText(count)}`,
          };
        }
      }

      setFormMessage(message);
    });
  };

  return (
    <ThemeProvider theme={requestsFormTheme}>
      <div className="container">
        <Header title={eventInfo.name} subtitle={eventInfo.date}></Header>
        <Box className="requests-view">
          <Form
            handleSubmit={SubmitForm}
            clearMessages={() => setFormMessage({})}
            formDisabled={formDisabled}
          >
            {formMessage.message && (
              <Box
                className="form-message"
                sx={{
                  "& .MuiChip-outlined": {
                    border: "none",
                  },
                }}
              >
                {formMessage.result === "success" ? (
                  <Chip
                    icon={<PlaylistAddCheckIcon />}
                    label={formMessage.message}
                    color="success"
                    variant="outlined"
                    sx={{
                      "& MuiChip-outlined": {
                        border: "none",
                      },
                    }}
                  />
                ) : formMessage.result === "error" ? (
                  <Chip
                    icon={<ErrorOutlineIcon />}
                    label={formMessage.message}
                    color="error"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    icon={<PlaylistRemoveIcon />}
                    label={formMessage.message}
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </Form>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default RequestASong;
