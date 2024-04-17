const AWS = require("aws-sdk");
const ddb = require("../services/emc_ddb");
const wss_ddb = require("../services/wss_ddb");

AWS.config.update({ region: process.env.APP_REGION });

module.exports.getScreens = (res, next) => {
  const eventId = res.locals.eventId;
  ddb.getScreens(eventId).then(
    ({ Items: screens, LastEvaluatedKey: lek }) => {
      res.status(200).send({ lek, screens });
    },
    (err) => {
      next(err);
    }
  );
};

module.exports.getCurentMediaOfScreen = (res, eventId, screenId, next) => {
  ddb.getScreen(eventId, screenId).then(
    (screen) => {
      if (screen) {
        const { current_media_id } = screen;
        res.status(200).send({ current_media_id });
      } else {
        res.status(404).send({
          status: 404,
          message: `No screen found with id ${screenId}`,
        });
      }
    },
    (err) => {
      next(err);
    }
  );
};

module.exports.updateCurrentMediaOfScreen = (
  res,
  screenId,
  newMediaId,
  next
) => {
  const eventId = res.locals.eventId;
  ddb.updateScreenWithNewMedia(eventId, screenId, newMediaId).then(
    (responseCode) => {
      res.status(responseCode).send({ status: responseCode });
    },
    (err) => {
      next(err);
    }
  );
};

module.exports.broadcastScreenChangesHandler = async (
  eventId,
  channel,
  data
) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: process.env.WS_CALLBACK_URL,
  });

  const connections = await wss_ddb.getAllChannelConnections(eventId, channel);

  if (connections) {
    const postCalls = connections.map(async ({ connection_id }) => {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: connection_id,
          Data: JSON.stringify(data),
        })
        .promise();
    });
    // doesn't resolve to anything, no point in returning anything; stream is our feedback loop
    await Promise.all(postCalls);
  }

  return true;
};

module.exports.updateSource = async (res, screenId, newMediaId, next) => {
  const eventId = res.locals.eventId;
  const channel = `channel.screen.${screenId}`;
  const data = {
    action: "update_source",
    new_source: newMediaId,
  };

  module.exports.broadcastScreenChangesHandler(eventId, channel, data).then(
    (result) => {
      if (result) {
        console.log({ broadcastResults: JSON.stringify(result) });
        res.status(200).send({ status: 200, message: "message sent" });
      }
    },
    (err) => {
      next(err);
    }
  );
};
