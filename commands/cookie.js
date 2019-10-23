const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'cookie',
    cooldown: 5,
    description: 'Get a cookie!',
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
            return message.reply('You can not send a cookie to yourself!');
        }else if(message.mentions.users.first().id == message.author.id){
            return message.reply('You can not send a cookie to yourself!');
        }
        else {
            // grab the "first" mentioned user from the message
            // this will return a `User` object, just like `message.author`
            var taggedUser = message.mentions.users.first();

        if(taggedUser.id !== "195174881464156161"){
            if(taggedUser.id == "235402693747802112"){
                var CookieTreat = "donut";
                var CookieMessage = `Giving a donut to ${taggedUser.username}`;
                var CookieImage = "https://wearenotmartha.com/wp-content/uploads/Milky-Way-Doughnuts-4-2.jpg";
            }else if(taggedUser.id == "260420860110831616"){
                var CookieTreat = "custard cream";
                var CookieMessage = `Giving a custard cream to ${taggedUser.username}`;
                var CookieImage = "https://kfmradio.com/sites/default/files/thumbnails/image/custard_cream_biscuit_wikipedia.jpg";
            }else if(taggedUser.id == "150000295777140736"){
                var CookieTreat = "jammie dodger";
                var CookieMessage = `Giving a jammie dodger to ${taggedUser.username}`;
                var CookieImage = "https://static.independent.co.uk/s3fs-public/indy100/ZyeBbnAGhlZ/25426-1vf2hul.jpg";
            }else if(taggedUser.id == "338824439842078720"){
                var CookieTreat = "data";
                var CookieMessage = `I CANT EAT FOOD, ONLY DATA`;
                var CookieImage = "https://hackernoon.com/hn-images/1*ItJb0NOAYJcLuOzrhQXSUQ.jpeg";
            }else{
                var CookieTreat = "cookie";
                var CookieMessage = `Giving a cookie to ${taggedUser.username}`;
                var CookieImage = "https://images-gmi-pmc.edge-generalmills.com/8012d5ca-eb39-4901-91a0-0bdddec883b8.jpg";
            }
            
            var cookieEmbed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle(CookieTreat + '!')
            .setDescription(CookieMessage)
            .setThumbnail(CookieImage)
            .setTimestamp()
            .setFooter('Got a '+ CookieTreat +' on ');
        }else{
            var CookieMessage = `No cookies for ${taggedUser.username}`;
            var CookieImage = "https://www.fs.fed.us/sites/default/files/media_wysiwyg/no-cookie-sign.jpg";
            
            var cookieEmbed = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle('cookie!')
            .setDescription(CookieMessage)
            .setThumbnail(CookieImage)
            .setTimestamp()
            .setFooter("Didn't get a cookie on ");
        }
        
            if(taggedUser.id !== "195174881464156161"){
                // if (!dataFile[config.serverID]["Cookies"]) dataFile[config.serverID]["Cookies"] = {};
                if (!dataFile[config.serverID]["Cookies"]) dataFile[config.serverID]["Cookies"] = {};
                
                if (!dataFile[config.serverID]["Cookies"][taggedUser.id]){
                    var cookieAmount = 1;
                    var cookieGivenAmount = 0;
                }else{
                    var cookieAmount = dataFile[config.serverID]["Cookies"][taggedUser.id].Recieved + 1;
                    var cookieGivenAmount = dataFile[config.serverID]["Cookies"][taggedUser.id].Given;
                }

                dataFile[config.serverID]["Cookies"][taggedUser.id] = {
                    Recieved: cookieAmount,
                    Given: cookieGivenAmount
                }

                fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                    if (err) throw err;
                });


                if (!dataFile[config.serverID]["Cookies"][message.author.id]){
                    var cookieAmount = 0;
                    var cookieGivenAmount = 1;
                }else{
                    var cookieAmount = dataFile[config.serverID]["Cookies"][message.author.id].Recieved;
                    var cookieGivenAmount = dataFile[config.serverID]["Cookies"][message.author.id].Given + 1;
                }

                dataFile[config.serverID]["Cookies"][message.author.id] = {
                    Recieved: cookieAmount,
                    Given: cookieGivenAmount
                }

                fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                    if (err) throw err;
                });


            }
            message.channel.sendEmbed(cookieEmbed);

        }
        

    },
};
