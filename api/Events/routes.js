const eventHandler = require("./handler.js");
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

app.get("/events/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const type = req.query.type;
    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
    } else {
      const event = await eventHandler.getEvent(eventId, type);
      res.status(event.status).json(event);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not retreive event information",
    });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    result: "error",
    message: "Path not found",
  });
});

// for local testing
// app.listen(3030, () => {
//   console.log(`Example app listening on port 3030`);
// });
module.exports.handler = serverless(app);
