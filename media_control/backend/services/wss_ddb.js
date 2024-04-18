const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  apiVersion: "2012-08-10",
});
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const queryForItems = async (connectionId) => {
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

  const { Items } = await dynamoDbClient.send(new QueryCommand(queryParams));
  return Items;
};

const scanForItems = async (scanParams) => {
  const params = {
    TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
    ...scanParams,
  };
  const { Items } = await dynamoDbClient.send(new ScanCommand(params));
  return Items;
};

const deleteItems = async (deleteParams) => {
  const params = {
    TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
    ...deleteParams,
  };
  const deleteResponse = await dynamoDbClient.send(new DeleteCommand(params));
  return deleteResponse.$metadata.httpStatusCode;
};

module.exports.getAllChannelConnections = async (eventId, channel) => {
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

module.exports.deleteConnection = async (connectionId, channel) => {
  const deleteParams = {
    Key: {
      connection_id: connectionId,
      channel,
    },
  };
  return await deleteItems(deleteParams);
};

module.exports.getConnection = async (connectionId) => {
  return await queryForItems(connectionId);
};
