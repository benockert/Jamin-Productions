import React, { useEffect, useState, useRef } from "react";
import {
  get_event,
  get_screens,
  get_media,
  update_screen_media,
} from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { SOCKET_HOST } from "../api/api.js";
import DashboardLayout from "../components/DashboardLayout";
import AdminScreensView from "../views/AdminScreensView";
import ChooseMediaPopupDialog from "../components/SelectMedia.js";

function NewAdmin() {
  let navigate = useNavigate();
  const [event, setEvent] = useState();
  const [screens, setScreens] = useState();
  const [media, setMedia] = useState();
  const [error, setError] = useState();
  const [openChooseMediaDialog, setOpenChooseMediaDialog] = useState(false);
  const [socket, setSocket] = useState(new WebSocket(SOCKET_HOST));
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  const toggleError = () => {
    setError();
  };

  // get data
  useEffect(() => {
    console.log("Should only happen once");
    get_event(token.current).then((response) => {
      setEvent(response);
    });

    get_screens(token.current).then((response) => {
      // screens should be {screenId: {screenData}, ...}
      const screensMap = {};
      Array.from(response.screens).forEach((element) => {
        screensMap[element.key] = element;
      });
      setScreens(screensMap);
    });

    get_media(token.current).then((response) => {
      const mediaMap = {};
      Array.from(response.media).forEach((element) => {
        mediaMap[element.key] = element;
      });
      setMedia(mediaMap);
    });
  }, []);

  useEffect(() => {
    console.log(screens, media);
  }, [screens, media]);

  // open socket for realtime updates
  useEffect(() => {
    socket.onopen = (e) => {
      console.log("WebSocket connection opened");
      socket.send(
        JSON.stringify({
          action: "subscribe",
          channel: "admin",
          event_id: "northeastern2024",
        })
      );
    };

    socket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log("WebSocket message received:", message.action);

      // update our screens with the new screen state received
      const screenId = message.screenId;
      const newScreenState = message.newState;
      // console.log("OLD:", screens);
      // console.log("NEW:", { [screenId]: newScreenState, ...screens });
      setScreens({ [screenId]: newScreenState, ...screens });
    };

    socket.onerror = (e) => {
      console.log("WebSocket error:", e);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, "| Reopening...");
      setSocket(new WebSocket(SOCKET_HOST));
    };
  }, [socket]);

  const onScreenNameDialogSubmit = (event, screenId, selectedMediaId) => {
    event.preventDefault();
    console.log({ event, screenId, selectedMediaId });
    update_screen_media(token.current, screenId, selectedMediaId).then(
      (response) => {
        console.log(response);
      }
    );
  };

  const onScreenNameDialogCancel = (event) => {
    event.preventDefault();
    setOpenChooseMediaDialog(false);
  };

  if (event) {
    return (
      <DashboardLayout
        title="Admin Console"
        event={event}
        error={error}
        toggleError={toggleError}
      >
        <AdminScreensView
          screens={screens}
          media={media}
          openChoseMediaDialog={setOpenChooseMediaDialog}
        ></AdminScreensView>
        {!!openChooseMediaDialog && (
          <ChooseMediaPopupDialog
            screen={openChooseMediaDialog}
            media={media}
            handleClose={onScreenNameDialogCancel}
            handleSubmit={onScreenNameDialogSubmit}
          ></ChooseMediaPopupDialog>
        )}
      </DashboardLayout>
    );
  } else {
    return <></>;
  }
}

export default NewAdmin;
