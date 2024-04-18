const screenHandler = require("../../handlers/screens");
const mediaHandler = require("../../handlers/media");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

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

// serves a static page to the user
app.get("/v1/html/:eventId/:screenId/:mediaId", (req, res, next) => {
  const eventId = req.params.eventId;
  const mediaId = req.params.mediaId;
  mediaHandler.sendStaticWebPage(res, eventId, mediaId, next);
});

// gets the current media for the screen with the given id
// no auth, so need eventId in request params
// screen id should not include screen.
app.get(`/v1/:eventId/screens/:screenId/media`, (req, res, next) => {
  const eventId = req.params.eventId;
  const screenId = `screen.${req.params.screenId}`;
  screenHandler.getCurentMediaOfScreen(res, eventId, screenId, next);
});

// no need for catch-all as we don't have a * wildcard in serverless template

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
app.listen(3030, () => {
  console.log(`Example app listening on port 3030`);
});
module.exports.handler = serverless(app);
