const setupSocket = (eventId, screenId, mediaId) => {
  let socket = new WebSocket("wss://ws.event-media-control.com");

  // Connection opened
  socket.onopen = () => {
    console.log(
      "Socket connected, subscribing to channel for screen updates and sending load message"
    );
    //subscribe to a channel to listen for changes to media source, etc.
    socket.send(
      JSON.stringify({
        action: "subscribe",
        channel: `screen.${screenId}`,
        event_id: eventId,
      })
    );

    // report the media that has been loaded
    socket.send(
      JSON.stringify({
        action: "emit",
        topic: "screen_loaded",
        screen_id: `screen.${screenId}`,
        event_id: eventId,
        media_id: mediaId,
      })
    );
  };

  // Listen for messages
  socket.onmessage = (event) => {
    const { action, new_source: mediaId } = JSON.parse(event.data);

    switch (action) {
      case "update_source":
        // redirect (replace so overrite history so back button always goes back to dashboard)
        window.location.replace(`/v1/html/${eventId}/${screenId}/${mediaId} `);
        break;
      default:
        console.log("No action to take for socket message:", action);
    }
  };

  // handle closed connections
  socket.onclose = (event) => {
    console.log("Socket closed, reopening...");
    setupSocket(eventId, screenId, mediaId);
  };
};

setTimeout(() => {
  const eventId = window.location.pathname.split("/")[3];
  const screenId = window.location.pathname.split("/")[4];
  const mediaId = window.location.pathname.split("/")[5];

  if (eventId && screenId && mediaId) {
    setupSocket(eventId, screenId, mediaId);
  }
}, 200);
