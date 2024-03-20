const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const errorMessage = "Error submitting form ";

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

app.get("/requests/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const lek = req.query.lek; // last evaluated sort key (we know partition key from eventId)

    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
    } else {
      const params = {
        TableName: process.env.REQUESTS_TABLE,
        Limit: 50,
        FilterExpression: "#n0 = :v0",
        ExpressionAttributeNames: {
          "#n0": "event_name",
          "#ap0": "artist_name",
          "#ap1": "requestor_name",
          "#ap2": "song_title",
        },
        ExpressionAttributeValues: { ":v0": eventId.toLowerCase() },
        Select: "SPECIFIC_ATTRIBUTES",
        ProjectionExpression: "#ap0,#ap1,#ap2",
      };
      if (lek) {
        params.ExclusiveStartKey = {
          event_name: eventId,
          submission_timestamp: Number(lek),
        };
      }

      console.log("Submitting Scan request:", params);
      const { Items, LastEvaluatedKey } = await dynamoDbClient.send(
        new ScanCommand(params)
      );
      res.json({ lek: LastEvaluatedKey?.submission_timestamp, items: Items });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not retrieve requests",
    });
  }
});

app.post("/requests/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const { songTitle, artistName, requestorName, requestNotes } = req.body;
    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
    } else if (typeof songTitle !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: song title)",
      });
    } else if (typeof artistName !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: artist name)",
      });
    } else if (typeof requestorName !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: your name)",
      });
    } else if (typeof requestNotes !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: notes)",
      });
    } else {
      const params = {
        TableName: process.env.REQUESTS_TABLE,
        Item: {
          event_name: eventId.toLowerCase(),
          submission_timestamp: Date.now(),
          song_title: songTitle ?? "",
          artist_name: artistName ?? "",
          requestor_name: requestorName ?? "",
          notes: requestNotes ?? "",
        },
      };

      console.log("Submitting Put request:", params);
      await dynamoDbClient.send(new PutCommand(params));
      res.status(200).json({
        result: "success",
        message: `Thank you for your request${
          requestorName == "" ? "!" : `, ${requestorName.split(" ")[0]}!`
        }`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not submit request. Please try again later.",
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
