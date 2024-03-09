const { fromEnv } = require("@aws-sdk/credential-providers");
import {
  PutObjectCommand,
  PutObjectAclCommand,
  S3Client,
} from "@aws-sdk/client-s3";
const { HttpRequest } = require("@smithy/protocol-http");
const {
  getSignedUrl,
  S3RequestPresigner,
} = require("@aws-sdk/s3-request-presigner");
const { parseUrl } = require("@smithy/url-parser");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { Hash } = require("@smithy/hash-node");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const errorMessage = "Error submitting form ";

app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

app.use((req, res, next) => {
  console.log("New request at time:", Date.now(), "to path", req.path);
  console.log("Request body:", req.body);

  // call so continues to routes
  next();
});

app.post("/media/:eventId/photo_mosaic", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const { name, message, fileName } = req.body;
    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
    } else if (typeof name !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: name)",
      });
    } else if (typeof message !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: message)",
      });
    } else {
      // replace spaces with underscores and add folder path
      const cleanedFileName = fileName.replace(/\s+/g, "_").toLowerCase(); // todo generate random url
      // add the target folder name
      const cleanedFileNameWithKey = `${process.env.APP_STAGE}/interactive_media/photo_mosaic/${eventId}/${cleanedFileName}`;
      // create a presigned url for uploading files
      const presignedUrl = await createPresignedUrlWithoutClient(
        cleanedFileNameWithKey
      );

      const params = {
        TableName: process.env.INTERACTIVE_MEDIA_TABLE,
        Item: {
          event_name: eventId.toLowerCase(),
          submission_timestamp: Date.now(),
          name: name ?? "",
          message: message ?? "",
          s3_url: `https://${process.env.STATIC_CONTENT_BUCKET}/${cleanedFileNameWithKey}`,
        },
      };

      console.log("Submitting Put request:", params);
      await dynamoDbClient.send(new PutCommand(params));
      res.status(200).json({
        result: "success",
        presignedUrl,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not submit photo",
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

// ============= HELPERS ==============

const createPresignedUrlWithoutClient = async (key) => {
  const url = parseUrl(`https://${process.env.CONTENT_STAGING_BUCKET}/${key}`);
  const presigner = new S3RequestPresigner({
    credentials: fromEnv(),
    region: process.env.STATIC_BUCKET_REGION,
    sha256: Hash.bind(null, "sha256"),
  });
  console.log({ presigner });
  const signedUrlObject = await presigner.presign(
    new HttpRequest({
      ...url,
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg",
      },
    }),
    {
      expiresIn: process.env.UPLOAD_URL_EXPIRATION_SECONDS,
    }
  );
  return formatUrl(signedUrlObject);
};
