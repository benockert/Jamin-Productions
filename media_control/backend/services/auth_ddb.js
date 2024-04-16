const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const getItem = async (accessCode) => {
  const params = {
    TableName: process.env.AUTH_TABLE,
    Key: {
      access_code: accessCode,
    },
  };
  const { Item } = await dynamoDbClient.send(new GetCommand(params));
  return Item;
};

module.exports.getAccessInformation = async (accessCode) => {
  return await getItem(accessCode);
};
