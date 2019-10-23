module.exports = {
    name: 'penis',
    cooldown: 5,
    description: 'Get the size of your penis!',
    execute(client, config, dataFile, message, args) {
        const fs = require('fs');

        if (!message.mentions.users.size) {
            var taggedUser = message.author;
        }
        else {
            // grab the "first" mentioned user from the message
            // this will return a `User` object, just like `message.author`
            var taggedUser = message.mentions.users.first();
        }

        if (!dataFile["Penis_Lengths"][taggedUser.id]) {
            var penisMeassurements = ['Inches', 'Foot', 'cm', 'mm'];  
            var penisMeassure = penisMeassurements[Math.floor(Math.random() * penisMeassurements.length)];
            var penisNumber = Math.random() * (10 - 0) + 0;
            var penisSize = Math.round(penisNumber);

            if (!dataFile["Penis_Lengths"]) dataFile["Penis_Lengths"] = {};

            dataFile["Penis_Lengths"][taggedUser.id] = {
                Length: penisSize,
                Measure: penisMeassure
            }

            fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                if (err) throw err;
            });

        }else{
            var penisSize = dataFile["Penis_Lengths"][taggedUser.id].Length;
            var penisMeassure = dataFile["Penis_Lengths"][taggedUser.id].Measure;
        }

        message.channel.send(`${taggedUser.username}'s penis: ` + penisSize + ` ` + penisMeassure);

    },
};
