const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

module.exports.getEvent = async (eventId, eventType) => {
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
    if (eventType) {
      // get secondary event information based on type
      const secondaryEventParams = {
        TableName: process.env.EVENTS_TABLE,
        Key: {
          event_id: `${eventId.toLowerCase()}.${eventType}`,
        },
      };
      const { Item: secondary } = await dynamoDbClient.send(
        new GetCommand(secondaryEventParams)
      );
      if (secondary) {
        return { status: 200, ...primary, ...secondary };
      } else {
        return {
          status: 404,
          result: "error",
          message: `Event '${eventId}' does not have a service with type '${eventType}'`,
        };
      }
    } else {
      console.log("No type specified");
      return { status: 200, ...primary };
    }
  } else {
    return {
      status: 404,
      result: "error",
      message: `Could not find event with id '${eventId}'`,
    };
  }
};
