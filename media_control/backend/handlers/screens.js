const AWS = require("aws-sdk");
const ddb = require("../services/emc_ddb");
const wss_ddb = require("../services/wss_ddb");
const request = require("request");

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
  ddb
    .updateScreenWithNewValue(eventId, screenId, "current_media_id", newMediaId)
    .then(
      (responseCode) => {
        res.status(responseCode).send({ status: responseCode });
      },
      (err) => {
        next(err);
      }
    );
};

// update the screen playback volume only if playback is enabled for this screen
module.exports.setVolumeOfScreen = async (
  res,
  eventId,
  screenId,
  newVolume,
  next
) => {
  ddb.getScreen(eventId, screenId).then(
    (screen) => {
      // if the screen has playback enabled, update the volume
      if (screen.playback_enabled) {
        request.put(
          `${process.env.JP_API_URL}/spotify/volume?v=${newVolume}`,
          (err, internalRes, body) => {
            if (err) {
              next(err);
            } else if (internalRes.statusCode === 204) {
              // update table with new volume
              ddb
                .updateScreenWithNewValue(
                  eventId,
                  screenId,
                  "playback_volume",
                  newVolume
                )
                .then(
                  (responseCode) => {
                    res.status(responseCode).send({ status: responseCode });
                  },
                  (err) => {
                    next(err);
                  }
                );
            } else {
              // we didn't get an expected response, pass on to caller
              res.status(internalRes.statusCode).send({
                status: internalRes.statusCode,
                message: internalRes.body,
              });
            }
          }
        );
      } else {
        // nothing to do
        res.status(204).send({ status: 204 });
      }
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
        res.status(200).send({ status: 200, message: "message sent" });
      }
    },
    (err) => {
      next(err);
    }
  );
};
