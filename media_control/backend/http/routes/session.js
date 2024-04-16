const sessionHandler = require("../../handlers/session");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

const route = "session";

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

app.post(`/v1/${route}/`, (req, res, next) => {
  const accessCode = req.body.access_code;

  if (accessCode) {
    sessionHandler.generateToken(res, accessCode, next);
  } else {
    res.status(400).send({ status: 400, message: "Missing access code" });
  }
});

app.post(`/v1/${route}/validate`, (req, res, next) => {
  const token = req.body.jwt;

  if (token) {
    sessionHandler.validateToken(res, token, next);
  } else {
    res.status(400).send({ status: 400, message: "Missing token" });
  }
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
app.listen(3032, () => {
  console.log(`Example app listening on port 3032`);
});
module.exports.handler = serverless(app);
