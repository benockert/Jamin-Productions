const unmute = async (eventId, screenId) => {
  const response = await fetch(
    `https://api.event-media-control.com/v1/playback/${eventId}/screens/${screenId}/unmute`,
    {
      method: "PUT",
    }
  );

  console.log("Unmute status:", response.status);
};

setTimeout(() => {
  const eventId = window.location.pathname.split("/")[3];
  const screenId = window.location.pathname.split("/")[4];

  if (eventId && screenId) {
    unmute(eventId, screenId);
  }
}, 200);
