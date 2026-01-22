const { inspect } = require("util");
const { codeBlock } = require("discord.js");

exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings
  const settings = message.settings;
  const defaults = client.settings.get("default");

  if (!action) return message.reply("Please specify an action: view, get, edit, or reset.");

  if (action === "add") return message.reply("This action is no longer available. Please use `edit` instead.");
  
  if (action === "edit") {
    if (!key) return message.reply("Please specify a key to edit");
    if (settings[key] === undefined) return message.reply("This key does not exist in the settings");
    if (value.length < 1) return message.reply("Please specify a new value");
  
    if (value.length > 1) {
        value = value.join(" ");
    } else {
        value = value[0];
    }
    
    client.settings.set(message.guild.id, value, key);
    message.reply(`${key} successfully edited to ${value}`);
  } else
  
  if (action === "get") {
    if (!key) return message.reply("Please specify a key to view");
    if (settings[key] === undefined) return message.reply("This key does not exist in the settings");
    message.reply(`The value of ${key} is currently ${settings[key]}`);
  } else
  
  if (action === "reset") {
    if (!key) return message.reply("Please specify a key to reset.");
    if (settings[key] === undefined) return message.reply("This key does not exist in the settings");
    
    const response = await client.awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);

    if (["y", "yes"].includes(response.toLowerCase())) {
      client.settings.delete(message.guild.id, key);
      message.reply(`${key} was successfully reset to default.`);
    } else
    if (["n","no","cancel"].includes(response)) {
      message.reply(`Your setting for \`${key}\` remains at \`${settings[key]}\``);
    }
  } else
  
  if (action === "view") {
    if (key) {
      if (settings[key] === undefined) return message.reply("This key does not exist in the settings");
      message.reply(`The value of ${key} is currently ${settings[key]}`);
    } else {
      // v14 FIX: Use codeBlock helper
      message.channel.send({ content: codeBlock("json", inspect(settings)) });
    }
  } else {
    message.reply("Invalid action. Please use `view`, `get`, `edit`, or `reset`.");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["set", "config"],
  permLevel: "Administrator"
};

exports.help = {
  name: "conf",
  category: "System",
  description: "View or Update server configuration.",
  usage: "conf <view/get/edit/reset> <key> <value>"
};