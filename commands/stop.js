module.exports = {
    name: 'stop',
    cooldown: 1,
    description: 'Stop playing music!',
    execute(client, config, dataFile, message, args) {
        if(message.guild.voiceConnection){
            message.member.voiceChannel.leave()
            .then(connection => {
                message.reply("Left!");
            })
        }
    },
};
