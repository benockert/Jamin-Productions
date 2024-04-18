const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({
  apiVersion: "2012-08-10",
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId;

  const body = JSON.parse(event.body);
  const channelName = body.channel;
  const eventId = body.event_id;

  const params = {
    TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
    Item: {
      connection_id: connectionId,
      channel: `channel.${channelName}`,
      event_id: eventId,
    },
  };

  try {
    const putResponse = await dynamoDbClient.send(new PutCommand(params));
    return { statusCode: putResponse.$metadata.httpStatusCode };
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};
