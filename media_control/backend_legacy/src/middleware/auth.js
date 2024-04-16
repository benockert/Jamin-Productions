import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import assert from "node:assert";
const { verify } = jwt;

const auth = (minRequiredScope) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      try {
        const decodedToken = verify(token, config.jwtSecret, {
          maxAge: 3600 * 12,
        });
        const eventId = decodedToken.eventId;
        const scope = decodedToken.scope;
        assert(scope >= minRequiredScope);
        req.eventId = eventId;
        next();
      } catch (err) {
        res.status(403).send({ status: 403, message: "Unauthorized" });
      }
    } else {
      res.status(403).send({ status: 403, message: "Unauthorized" });
    }
  };
};

export default auth;
