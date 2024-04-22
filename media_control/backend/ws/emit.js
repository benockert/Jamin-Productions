const ddb = require("../services/emc_ddb");

module.exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  const topic = body.topic;

  let statusCode = 200;
  try {
    switch (topic) {
      case "screen_loaded":
        const eventId = body.event_id;
        const loadedScreenId = body.screen_id;
        const loadedMediaId = body.media_id;
        statusCode = await ddb.updateScreenWithNewValue(
          eventId,
          loadedScreenId,
          "current_media_id",
          loadedMediaId
        );
        break;
      default:
        console.log("No handler for topic", topic);
    }
  } catch (err) {
    console.error(err);
    statusCode = 500;
  }
  return {
    statusCode,
  };
};
