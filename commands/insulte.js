const request = require('superagent');

module.exports = {
    name: 'insulte',
    description: 'Typo much?!?!?!',
    cooldown: 1,
    execute(client, config, dataFile, message, args) {

            request.get('http://quandyfactory.com/insult/json/')
            .end((err, res) => {
                if (!err && res.status === 200) {
                    const fancyinsult = res.body;
                    message.channel.send(`${message.author}, ${fancyinsult.insult}`);
                } 
                else {
                    console.log(`REST call failed: ${err}`)
                }
            });
    },
};