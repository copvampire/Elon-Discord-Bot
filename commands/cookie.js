const Discord = require('discord.js');
const fs = require('fs');
const Library = require('../Lib.js');
module.exports = {
    name: 'cookie',
    cooldown: 5,
    description: 'Get a cookie!',
    execute(client, config, dataFile, message, args) {
        
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
            }else if(taggedUser.id == "227853483145953281"){
                var CookieTreat = "maple syrup cookie";
                var CookieMessage = `Giving a maple syrup cookie to ${taggedUser.username}`;
                var CookieImage = "https://www.thegreatcanadiangiftcompany.com/assets/images/maplecreamcookiesbulkfour.jpg";
            }else if(taggedUser.id == "107629325699792896"){
                var CookieTreat = "chocolate chip oatmeal buiscut";
                var CookieMessage = `Giving a chocolate chip oatmeal buiscut to ${taggedUser.username}`;
                var CookieImage = "https://cdn.sallysbakingaddiction.com/wp-content/uploads/2018/05/thick-peanut-butter-oatmeal-chocolate-chip-cookies-6.jpg";
            }else if(taggedUser.id == "215490271415107584"){
                var CookieTreat = "stroopwafel";
                var CookieMessage = `Giving a stroopwafel to ${taggedUser.username}`;
                var CookieImage = "https://cdn.shopify.com/s/files/1/0100/5392/products/StroopiesCircle2_900_d4372e47-6e31-410d-a2c8-cae8d9b01b9d_675x400.progressive.jpg?v=1569895484";
            }else if(taggedUser.id == "210222394458112000"){
                var CookieTreat = "potato";
                var CookieMessage = `Giving a potato to ${taggedUser.username}`;
                var CookieImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/BakedPotatoWithButter.jpg/1200px-BakedPotatoWithButter.jpg";
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
            .setColor(Library.getRandomColor())
            .setTitle(CookieTreat + '!')
            .setDescription(CookieMessage)
            .setThumbnail(CookieImage)
            .setTimestamp()
            .setFooter('Got a '+ CookieTreat +' on ');
        }else{
            var CookieMessage = `No cookies for ${taggedUser.username}`;
            var CookieImage = "https://www.fs.fed.us/sites/default/files/media_wysiwyg/no-cookie-sign.jpg";
            
            var cookieEmbed = new Discord.RichEmbed()
            .setColor(Library.getRandomColor())
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
