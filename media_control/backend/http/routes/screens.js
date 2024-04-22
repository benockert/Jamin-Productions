const screenHandler = require("../../handlers/screens");
const auth = require("../../middleware/auth");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

const route = "screens";

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

app.get(`/v1/${route}/`, auth(1), (req, res, next) => {
  screenHandler.getScreens(res, next);
});

// transmits a new media source to active connections with the given screen id
// only admin scope
app.put(`/v1/${route}/:screenId/media`, auth(2), (req, res, next) => {
  const screenId = req.params.screenId;
  const newMediaId = req.body.new_media_id;
  screenHandler.updateSource(res, screenId, newMediaId, next);
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
app.listen(3034, () => {
  console.log(`Example app listening on port 3034`);
});
module.exports.handler = serverless(app);
