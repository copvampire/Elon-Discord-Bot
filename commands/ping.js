module.exports = {
    name: 'ping',
    cooldown: 5,
    description: 'Ping!',
    execute(client, config, dataFile, message, args) {
        message.channel.send('Pong.');
    },
};
