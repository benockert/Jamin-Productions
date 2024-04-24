const mute = async (eventId, screenId) => {
  const response = await fetch(
    `https://olrk6aszw4.execute-api.us-east-1.amazonaws.com/v1/playback/${eventId}/screens/${screenId}/mute`,
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
