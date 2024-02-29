export const play = (spotify, res, eventId, next) => {
  spotify.play(eventId).then(
    (resp) => {
      res.status(resp.statusCode).send();
    },
    (err) => {
      next(err);
    }
  );
};

export const pause = (spotify, res, eventId, next) => {
  spotify.pause(eventId).then(
    (resp) => {
      res.status(resp.statusCode).send();
    },
    (err) => {
      next(err);
    }
  );
};

export const updateVolume = (spotify, rtdb, res, eventId, volume, next) => {
  spotify.updateVolume(eventId, volume).then(
    (resp) => {
      console.log(resp);
      res.status(resp.statusCode).send({ message: resp.body?.error?.message });
      if (resp.statusCode === 204) {
        rtdb.updatePlaybackVolume(eventId, volume);
      }
    },
    (err) => {
      next(err);
    }
  );
};

export const resetVideo = (res, eventId, screen, next) => {
  req.app.io.to(screen).emit("reset-video", req.body);
  res.status(200).send({ status_code: 200, message: "success" });
};
