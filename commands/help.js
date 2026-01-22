const { codeBlock } = require("discord.js");
const { toProperCase } = require("../modules/functions.js");

exports.run = (client, message, args, level) => {
  // If no specific command is called, show all filtered commands.
  const { container } = client;
  if (!args[0]) {
    // Load guild settings (for prefixes and eventually per-guild tweaks)
    const settings = message.settings;

    // Filter all commands by which are available for the user's level
    const myCommands = message.guild ? container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level) :
      container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

    // v14 FIX: .keyArray() is removed. Use [...keys()]
    const commandNames = [...myCommands.keys()];
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

    let currentCategory = "";
    let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n`;
    
    // v14 FIX: .array() is removed. Use [...values()]
    const sorted = [...myCommands.values()].sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
    
    sorted.forEach( c => {
      // FIX: toProperCase is a function, not a string method
      const cat = toProperCase(c.help.category);
      if (currentCategory !== cat) {
        output += `\u200b\n== ${cat} ==\n`;
        currentCategory = cat;
      }
      output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    
    // v14 FIX: Use codeBlock helper and object syntax for send
    message.channel.send({ content: codeBlock("asciidoc", output) });

  } else {
    // Show individual command's help.
    let command = args[0];
    if (container.commands.has(command)) {
      command = container.commands.get(command);
      if (level < container.levelCache[command.conf.permLevel]) return;
      
      message.channel.send({ content: codeBlock("asciidoc", `= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`) });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};