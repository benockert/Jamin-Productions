const jwt = require("jsonwebtoken"); // is const ok or should it be var?
const assert = require("assert");
const { verify } = jwt;

module.exports = (minRequiredScope) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decodedToken = verify(token, process.env.JWT_SECRET, {
          maxAge: 3600 * 12,
        });
        const eventId = decodedToken.eventId;
        const scope = decodedToken.scope;

        console.log("Auth check:", { eventId, scope, minRequiredScope });
        assert(scope >= minRequiredScope);
        res.locals.eventId = eventId;

        next();
      } catch (err) {
        res.status(403).send({
          status: 403,
          message: "Unauthorized, invalid or expired authorization token",
        });
      }
    } else {
      res
        .status(403)
        .send({ status: 403, message: "Unauthorized, no authorization token" });
    }
  };
};
