const ddb = require("../services/emc_ddb");
const request = require("request");

// update the screen playback volume only if playback is enabled for this screen
module.exports.setVolumeOfScreen = async (
  res,
  eventId,
  screenId,
  newVolume,
  updateDefault,
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
              // use a different function if we want to update default or not
              const func = updateDefault
                ? ddb.updateScreenVolumeAndDefault
                : ddb.updateScreenVolume;
              // update table with new volume
              func(eventId, screenId, newVolume).then(
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

module.exports.getDefaultScreenVolume = async (
  res,
  eventId,
  screenId,
  next
) => {
  return ddb.getScreen(eventId, screenId).then(
    (screen) => {
      return screen.default_playback_volume;
    },
    (err) => {
      next(err);
    }
  );
};
