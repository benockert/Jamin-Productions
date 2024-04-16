import { redirectPage } from "../utils/utils.js";

export const getCurrentMediaByScreenName = (
  rtdb,
  mysql,
  res,
  eventId,
  screenName,
  next
) => {
  // TODO: add identifier to
  rtdb.getCurrentMediaByScreenName(eventId, screenName).then(
    (media) => {
      // redirect to proper screen
      if (!media) {
        // get most recent schedule
        mysql.getCurrentScreenMediaFromSchedule(eventId, screenName).then(
          (media) => {
            if (!media.length) {
              mysql.getDefaultMediaByScreenName(screenName).then((media) => {
                if (!media.length) {
                  // from mysql
                  res.status(404).send({
                    status: 404,
                    message: "No media found for this screen",
                  });
                } else {
                  // from mysql
                  res
                    .status(200)
                    .send({ status: 200, media_url: media[0].url_name });
                }
              });
            } else {
              // from mysql
              res
                .status(200)
                .send({ status: 200, media_url: media[0].media_url_name });
            }
          },
          (err) => {
            next(err);
          }
        );
      } else {
        // from firebase
        res.status(200).send({ status: 200, media_url: media.cur_media_url });
      }
    },
    (err) => {
      next(err);
    }
  );
};

export const redirectScreenToSource = (
  rtdb,
  res,
  eventId,
  screenName,
  sourceName,
  next
) => {
  redirectPage(res, eventId, sourceName);

  //TODO: check if screen exists and if not add it to the database
  //TODO: update screen current_media_id to sourceName
};

export const sendNonSocketMediaPage = (res, eventId, mediaName, next) => {
  redirectPage(res, eventId, `${mediaName}_ns`);
};

export const getMediaByEventId = (mysql, res, clientId, next) => {
  mysql.getMediaByEventId(clientId).then(
    (media) => {
      res.status(200).send(media);
    },
    (err) => {
      next(err);
    }
  );
};
