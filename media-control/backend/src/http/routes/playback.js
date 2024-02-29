import Express from "express";
import * as playbackHandler from "../../handlers/playback.js";
import auth from "../../middleware/auth.js";

const router = Express.Router();

router.put("/music/play", auth(2), (req, res, next) => {
  playbackHandler.play(req.app.spotify, res, req.eventId, next);
});

router.put("/music/pause", auth(2), (req, res, next) => {
  playbackHandler.pause(req.app.spotify, res, req.eventId, next);
});

router.put("/music/volume", auth(2), (req, res, next) => {
  playbackHandler.updateVolume(
    req.app.spotify,
    req.app.rtdb,
    res,
    req.eventId,
    req.query.level,
    next
  );
});

router.post("/video", auth(2), (req, res, next) => {
  const channel = req.body.screen;
  const action = req.body.action;
  console.log(`Received request for ACTION: ${action} on SCREEN: ${channel}`);
  req.app.io.to(channel).emit(action, req.body);
  res.status(200).send({ status_code: 200, message: "success" });
});

export const playback = router;
