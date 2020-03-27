const got = require('got');
const Discord = require('discord.js');
const Library = require('../Lib.js');

module.exports = {
    name: 'iss',
    description: 'gives info of the ISS',
    execute(client, config, dataFile, message, args) {

        got('http://api.open-notify.org/iss-now.json', { json: true }).then(info => {
            const embed = new Discord.RichEmbed();
            embed.setColor(Library.getRandomColor())
            embed.setTitle(`:satellite_orbital: ISS Info :satellite_orbital:`)

            let longitude = info.body.iss_position.longitude;
            let latitude = info.body.iss_position.latitude;
            embed.addField(`Location of the ISS:`, `${longitude}, ${latitude}`);
        
            got('http://api.open-notify.org/astros.json', { json: true }).then(occupants => {
                let people = occupants.body.people;
                let name_list = "";

                for (i = 0; i < people.length; i++) {
                    if (people[i].craft == "ISS") {
                        name_list += (i + 1) + ". " + people[i].name + "\n";
                    }
                }
                
                embed.addField(`Occupants:`, `${name_list}`)
                embed.setImage('https://fm.cnbc.com/applications/cnbc.com/resources/img/editorial/2019/04/03/105831250-iss.1910x1000.jpg');
                embed.setTimestamp()
                embed.setFooter("Searched on");
                message.channel.send(embed);

                // embed.setTitle(`:satellite_orbital: ISS Info :satellite_orbital:`)
                // embed.addField(`Location of the ISS:`, `${longitude}, ${latitude}`);

                // console.log('Bot responded with: ' + memeImage);
            }).catch(console.error);

            // console.log('Bot responded with: ' + memeImage);

        }).catch(console.error);


    },
};