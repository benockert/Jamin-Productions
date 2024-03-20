const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
var request = require("request");

const app = express();
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

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
      // get primary event information
      const eventPrimaryParms = {
        TableName: process.env.EVENTS_TABLE,
        Key: {
          event_id: `${eventId.toLowerCase()}.primary`,
        },
      };
      const { Item: primary } = await dynamoDbClient.send(
        new GetCommand(eventPrimaryParms)
      );
      if (primary) {
        const { name, date, brand_color } = primary;

        if (type) {
          // get secondary event information based on type
          const secondaryEventParams = {
            TableName: process.env.EVENTS_TABLE,
            Key: {
              event_id: `${eventId.toLowerCase()}.${type}`,
            },
          };
          const { Item: secondary } = await dynamoDbClient.send(
            new GetCommand(secondaryEventParams)
          );
          if (secondary) {
            res.json({ name, date, brand_color, ...secondary });
          } else {
            res.status(404).json({
              result: "error",
              message: `Event '${eventId}' does not have a service with type '${type}'`,
            });
          }
        } else {
          console.log("No type specified");
          res.json({ name, date });
        }
      } else {
        res.status(404).json({
          result: "error",
          message: `Could not find event with id '${eventId}'`,
        });
      }
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
