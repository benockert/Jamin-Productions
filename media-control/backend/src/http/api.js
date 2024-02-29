import { events } from "./routes/events.js";
import { media } from "./routes/media.js";
import { screens } from "./routes/screens.js";
import { sessions } from "./routes/sessions.js";
import { playback } from "./routes/playback.js";
import { pub } from "./routes/public.js";
import { redirectPage } from "../utils/utils.js";
import { config } from "../config/config.js";

export const registerRoutes = (app) => {
  // request entry point
  app.use((req, res, next) => {
    console.log("New request at time:", Date.now(), "to path", req.path);

    // configure request headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, content-type, x-access-token, authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.removeHeader("X-Powered-By");

    next();
  });

  // add routes
  app.use("/api/v1/events", events);
  app.use("/api/v1/media", media);
  app.use("/api/v1/screens", screens);
  app.use("/api/v1/session", sessions);
  app.use("/api/v1/playback", playback);
  app.use("/api/v1/", pub);

  // error handler
  app.use((err, req, res, next) => {
    if (
      req.route.path == "/:eventId/:screenName/:sourceName" ||
      req.route.path == "/:eventId/:mediaName"
    ) {
      const eventId = req.originalUrl.split("/")[3];
      redirectPage(res, eventId, "404", 404);
    } else {
      console.error(err);
      res.status(500).send({ status: 500, message: "Something went wrong." });
    }
  });
};
