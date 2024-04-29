const mute = async (eventId, screenId) => {
  const response = await fetch(
    `https://api.event-media-control.com/v1/playback/${eventId}/screens/${screenId}/mute`,
    {
      method: "PUT",
    }
  );

  console.log("Mute status:", response.status);
};

setTimeout(() => {
  const eventId = window.location.pathname.split("/")[3];
  const screenId = window.location.pathname.split("/")[4];

  if (eventId && screenId) {
    mute(eventId, screenId);
  }
}, 200);
