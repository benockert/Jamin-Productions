const playbackHandler = require("../../handlers/playback");
const auth = require("../../middleware/auth");
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

// query param `v` to specify the volume
app.put(
  `/v1/${route}/:eventId/screens/:screenId/volume`,
  auth(2),
  (req, res, next) => {
    const eventId = res.locals.eventId;
    const screenId = `screen.${req.params.screenId}`;
    const volume = req.query.v;
    playbackHandler.setVolumeOfScreen(
      res,
      eventId,
      screenId,
      volume,
      true,
      next
    );
  }
);

// unauthed because used by the screens themselves on load
app.put(`/v1/${route}/:eventId/screens/:screenId/mute`, (req, res, next) => {
  const eventId = req.params.eventId;
  const screenId = `screen.${req.params.screenId}`;

  playbackHandler.setVolumeOfScreen(res, eventId, screenId, 0, false, next);
});

// unauthed because used by the screens themselves on load
app.put(
  `/v1/${route}/:eventId/screens/:screenId/unmute`,
  async (req, res, next) => {
    const eventId = req.params.eventId;
    const screenId = `screen.${req.params.screenId}`;

    // get the previous volume
    playbackHandler
      .getDefaultScreenVolume(res, eventId, screenId, next)
      .then((prevVolume) => {
        // update current volume (don't need to updat default since already there)
        playbackHandler.setVolumeOfScreen(
          res,
          eventId,
          screenId,
          prevVolume,
          false,
          next
        );
      });
  }
);

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
