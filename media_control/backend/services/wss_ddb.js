const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const scanForItems = async (scanParams) => {
  const params = {
    TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
    ...scanParams,
  };
  console.log({ params });
  const { Items } = await dynamoDbClient.send(new ScanCommand(params));
  return Items;
};

module.exports.getAllChannelConnections = async (eventId, channel) => {
  console.log(eventId, channel);
  const scanParams = {
    ExpressionAttributeNames: { "#nsk": "channel", "#n1": "event_id" },
    ExpressionAttributeValues: {
      ":vsk": channel,
      ":v1": eventId,
    },
    FilterExpression: "#nsk = :vsk AND #n1 = :v1",
  };
  return await scanForItems(scanParams);
};
