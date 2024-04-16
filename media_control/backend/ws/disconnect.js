const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  DeleteCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({
  apiVersion: "2012-08-10",
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

module.exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId;

  const queryParams = {
    TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
    KeyConditionExpression: "#npk = :npk AND begins_with(#nsk, :nsk)",
    ExpressionAttributeNames: {
      "#npk": "connection_id",
      "#nsk": "channel",
    },
    ExpressionAttributeValues: {
      ":npk": connectionId,
      ":nsk": "channel.",
    },
  };

  try {
    const { Items } = await dynamoDbClient.send(new QueryCommand(queryParams));

    const unsubscribes = Items.map(async (channelConnection) => {
      const deleteParams = {
        TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
        Key: {
          connection_id: channelConnection.connection_id,
          channel: channelConnection.channel,
        },
      };
      const deleteResponse = await dynamoDbClient.send(
        new DeleteCommand(deleteParams)
      );
      return deleteResponse.$metadata.httpStatusCode;
    });

    // resolve delete commands and report overall status (max of all statuses so 4/500s will be reported if any)
    const unsubscribeResults = await Promise.all(unsubscribes);
    return { statusCode: Math.max(...unsubscribeResults) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};
