// require the discord.js module
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const datafile = require('./data.json');
const chalk = require('chalk');

// create a new discord client
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFlies = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFlies) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported value
    client.commands.set(command.name, command);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// when the client is ready, run this code
// this event will trigger whenever your bot:
// - finishes logging in
// - reconnects after disconnecting
client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity(config.game);

    var startMessage = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle('I have arrived!!')
        .setDescription(`:rocket: :rocket: :rocket:`)
        .setTimestamp()
        .setFooter('Started on');

    client.channels.find("name", "bot-test").sendEmbed(startMessage);


});

client.on("guildMemberAdd", function (member) {

    var welcomeMessage = new Discord.RichEmbed()
        .setColor(getRandomColor())
        .setTitle('Member Joined!!')
        .setDescription(`:rocket: :rocket: Welcome ${member}!! Together we shall woreship our beloved leader Elon Musk!! :rocket: :rocket:`)
        .setThumbnail('http://www.gstatic.com/tv/thumb/persons/487130/487130_v9_ba.jpg')
        .setTimestamp()
        .setFooter('Became a follower on');

        setTimeout(function () {
            member.guild.channels.find("name", "welcome").sendEmbed(welcomeMessage);
        }, 250);

    // member.guild.channels.find("name", "welcome").sendMessage(`:rocket: :rocket: Welcome ${member}!! Together we shall woreship our beloved leader Elon Musk!! :rocket: :rocket:  `);
});

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('raw', async event => {
	if (!events.hasOwnProperty(event.t)) return;

	const { d: data } = event;
	const user = client.users.get(data.user_id);
	const channel = client.channels.get(data.channel_id) || await user.createDM();

	if (channel.messages.has(data.message_id)) return;

	const message = await channel.messages.fetch(data.message_id);
	const emojiKey = data.emoji.id || data.emoji.name;
	const reaction = message.reactions.get(emojiKey) || message.reactions.add(data);

	client.emit(events[event.t], reaction, user);
	if (message.reactions.size === 1) message.reactions.delete(emojiKey);
});

client.on('messageReactionAdd', (reaction, user) => {
	console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

client.on('messageReactionRemove', (reaction, user) => {
	console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
});

client.on('message', message => {

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
                    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.replay('I can\'t execute the command inside DMS!');
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command. `);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    try {
        command.execute(client, config, datafile, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute the command!');
    }
});

// login to Discord with your app's token
client.login(config.token);
