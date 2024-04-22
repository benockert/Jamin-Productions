const screenHandler = require("../../handlers/screens");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

const route = "playback";

app.use((req, res, next) => {
  console.log(
    "New request at time:",
    Date.now(),
    "to path",
    req.path,
    "Request body:",
    req.body
  );

  // call so continues to routes
  next();
});

// TODO: move to playback routes, make mute and unmute endpoint
app.put(`/v1/${route}/:eventId/screens/:screenId/volume`, (req, res, next) => {
  const eventId = req.params.eventId;
  const screenId = `screen.${req.params.screenId}`;
  const volume = req.query.v;
  screenHandler.setVolumeOfScreen(res, eventId, screenId, volume, next);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);

  // in dev mode, return whole error response to help with debugging, otherwise uninformative error message
  message =
    process.env.APP_STAGE === "dev"
      ? `${err.type}: ${err.message}`
      : "Something went wrong.";
  res.status(500).send({ status: 500, message });
});

// for local testing
app.listen(3035, () => {
  console.log(`Example app listening on port 3035`);
});
module.exports.handler = serverless(app);
