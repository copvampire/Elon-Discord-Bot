const logger = require("../modules/Logger.js");
module.exports = async (client, error) => {
  // Simple safety check for circular JSON
  try {
      logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
  } catch (e) {
      logger.log(`An error event was sent by Discord.js: \n${error}`, "error");
  }
};