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

module.exports.updateSource = (res, screenId, newMediaId, next) => {
  const eventId = res.locals.eventId;
  const channel = `channel.screen.${screenId}`;

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: process.env.WS_CALLBACK_URL,
  });

  const postData = {
    action: "update_source",
    new_source: newMediaId,
  };

  console.log({ postData });

  wss_ddb.getAllChannelConnections(eventId, channel).then(
    async (connections) => {
      if (connections) {
        const postCalls = connections.map(async ({ connection_id }) => {
          await apigwManagementApi
            .postToConnection({
              ConnectionId: connection_id,
              Data: JSON.stringify(postData),
            })
            .promise();
        });
        const postResults = await Promise.all(postCalls);
        console.log({ postResults });
      }
      res.status(200).send({ status: 200, message: "message sent" });
    },
    (err) => {
      next(err);
    }
  );
};
