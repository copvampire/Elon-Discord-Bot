module.exports = {
    name: 'yeet',
    description: 'yeet someone off the server',
    guildOnly: true,
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);
        if (message.member.roles.has(Role.id)) {
            if (!message.mentions.users.size) {
                return message.reply('You need to tag a user in order to kick them!');
            }
            else {
                // grab the "first" mentioned user from the message
                // this will return a `User` object, just like `message.author`
                const taggedUser = message.mentions.users.first();

                message.channel.send(`${taggedUser.username} got yeeted out faster than S5-HVS1 did`);
                message.guild.member(taggedUser).kick();
            }
        }else{
            message.channel.send('You need more permissions to do this command!');
        }
    },
};