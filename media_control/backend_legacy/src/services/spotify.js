import request from "request";

export default class SpotifyAPI {
  constructor(mysql, rtdb) {
    this.config = {
      clientId: "aee98b24338243efbd04724b3d390c55",
      clientSecret: "e5f55a9e51f54aefb5de9e719773bacb",
    };

    this.mysql = mysql;
    this.rtdb = rtdb;
  }

  refreshAccessCode(refresh_token) {
    console.log("Spotify access token expired, refreshing");
    const req = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(
            this.config.clientId + ":" + this.config.clientSecret
          ).toString("base64"),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      json: true,
    };
    return new Promise((resolve, reject) => {
      request.post(req, (error, response, body) => {
        return error ? reject(error) : resolve(body);
      });
    });
  }

  getAccessCode(eventId) {
    return this.mysql.getSpotifyAccessCode(eventId).then((resp) => {
      if (resp) {
        const expiresTimestamp = resp[0].expires;
        if (expiresTimestamp < Date.now()) {
          return this.refreshAccessCode(resp[0].refresh_token, eventId).then(
            (body) => {
              this.mysql.setAccessCode(
                body.access_token,
                body.refresh_token ? body.refresh_token : resp[0].refresh_token,
                eventId,
                body.expires_in
              );
              return body.access_token;
            }
          );
        } else {
          return resp[0].access_code;
        }
      }
    });
  }

  pause(eventId) {
    return this.getAccessCode(eventId).then(
      (accessCode) => {
        return new Promise((resolve, reject) => {
          const req = {
            url: "https://api.spotify.com/v1/me/player/pause",
            headers: {
              Authorization: "Bearer " + accessCode,
            },
            json: true,
          };
          request.put(req, (error, response, body) => {
            return error ? reject(error) : resolve(response);
          });
        });
      },
      (err) => {
        console.log("Error pausing", err);
      }
    );
  }

  play(eventId) {
    return this.getAccessCode(eventId).then(
      (accessCode) => {
        return new Promise((resolve, reject) => {
          const req = {
            url: "https://api.spotify.com/v1/me/player/play",
            headers: {
              Authorization: "Bearer " + accessCode,
            },
            json: true,
          };
          request.put(req, (error, response, body) => {
            return error ? reject(error) : resolve(response);
          });
        });
      },
      (err) => {
        console.log("Error playing", err);
      }
    );
  }

  updateVolume(eventId, volume) {
    return this.getAccessCode(eventId).then(
      (accessCode) => {
        return new Promise((resolve, reject) => {
          const req = {
            url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,
            headers: {
              Authorization: "Bearer " + accessCode,
            },
            json: true,
          };
          request.put(req, (error, response, body) => {
            return error ? reject(error) : resolve(response);
          });
        });
      },
      (err) => {
        console.log("Error setting volume", err);
      }
    );
  }
}
