const Library = require('../Lib.js');
module.exports = {
    name: 'random',
    description: 'Random Number!',
    execute(client, config, dataFile, message, args) {
        message.channel.send(Library.getRandomNumber(100));
    },
};
