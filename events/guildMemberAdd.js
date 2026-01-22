const { MessageEmbed } = require("discord.js");
const { getSettings } = require("../modules/functions.js");
// This event executes when a new member joins a server. Let's welcome them!

module.exports = (client, member) => {
  // Load the guild's settings
  const settings = getSettings(member.guild);

  // If welcome is off, don't proceed (don't welcome the user)
  if (settings.welcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = new MessageEmbed()
        .setTitle('Member Joined!!')
        .setDescription(settings.welcomeMessage.replace("{{user}}", member.user.tag))
        .setThumbnail('http://www.gstatic.com/tv/thumb/persons/487130/487130_v9_ba.jpg')
        .setTimestamp()
        .setFooter('Became a follower on');

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.cache.find(c => c.name === settings.welcomeChannel).send({ embeds: [welcomeMessage] }).catch(console.error);
};
