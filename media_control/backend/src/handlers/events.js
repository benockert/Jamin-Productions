export const getEventById = (mysql, res, eventId, next) => {
  mysql.getEventById(eventId).then(
    (events) => {
      if (!events.length) {
        res.status(404).send("No event found with the given id");
      } else {
        mysql.getClientById(events[0].client_id).then(
          (clients) => {
            if (!clients.length) {
              events[0].client = {};
            } else {
              events[0].client = clients[0];
            }
            delete events[0].client_id;
            res.status(200).send(events[0]);
          },
          (err) => {
            next(err);
          }
        );
      }
    },
    (err) => {
      next(err);
    }
  );
};
