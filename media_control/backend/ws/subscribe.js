const wss_ddb = require("../services/wss_ddb");

module.exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId;

  const body = JSON.parse(event.body);
  const channelName = body.channel;
  const eventId = body.event_id;

  try {
    const putStatus = await wss_ddb.putConnectionSubscription(
      connectionId,
      eventId,
      channelName
    );
    return { statusCode: putStatus };
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};
