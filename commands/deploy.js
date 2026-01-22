exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  // We'll partition the slash commands based on the guildOnly boolean.
  // Separating them into the correct objects defined in the array below.
  const [globalCmds, guildCmds] = client.container.slashcmds.partition(c => !c.conf.guildOnly);

  // Give the user a notification the commands are deploying.
  await message.channel.send("Deploying commands!");

  // Deploy Guild Commands
  // We map the commands to their JSON format required by the API
  const guildCmdData = guildCmds.map(c => c.commandData);
  if (message.guild && guildCmdData.length > 0) {
      await message.guild.commands.set(guildCmdData);
  }

  // Deploy Global Commands
  const globalCmdData = globalCmds.map(c => c.commandData);
  if (client.application && globalCmdData.length > 0) {
      await client.application.commands.set(globalCmdData).catch(e => console.log(e));
  }

  // Reply to the user that the commands have been deployed.
  await message.channel.send("All commands deployed!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "deploy",
  category: "System",
  description: "This will deploy all slash commands.",
  usage: "deploy"
};