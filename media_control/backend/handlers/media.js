const ddb = require("../services/emc_ddb");
var https = require("https");

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

module.exports.sendStaticWebPage = (res, eventId, mediaId, next) => {
  try {
    https
      .request(
        `https://static.jaminproductions.com/${process.env.APP_STAGE}/media_control/events/${eventId}/html/${mediaId}.html`,
        (externalRes) => {
          res.setHeader("content-disposition", "inline");
          res.setHeader("content-type", "text/html");
          externalRes.pipe(res);
        }
      )
      .end();
  } catch (e) {
    next(e);
  }
};
