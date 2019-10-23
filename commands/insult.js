const request = require('superagent');

module.exports = {
    name: 'insult',
    description: 'insults the tagged user or the message sender if no one is tagged',
    cooldown: 3,
    execute(client, config, dataFile, message, args) {
        const user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.guild.members.get(message.author.id);

        if(user.id !== "338824439842078720"){
            request.get('http://quandyfactory.com/insult/json/')
            .end((err, res) => {
                if (!err && res.status === 200) {
                    const fancyinsult = res.body;
                    message.channel.send(`${user}, ${fancyinsult.insult}`);
                } 
                else {
                    console.log(`REST call failed: ${err}`)
                }
            });
        }else{
            request.get('https://complimentr.com/api')
            .end((err, res) => {
                if (!err && res.status === 200) {
                    const fancycompliment = res.body;
                    message.channel.send(`${user}, ${fancycompliment.compliment}`);
                } 
                else {
                    console.log(`REST call failed: ${err}`)
                }
            });
        }
    },
};