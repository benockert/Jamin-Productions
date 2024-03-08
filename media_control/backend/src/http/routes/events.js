import Express from "express";
import * as eventsHandler from "../../handlers/events.js";
import auth from "../../middleware/auth.js";

const router = Express.Router();

router.get("/", auth(1), (req, res, next) => {
  eventsHandler.getEventById(req.app.mysql, res, req.eventId, next);
});

router.post("/", auth(1), (req, res, next) => {
  eventsHandler.getEventById(
    req.app.mysql,
    res,
    req.eventId,
    req.body.fields,
    next
  );
});

export const events = router;
