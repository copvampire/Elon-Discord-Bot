const Discord = require('discord.js');
module.exports = {
    name: 'user-info',
    description: 'user information',
    execute(client, config, dataFile, message, args) {

        function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        if (!message.mentions.users.size) {
            var taggedUser = message.author;
        }
        else {
            var taggedUser = message.mentions.users.first();
        }
        if (!dataFile[config.serverID]["Cookies"][taggedUser.id]){
            var cookieAmountGiven = 0;
            var cookieAmountRecieved = 0;
        }else{
            var cookieAmountGiven = dataFile[config.serverID]["Cookies"][taggedUser.id].Given;
            var cookieAmountRecieved = dataFile[config.serverID]["Cookies"][taggedUser.id].Recieved;
        }
        if (!dataFile[config.serverID]["Penis_Lengths"][taggedUser.id]){
            var penisSize = `No set, run !penis <@${taggedUser.id}>`;
            var penisMeassure = "";
        }else{
            var penisSize = dataFile[config.serverID]["Penis_Lengths"][taggedUser.id].Length;
            var penisMeassure = dataFile[config.serverID]["Penis_Lengths"][taggedUser.id].Measure;
        }

        var infoEmbed = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle(`${taggedUser.username} stats`)
        .addField('Cookies:', `Given: ` + cookieAmountGiven + `\n Recieved: ` + cookieAmountRecieved, true)
        .addField('Penis:', penisSize + ` ` + penisMeassure, true)
        .addBlankField()
        .setThumbnail(taggedUser.avatarURL)
        .setTimestamp()
        .setFooter("Read on ");


        message.channel.sendEmbed(infoEmbed);

        // message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    },
};