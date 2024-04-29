import React, { useEffect, useState, useRef } from "react";
import { get_event, get_screens, get_media } from "../api/api.js";
import { API_HOST } from "../api/api.js";
import DashboardLayout from "../components/DashboardLayout";
import SelectScreensView from "../views/SelectScreensView";
import Loading from "../components/Loading";

function Dashboard() {
  const [event, setEvent] = useState();
  const [screens, setScreens] = useState();
  const [media, setMedia] = useState();
  const [error, setError] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const token = useRef(sessionStorage.getItem("source_control_jwt"));

  useEffect(() => {
    get_event(token.current).then((response) => {
      setEvent(response);
    });

    get_screens(token.current).then((response) => {
      setScreens(response.screens);
    });

    get_media(token.current).then((response) => {
      const mediaMap = {};
      Array.from(response.media).forEach((element) => {
        mediaMap[element.key] = element;
      });
      setMedia(mediaMap);
    });
  }, []);

  const toggleError = () => {
    setError();
  };

  useEffect(() => {
    if (screens && event && media) {
      setIsLoaded(true);
    }
  }, [screens, event, media]);

  const redirectToMediaPage = (event_id, screen_id, media_id) => {
    window.location.href = `${API_HOST}/v1/html/${event_id}/${screen_id}/${media_id}`;
  };

  if (isLoaded) {
    return (
      <DashboardLayout
        title="Screen Selection"
        event={event}
        error={error}
        toggleError={toggleError}
      >
        <SelectScreensView
          screens={screens}
          media={media}
          redirectPageCallback={redirectToMediaPage}
        ></SelectScreensView>
      </DashboardLayout>
    );
  } else {
    return <Loading></Loading>;
  }
}

export default Dashboard;
