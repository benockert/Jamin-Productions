const spotifyHandler = require("./handler.js");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

app.use((req, res, next) => {
  console.log("New request at time:", Date.now(), "to path", req.path);
  console.log("Request body:", req.body);

  // call so continues to routes
  next();
});

app.post("/spotify/:eventId/add_to_playlist", async function (req, res, next) {
  const eventId = req.params.eventId;
  if (!eventId) {
    res.status(404).json({
      result: "error",
      message: "Event not found",
    });
  } else {
    spotifyHandler.addToPlaylist(eventId, req, res, next);
  }
});

// TODO: eventually add handling for per-event apps
app.put("/spotify/volume", async function (req, res, next) {
  const newVolume = req.query.v;
  if (!newVolume) {
    res.status(400).send();
  } else {
    spotifyHandler.setVolume(newVolume, req, res, next);
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
