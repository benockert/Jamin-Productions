const request = require("request");

module.exports.getEvent = (res, next) => {
  const eventId = res.locals.eventId;
  return request.get(
    `${process.env.JP_API_URL}/events/${eventId}?type=mediacontrol`,
    (err, _, body) => {
      if (err) {
        next(err);
      } else {
        res.status(200).send(JSON.parse(body));
      }
    }
  );
};
