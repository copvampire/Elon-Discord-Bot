module.exports = {
    name: 'mhg',
    description: 'Grab invite for Mini Hub Games',
    cooldown: 3,
    execute(client, config, dataFile, message, args) {
        const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.get(message.author.id);

        message.channel.send(`${user}, https://discord.gg/2mNYERv`);

    },
};