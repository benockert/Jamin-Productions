setTimeout(() => {
  const eventId = window.location.pathname.split("/")[3];
  const screenId = window.location.pathname.split("/")[4];
  const mediaId = window.location.pathname.split("/")[5];

  const socket = new WebSocket(
    "wss://7u2mqu2n2i.execute-api.us-east-1.amazonaws.com/dev"
  );

  // Connection opened
  socket.onopen = (event) => {
    // subscribe to a channel to listen for changes to media source, etc.
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
}, 1000);
