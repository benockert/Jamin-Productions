import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  get_event,
  get_screens,
  get_media,
  update_screen_media,
  set_playback_volume,
  SOCKET_HOST,
} from "../api/api.js";
import DashboardLayout from "../components/DashboardLayout.js";
import AdminScreensView from "../views/AdminScreensView.js";
import {
  ChooseMediaPopupDialog,
  VolumeSliderPopup,
} from "../components/MediaControlPopups.js";
import Loading from "../components/Loading.js";

function Admin() {
  const [event, setEvent] = useState();
  const [screens, setScreens] = useState();
  const [media, setMedia] = useState();
  const [error, setError] = useState();
  const [openChooseMediaDialog, setOpenChooseMediaDialog] = useState(false);
  const [openVolumeControlDialog, setOpenVolumeControlDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [socket, setSocket] = useState(new WebSocket(SOCKET_HOST));
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  const toggleError = () => {
    setError();
  };

  // get data
  useEffect(() => {
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
    if (screens && media && event) {
      setIsLoaded(true);
    }
  }, [screens, media, event]);

  const handleMessage = useCallback(
    (message) => {
      console.log({ message });
      switch (message.action) {
        case "screen_change":
          const screenId = message.screenId;
          const newScreenState = message.newState;
          // update our screens in state
          setScreens({ ...screens, [screenId]: newScreenState });
          // if the updated screen is also the currenly open media dialog, update that
          if (openVolumeControlDialog.key === screenId) {
            setOpenVolumeControlDialog(newScreenState);
          }
          break;
        default:
          console.log("No action to take for:", message.action);
      }
    },
    [screens, openVolumeControlDialog]
  );

  useEffect(() => {
    if (isLoaded && socket) {
      if (socket.readyState < 2) {
        if (socket.readyState === 0) {
          // socket still opening connection, need to wait to subscribe until open
          socket.onopen = () => {
            // subscribe to admin channel events
            socket.send(
              JSON.stringify({
                action: "subscribe",
                channel: "admin",
                event_id: event.id,
              })
            );
          };
        } else {
          // socket already open by now, subscribe to admin channel events
          socket.send(
            JSON.stringify({
              action: "subscribe",
              channel: "admin",
              event_id: event.id,
            })
          );
        }

        // restart the connection on disconnect
        const onDisconnect = () => {
          console.log("Socket disconnected, reopening");
          setSocket(new WebSocket(SOCKET_HOST));
        };

        // handle incoming mesages
        const onMessage = (message) => {
          const messageJson = JSON.parse(message.data);
          handleMessage(messageJson);
        };

        // handle error displays
        const onError = (e) => {
          setError(e);
        };

        socket.onclose = onDisconnect;
        socket.onmessage = onMessage;
        socket.onerror = onError;
      } else {
        // socket is not ready, prompt for refresh
        setError("Connection error, please refresh the page.");
      }
    }
  }, [isLoaded, socket, handleMessage]);
  // remove handleMessage from dependencies if socket start reconnecting

  const onScreenNameDialogSubmit = (event, screenId, selectedMediaId) => {
    event.preventDefault();
    update_screen_media(token.current, screenId, selectedMediaId).then(
      (response) => {
        console.log("Update media response:", { response });
      }
    );

    // close the dialog
    setOpenChooseMediaDialog(false);
  };

  const onScreenNameDialogCancel = (event) => {
    setOpenChooseMediaDialog(false);
  };

  // returns whether the operation was successful or not
  const onVolumeChangeCommitted = (newVolume) => {
    return set_playback_volume(
      token.current,
      openVolumeControlDialog.event_id,
      openVolumeControlDialog.id,
      newVolume
    ).then(
      (resp) => {
        if (resp.status !== 200) {
          if (resp.status === 404) {
            setError("An error ocurred updating the volume: NO_ACTIVE_DEVICE");
          } else {
            setError("An error ocurred updating the volume:");
          }
          return false;
        } else {
          return true;
        }
      },
      (err) => {
        console.error(err);
        setError("An error ocurred updating the volume.");
        return false;
      }
    );
  };

  const onSetVolumeDialogClose = () => {
    setOpenVolumeControlDialog(false);
  };

  if (isLoaded) {
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
          openVolumeControlDialog={setOpenVolumeControlDialog}
        ></AdminScreensView>
        {!!openChooseMediaDialog && (
          <ChooseMediaPopupDialog
            screen={openChooseMediaDialog}
            media={media}
            handleClose={onScreenNameDialogCancel}
            handleSubmit={onScreenNameDialogSubmit}
          ></ChooseMediaPopupDialog>
        )}
        {!!openVolumeControlDialog && (
          <VolumeSliderPopup
            screen={openVolumeControlDialog}
            handleClose={onSetVolumeDialogClose}
            handleSubmit={onVolumeChangeCommitted}
          ></VolumeSliderPopup>
        )}
      </DashboardLayout>
    );
  } else {
    return <Loading></Loading>;
  }
}

export default Admin;
