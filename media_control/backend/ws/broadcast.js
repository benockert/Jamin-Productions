const screenHandler = require("../handlers/screens");

// handles streams from DynamoDB
module.exports.handler = async (event, context) => {
  const broadcastChannel = "channel.admin";
  const broadcasts = event.Records.map(async (streamRecord) => {
    // get keys and new item in table from stream
    const keys = streamRecord.dynamodb.Keys;
    const newEntry = streamRecord.dynamodb.NewImage;

    // determine what type of object was updated
    const keyType = keys.key.S.split(".")[0];
    if (keyType == "screen") {
      const broadcastData = {
        action: "screen_change",
        screenId: keys.key.S,
        newMediaId: newEntry.current_media_id.S,
      };
      return screenHandler
        .broadcastScreenChangesHandler(
          keys.event_id.S,
          broadcastChannel,
          broadcastData
        )
        .then((result) => {
          return result;
        }); // don't handle error, let the exception pass on to the ws client
    }
  });

  await Promise.all(broadcasts);
  return { statusCode: 200 };
};
