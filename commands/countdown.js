const Library = require('../Lib.js');
module.exports = {
    name: 'countdown',
    cooldown: 5,
    description: 'Christmas countdown command',
    execute(client, config, dataFile, message, args) {

        message.channel.sendEmbed(Library.getCDMessages());
        // message.channel.send('Pong.');

    },
};
