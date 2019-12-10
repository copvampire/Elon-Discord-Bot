const request = require('superagent');

module.exports = {
    name: 'insult',
    description: 'insults the tagged user or the message sender if no one is tagged',
    cooldown: 3,
    execute(client, config, dataFile, message, args) {
        const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.get(message.author.id);

        
    },
};