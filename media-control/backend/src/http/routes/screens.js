import Express from "express";
import * as screenHandler from "../../handlers/screens.js";
import auth from "../../middleware/auth.js";

const router = Express.Router();

router.get("/", auth(1), (req, res, next) => {
  screenHandler.getScreensByEventId(req.app.mysql, res, req.eventId, next);
});

router.post("/update_media", auth(2), (req, res) => {
  const channel = req.body.screen;
  req.app.io.to(channel).emit("update-source", req.body);
  res.status(200).send({ status_code: 200, message: "success" });
});

router.post("/", auth(1), (req, res, next) => {
  const newScreenName = req.body.user_new_screen_name;
  const mediaUrl = req.body.media_url_name;
  screenHandler.registerNewScreen(
    req.app.rtdb,
    req.eventId,
    res,
    newScreenName,
    mediaUrl,
    next
  );
});

export const screens = router;
