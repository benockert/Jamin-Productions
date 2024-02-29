import jwt from "jsonwebtoken";
import { ref, onValue } from "firebase/database";
import { config } from "../config/config.js";
const { verify } = jwt;

const validateAndExtractEventIdFromToken = (token) => {
  const decodedToken = verify(token, config.jwtSecret, {
    maxAge: 3600 * 12,
  });
  return decodedToken.eventId;
};

export const setupSocket = (io, firebase, mysql, spotify) => {
  io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id);

    socket.on("screen_connected", (data) => {
      // todo sanitize with undefined
      firebase.updateScreenSource(
        data.eventId,
        data.screenUrl,
        data.screenName,
        data.mediaUrl
      );
      firebase.addScreenSocket(data.eventId, socket.id, data.screenUrl);
      socket.join(data.screenUrl);
    });

    socket.on("mute_spotify", (data) => {
      mysql
        .checkPlaybackEnabled(data.eventId, data.screenUrl)
        .then((enabled) => {
          console.log("Playback", enabled);
          if (enabled.length) {
            console.log("Muting", data.screenUrl);
            spotify.updateVolume(data.eventId, 0);
            // firebase.updatePlaybackVolume(data.eventId, 0);
          }
        });
    });

    socket.on("unmute_spotify", (data) => {
      mysql
        .checkPlaybackEnabled(data.eventId, data.screenUrl)
        .then((enabled) => {
          console.log("Playback", enabled);
          if (enabled.length) {
            console.log("Unmuting", data.screenUrl);
            spotify.updateVolume(
              data.eventId,
              firebase.getCurrentPlaybackVolume(data.eventId)
            );
            //firebase.updatePlaybackVolume(data.eventId, 50);
          }
        });
    });

    socket.on("admin_connected", (data) => {
      console.log("ADMIN login");
      const eventId = validateAndExtractEventIdFromToken(data.token);
      if (eventId) {
        onValue(ref(firebase.rtdb, `${eventId}/screens`), (snapshot) => {
          const newValues = snapshot.val();
          mysql.getNextScreenSchedules(eventId).then((schedules) => {
            const screenScheduleObj = schedules.reduce(
              (obj, cur) => ({
                ...obj,
                [cur.url_name]: {
                  target_media_name: cur.short_name,
                  time: cur.time,
                },
              }),
              {}
            );
            socket.emit("screen_updates", {
              screenMedia: newValues,
              screenSchedule: screenScheduleObj,
            });
          });
        });

        onValue(ref(firebase.rtdb, `${eventId}/playback`), (snapshot) => {
          socket.emit("playback_updates", {
            volume: snapshot?.val()?.volume ? snapshot.val().volume : 0,
          });
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, reason);
      firebase.getSocket(socket.id).then((socketInfo) => {
        if (socketInfo) {
          firebase.deleteSocket(socket.id).then((resp) => {
            if (resp == "success") {
              firebase.deleteScreen(socketInfo.event_id, socketInfo.media_url);
            }
          });
        }
      });
    });
  });
};
