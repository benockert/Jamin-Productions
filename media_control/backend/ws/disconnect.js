const ddb = require("../services/emc_ddb");
const wss_ddb = require("../services/wss_ddb");

module.exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId;

  try {
    const Items = await wss_ddb.getConnection(connectionId);

    const unsubscribes = Items.map(async (channelConnection) => {
      const connectionId = channelConnection.connection_id;
      const channel = channelConnection.channel;

      // delete the connection from our db
      const deleteConnectionStatus = await wss_ddb.deleteConnection(
        connectionId,
        channel
      );

      let deleteCurrentMediaStatus = 0;
      if (channel.includes("screen")) {
        const screenId = channel.substring(channel.indexOf(".") + 1);
        // also remove the current media entry for the disconnected screen
        deleteCurrentMediaStatus = await ddb.updateScreenWithNewValue(
          channelConnection.event_id,
          screenId,
          "current_media_id",
          "" // nothing
        );
      }

      return Math.max([deleteConnectionStatus, deleteCurrentMediaStatus]);
    });

    // resolve delete commands and report overall status (max of all statuses so 4/500s will be reported if any)
    const unsubscribeResults = await Promise.all(unsubscribes);
    return { statusCode: Math.max(...unsubscribeResults) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};
