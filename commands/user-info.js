const Discord = require('discord.js');
const Library = require('../Lib.js');
module.exports = {
    name: 'user-info',
    description: 'user information',
    aliases: ['user', 'info'],
    execute(client, config, dataFile, message, args) {
        
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
        if (!dataFile[config.serverID]["Quiz_Scores"][taggedUser.id]){
            var Correct = 0;
            var Wrong = 0;
            var Answered = 0;
        }else{
            var Correct = dataFile[config.serverID]["Quiz_Scores"][taggedUser.id].Correct;
            var Wrong = dataFile[config.serverID]["Quiz_Scores"][taggedUser.id].Wrong;
            var Answered = Correct + Wrong;
        }

        var infoEmbed = new Discord.RichEmbed()
        .setColor(Library.getRandomColor())
        .setTitle(`${taggedUser.username} stats`)
        .addField('Cookies:', `Given: ` + cookieAmountGiven + `\n Recieved: ` + cookieAmountRecieved, true)
        .addField('Penis:', penisSize + ` ` + penisMeassure, true)
        .addField('Quiz scores: A/C/W', Answered + "/" + Correct + "/" + Wrong)
        .addBlankField()
        .setThumbnail(taggedUser.avatarURL)
        .setTimestamp()
        .setFooter("Read on ");


        message.channel.sendEmbed(infoEmbed);

        // message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    },
};