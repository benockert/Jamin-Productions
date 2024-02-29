import Express from "express";
import * as mediaHandler from "../../handlers/media.js";
import auth from "../../middleware/auth.js";

const router = Express.Router();

router.get("/", auth(1), (req, res, next) => {
  mediaHandler.getMediaByEventId(req.app.mysql, res, req.eventId, next);
});

router.get("/:screenName", auth(1), (req, res, next) => {
  const eventId = req.eventId;
  const screenName = req.params.screenName;
  mediaHandler.getCurrentMediaByScreenName(
    req.app.rtdb,
    req.app.mysql,
    res,
    eventId,
    screenName,
    next
  );
});

export const media = router;
