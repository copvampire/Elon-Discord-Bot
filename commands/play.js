const Library = require('../Lib.js');
const YTDL = require('ytdl-core');
const config = require('../config.json');

function PlayMusic(connection, message) {
    var server = servers[config.serverID];
    console.warn(server);
    console.warn(server.queue[0]);
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function(){
        if(server.queue[0]){
            PlayMusic(connection, message);
            console.warn(server);
            console.warn("Play");
        }else{
            connection.disconnect();
            console.warn(server);
            console.warn("End");
        }
    });
}

module.exports = {
    name: 'play',
    cooldown: 1,
    description: 'Play music!',
    execute(client, config, dataFile, message, args) {
        if(message.member.voiceChannel){
            if(!message.guild.voiceConnection){

                if (!servers[config.serverID]){
                    servers[config.serverID] = {
                        queue: []
                    }
                }

                message.member.voiceChannel.join()
                    .then(connection => {
                        var server = servers[config.serverID];
                        message.reply("Joined!");
                        server.queue.push(args[0]);
                        PlayMusic(connection, message);
                    })
            }
        }else{
            message.reply("You must be in a voice channel")
        }
    },
};
