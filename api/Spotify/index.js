const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
var request = require("request");

const app = express();
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

app.use((req, res, next) => {
  console.log("New request at time:", Date.now(), "to path", req.path);
  console.log("Request body:", req.body);

  // call so continues to routes
  next();
});

app.post("/spotify/:eventId/add_to_playlist", async function (req, res) {
  const eventId = req.params.eventId;
  if (!eventId) {
    res.status(404).json({
      result: "error",
      message: "Event not found",
    });
  } else {
    const params = {
      TableName: process.env.EVENTS_TABLE,
      Key: {
        event_id: eventId.toLowerCase(),
      },
    };

    const { Item } = await dynamoDbClient.send(new GetCommand(params));
    if (Item) {
      const { playlist_id: playlistId } = Item;
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
    }
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    result: "error",
    message: "Path not found",
  });
});

// error hander
app.use((err, req, res, next) => {
  console.log("INTERNAL SERVER ERROR", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
});

// for local testing
app.listen(3030, () => {
  console.log(`Example app listening on port 3030`);
});
module.exports.handler = serverless(app);

/// ================= HELPERS =================

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
  } = await dynamoDbClient.send(new GetCommand(params));
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
  await dynamoDbClient.send(new PutCommand(params));
};

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
