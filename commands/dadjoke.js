const got = require('got');
module.exports = {
    name: 'dadjoke',
    desciprtion: 'tells a dad joke',
    execute(client, config, dataFile, message, args) {

        got('https://www.reddit.com/r/dadjokes/random/.json').then(response => {
            let content = JSON.parse(response.body);
            var title = content[0].data.children[0].data.title;
            var joke = content[0].data.children[0].data.selftext;
            message.channel.send('**' + title + '**');
            message.channel.send(joke)
                .then(sent => console.log(`Sent a reply to ${message.author}`))
        }).catch(console.error);
    }

}