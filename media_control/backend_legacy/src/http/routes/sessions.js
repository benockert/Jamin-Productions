import Express from "express";
import * as sessionHandler from "../../handlers/sessions.js";

const router = Express.Router();

router.post("/", (req, res, next) => {
  const accessCode = req.body.access_code;

  // TODO: validate input
  sessionHandler.getEventAndScopeByAccessCode(
    req.app.mysql,
    res,
    accessCode,
    next
  );
});

router.post("/validate", (req, res, next) => {
  const token = req.body.jwt;
  sessionHandler.validateToken(res, token, next);
});

export const sessions = router;
