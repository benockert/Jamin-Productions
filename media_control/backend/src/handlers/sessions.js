import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
const { sign, verify } = jwt;

export const getEventAndScopeByAccessCode = (mysql, res, accessCode, next) => {
  mysql.getEventAndScopeByAccessCode(accessCode).then(
    (auth) => {
      if (!auth.length) {
        res.status(401).send({ status: 401, message: "Invalid access code" });
      } else {
        const token = sign(
          {
            eventId: auth[0].id,
            scope: auth[0].scope,
          },
          config.jwtSecret,
          { expiresIn: "12h" }
        );
        res
          .status(200)
          .send({ status: 200, token, redirect_page: auth[0].home_url });
      }
    },
    (err) => {
      next(err);
    }
  );
};

export const validateToken = (res, token, next) => {
  try {
    verify(token, config.jwtSecret, { maxAge: 3600 * 12 });
    res.status(200).send({ status: 200, message: "Valid token" });
  } catch (err) {
    console.log(err);
    res.status(403).send({ status: 403, message: "Unauthorized" });
  }
};
