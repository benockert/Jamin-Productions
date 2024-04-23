const eventHandler = require("../Events/handler.js");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
var request = require("request");
const spotifyAuthClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-east-1" })
); // spotify auth table is only in us-east-1

module.exports.addToPlaylist = async (eventId, req, res, next) => {
  eventHandler.getEvent(eventId, "requests").then(
    (event) => {
      if (event.status === 200) {
        if (event) {
          const { playlist_id: playlistId } = event;
          if (playlistId) {
            getAccessToken(
              (...args) => addSongToPlaylist(playlistId, ...args),
              req,
              res
            );
          } else {
            res.statusCode(405).json({
              status: 405,
              message: "This event does not support playlist integration.",
            });
          }
        } else {
          res.statusCode(404).json({
            status: 404,
            message: `No active event found with id ${eventId}`,
          });
        }
      } else {
        res.status(event.status).json(event);
      }
    },
    (err) => {
      next(err);
    }
  );
};

module.exports.setVolume = async (newVolume, req, res, next) => {
  getAccessToken((...args) => setVolume(newVolume, ...args), req, res, next);
};

// ==================== HELPERS ======================

// next: the function to call once the access token is retrieved or refreshed
const getAccessToken = async (next, req, res) => {
  console.log("Getting Spotify access token");

  const params = {
    TableName: process.env.SPOTIFY_AUTH_TABLE,
    Key: {
      app_name: process.env.SPOTIFY_APP_NAME,
      flow_type: "authorization_code",
    },
  };
  const {
    Item: { access_token, expires, refresh_token },
  } = await spotifyAuthClient.send(new GetCommand(params));
  if (Date.now() > expires) {
    console.log("Token expired, requesting new access token");
    getNewAccessToken(refresh_token, next, req, res);
  } else {
    next(access_token, req, res);
  }
};

const getNewAccessToken = async (refresh, next, req, res) => {
  console.log("Refreshing access token");
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh,
    },
    json: true,
  };

  request.post(authOptions, async function (error, response, body) {
    if (!error && res.statusCode === 200) {
      let access_token = body.access_token;
      let refresh_token = body.refresh_token;
      let expires_in = body.expires_in;

      if (!refresh_token) {
        console.log("No new refresh token received, using current");
        refresh_token = refresh;
      }
      // update in dynamo
      updateAccessToken({
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: expires_in,
      });

      // call next
      next(access_token, req, res);
    } else {
      console.log(
        `Unsuccessful refresh attempt. Received ${res.statusCode} status code from server.`
      );
      res.status(response.statusCode).send();
    }
  });
};

const updateAccessToken = async ({
  access_token,
  refresh_token,
  expires_in,
}) => {
  console.log("Updating db with new access token.");
  const params = {
    TableName: process.env.SPOTIFY_AUTH_TABLE,
    Item: {
      app_name: process.env.SPOTIFY_APP_NAME,
      flow_type: "authorization_code",
      access_token: access_token,
      refresh_token: refresh_token,
      expires: Date.now() + expires_in * 1000,
    },
  };
  await spotifyAuthClient.send(new PutCommand(params));
};

// ==================== ADD SONG TO PLAYLIST ====================

// effective signature is (playlistId, accessToken, req, res)
const addSongToPlaylist = async (playlistId, ...args) => {
  // destructure function arguments
  const [accessToken, req, res] = args;

  // desctructure request body
  // todo: could instead just pass req.body along from top level and add playlistId there
  const { songTitle, artistName } = req.body;

  // callback method for adding the song's uri to the playlist with the given id
  const addSong = (songUri) => {
    console.log(`Adding song ${songUri} to spotify:playlist:${playlistId}`);

    if (songUri) {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          auth: {
            bearer: accessToken,
          },
          body: {
            uris: [songUri],
          },
          json: true,
        },
        (error, response, body) => {
          const statusCode = response.statusCode;
          if (statusCode !== 200) {
            // if unsuccessful, report the error to the client
            res
              .status(statusCode)
              .json({ status: statusCode, message: body.error });
          } else {
            res
              .status(statusCode)
              .json({ status: statusCode, message: "success" });
          }
        }
      );
    } else {
      console.log("No song uri found");
      res.status(404).json({
        status: 404,
        message: "No song found",
      });
    }
  };

  // search for the song and include the addSong method as the callback
  searchForSong(songTitle, artistName, accessToken, addSong);
};

const searchForSong = async (song, artist, accessToken, next) => {
  console.log(`Searching for song: ${song} by ${artist}`);

  // form the first part of the query params
  const query = encodeURIComponent(
    `${song.replace(" ", "+")}+${artist.replace(" ", "+")}`
  );

  // form the full url
  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

  // search for the given song and artist, return the uri of the first search result
  return request.get(
    url,
    {
      auth: {
        bearer: accessToken,
      },
    },
    (err, res, body) => {
      const json = JSON.parse(body);
      next(json.tracks?.items[0]?.uri);
    }
  );
};

// ==================== SET VOLUME ====================

// set the volume, and update the tables current volume on success
const setVolume = (newVolume, accessToken, req, res) => {
  const url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`;
  request.put(
    url,
    {
      auth: {
        bearer: accessToken,
      },
    },
    (err, internalRes, body) => {
      if (internalRes.statusCode !== 204) {
        console.log("Unexpected response during set volume:", {
          status: internalRes.statusCode,
          body,
        });
      }
      res.status(internalRes.statusCode).send(body);
    }
  );
};
