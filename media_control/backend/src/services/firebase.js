import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, remove } from "firebase/database";

export default class FirebaseRtdb {
  constructor() {
    const config = {
      apiKey: "AIzaSyDFNQjVGy7vxOSYHQlyFgKGFODv9U4S9no",
      authDomain: "event-media-control.firebaseapp.com",
      projectId: "event-media-control",
      storageBucket: "event-media-control.appspot.com",
      messagingSenderId: "6815290049",
      appId: "1:6815290049:web:c3702c99f89b2b86403a40",
      measurementId: "G-5YV2RQERDM",
      databaseURL: "https://event-media-control-default-rtdb.firebaseio.com/",
    };

    console.log("Attempting to connect to Firebase realtime database");
    this.firebase = initializeApp(config);
    this.rtdb = getDatabase(this.firebase);
    console.log("Successfully connected to Firebase realtime database");
  }

  set(k, v) {
    return new Promise((resolve, reject) => {
      set(ref(this.rtdb, k), v)
        .then(() => {
          resolve("success");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(k) {
    return new Promise((resolve, reject) => {
      get(ref(this.rtdb, k))
        .then((v) => {
          resolve(v.val());
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  delete(k) {
    return new Promise((resolve, reject) => {
      remove(ref(this.rtdb, k))
        .then(() => {
          resolve("success");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updatePlaybackVolume(eventId, volume) {
    const path = `/${eventId}/playback`;
    return this.set(path, { volume: volume });
  }

  getCurrentPlaybackVolume(eventId) {
    const path = `/${eventId}/playback`;
    return this.get(path);
  }

  getCurrentMediaByScreenName(eventId, screenUrl) {
    const path = `/${eventId}/screens/${screenUrl}`;
    return this.get(path);
  }

  getScreensByEventId(eventId) {
    const path = `/${eventId}/screens`;
    return this.get(path);
  }

  updateScreenSource(eventId, screenUrl, screenName, mediaUrl) {
    const path = `/${eventId}/screens/${screenUrl}`;
    return this.set(path, { name: screenName, cur_media_url: mediaUrl });
  }

  addScreenSocket(eventId, socketId, mediaUrl) {
    const path = `/sockets/${socketId}`;
    return this.set(path, { event_id: eventId, media_url: mediaUrl });
  }

  getSocket(socketId) {
    const path = `/sockets/${socketId}`;
    return this.get(path);
  }

  deleteScreen(eventId, mediaUrl) {
    const path = `/${eventId}/screens/${mediaUrl}`;
    return this.delete(path);
  }

  deleteSocket(socketId) {
    const path = `/sockets/${socketId}`;
    return this.delete(path);
  }
}
