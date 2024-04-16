const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const getItem = async (eventId, key) => {
  const params = {
    TableName: process.env.EVENT_MEDIA_CONTROL_TABLE,
    Key: {
      event_id: eventId,
      key,
    },
  };
  console.log(params.Key);
  const { Item } = await dynamoDbClient.send(new GetCommand(params));

  // will be undefined if no item matches Key
  return Item;
};

// queries the event media dynamo table and performs the begins_with expression with the given sortKeyPrefix
// lek is the last evaluated sort key
const queryForItems = async (eventId, lek, sortKeyPrefix) => {
  const params = {
    TableName: process.env.EVENT_MEDIA_CONTROL_TABLE,
    Limit: 50,
    KeyConditionExpression: "#npk = :vpk AND begins_with(#nsk, :vsk)",
    ExpressionAttributeNames: {
      "#npk": "event_id",
      "#nsk": "key",
    },
    ExpressionAttributeValues: {
      ":vpk": eventId.toLowerCase(),
      ":vsk": sortKeyPrefix,
    },
    Select: "ALL_ATTRIBUTES",
  };
  if (lek) {
    params.ExclusiveStartKey = {
      event_id: eventId,
      key: lek,
    };
  }

  const { Items, LastEvaluatedKey } = await dynamoDbClient.send(
    new QueryCommand(params)
  );
  return { Items, LastEvaluatedKey };
  s;
};

const updateItem = async (eventId, key, updateParams) => {
  const params = {
    TableName: process.env.EVENT_MEDIA_CONTROL_TABLE,
    Key: {
      event_id: eventId,
      key,
    },
    ReturnValues: "ALL_NEW",
    ...updateParams,
  };
  const {
    $metadata: { httpStatusCode },
  } = await dynamoDbClient.send(new UpdateCommand(params));
  return httpStatusCode;
};

module.exports.getScreens = async (eventId, lek) => {
  return await queryForItems(eventId, lek, "screen.");
};

module.exports.getScreen = async (eventId, screenId) => {
  const screenKey = `screen.${screenId}`;
  return await getItem(eventId, screenKey);
};

module.exports.getMedia = async (eventId, lek) => {
  return await queryForItems(eventId, lek, "media.");
};

module.exports.updateScreenWithNewMedia = async (
  eventId,
  screenId,
  newMediaId
) => {
  const screenKey = `screen.${screenId}`;
  const updateParams = {
    UpdateExpression: "set #k = :v",
    ExpressionAttributeNames: { "#k": "current_media_id" },
    ExpressionAttributeValues: {
      ":v": newMediaId,
    },
  };
  return await updateItem(eventId, screenKey, updateParams);
};
