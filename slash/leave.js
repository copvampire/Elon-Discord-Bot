const { PermissionFlagsBits } = require("discord.js");

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  // v14 FIX: Use PermissionFlagsBits instead of Permissions.FLAGS
  if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) 
    return await interaction.editReply("I do not have permission to kick members in this server.");
    
  await interaction.member.send("You requested to leave the server, if you change your mind you can rejoin at a later date.")
    .catch(e => console.log("Could not DM member")); // Good practice to catch DM blocks

  await interaction.member.kick(`${interaction.user.username} wanted to leave.`);
  await interaction.editReply(`${interaction.user.username} left in a hurry!`);
};

exports.commandData = {
  name: "leave",
  description: "Make's the user leave the guild.",
  options: [],
  defaultPermission: true,
};

exports.conf = {
  permLevel: "User",
  guildOnly: true
};