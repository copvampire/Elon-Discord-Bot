module.exports = {
    name: 'beep',
    description: 'Beep!',
    execute(client, config, dataFile, message, args) {
        message.channel.send('Boop.');
    },
};