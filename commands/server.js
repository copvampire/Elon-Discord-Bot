const Library = require('../Lib.js');
module.exports = {
    name: 'server',
    description: 'server info',
    execute(client, config, dataFile, message, args) {
        var guild = client.guilds.get(config.serverID);
        message.channel.sendEmbed(Library.getServerMessage(guild));
    },
};