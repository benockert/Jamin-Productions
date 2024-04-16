const ddb = require("../services/emc_ddb");

module.exports.getMedia = (res, next) => {
  const eventId = res.locals.eventId;
  ddb.getMedia(eventId).then(
    ({ Items: media, LastEvaluatedKey: lek }) => {
      res.status(200).send({ lek, media });
    },
    (err) => {
      next(err);
    }
  );
};
