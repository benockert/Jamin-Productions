export const getScreensByEventId = (mysql, res, eventId, next) => {
  mysql.getScreensByEventId(eventId).then(
    (screens) => {
      if (!screens.length) {
        res
          .status(404)
          .send("No screens found for the event with the given id");
      } else {
        res.status(200).send(screens);
      }
    },
    (err) => {
      next(err);
    }
  );
};

export const registerNewScreen = (
  rtdb,
  eventId,
  res,
  newScreenName,
  mediaUrl,
  next
) => {
  const newScreenUrlName = newScreenName.toLowerCase().split(" ").join("_");
  rtdb
    .updateScreenSource(eventId, newScreenUrlName, newScreenName, mediaUrl)
    .then(
      (result) => {
        if (result == "success") {
          res
            .status(200)
            .send({
              status: 200,
              message: result,
              screen_url: newScreenUrlName,
              media_url: mediaUrl,
            });
        }
      },
      (err) => {
        next(err);
      }
    );
};
