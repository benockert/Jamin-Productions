const ddb = require("../services/auth_ddb");
const jwt = require("jsonwebtoken");
const { sign, verify } = jwt;

module.exports.generateToken = (res, accessCode, next) => {
  ddb.getAccessInformation(accessCode).then(
    (auth) => {
      if (!auth) {
        res.status(401).send({ status: 401, message: "Invalid access code" });
      } else {
        const token = sign(
          {
            eventId: auth.event_id,
            scope: auth.scope,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );
        res
          .status(200)
          .send({ status: 200, token, redirect_path: auth.redirect_path });
      }
    },
    (err) => {
      next(err);
    }
  );
};

module.exports.validateToken = (res, token, next) => {
  try {
    verify(token, process.env.JWT_SECRET, { maxAge: 3600 * 12 });
    res.status(200).send({ status: 200, message: "Valid token" });
  } catch (err) {
    res.status(403).send({ status: 403, message: "Invalid token" });
  }
};
