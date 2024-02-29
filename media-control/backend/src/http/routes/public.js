import Express from "express";
import * as mediaHandler from "../../handlers/media.js";

const router = Express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "success",
  });
});

router.get("/:eventId/:screenName/:sourceName", (req, res, next) => {
  const eventId = req.params.eventId;
  const screenName = req.params.screenName;
  const sourceName = req.params.sourceName;
  mediaHandler.redirectScreenToSource(
    req.app.rtdb,
    res,
    eventId,
    screenName,
    sourceName,
    next
  );
});

router.get("/:eventId/:mediaName", (req, res, next) => {
  const eventId = req.params.eventId;
  const mediaName = req.params.mediaName;
  mediaHandler.sendNonSocketMediaPage(res, eventId, mediaName, next);
});

export const pub = router;
