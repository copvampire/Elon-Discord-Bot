//https://discordapp.com/oauth2/authorize?client_id=338824439842078720&scope=bot&permissions=2146958847

// require the discord.js module
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const dataFile = require('./data.json');

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

if (!dataFile[config.serverID]) dataFile[config.serverID] = {};

fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
    if (err) throw err;
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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

    const eventName = event.t;

    if(eventName === 'MESSAGE_REACTION_ADD'){
        if(event.d.message_id === '636701061473632266'){
            var reactionChannel = client.channels.get(event.d.channel_id);
            if(reactionChannel.messages.has(event.d.message_id))
                return;
            else{
                reactionChannel.fetchMessage(event.d.message_id)
                .then(msg => {
                    var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
                    var user = client.users.get(event.d.user_id);
                    client.emit('messageReactionAdd', msgReaction, user);
                })
                .catch(err => console.log(err));
            }
        }
    }else if(eventName === 'MESSAGE_REACTION_REMOVE'){
        if(event.d.message_id === '636701061473632266'){
            var reactionChannel = client.channels.get(event.d.channel_id);
            if(reactionChannel.messages.has(event.d.message_id)) 
                return;
                else{
                    reactionChannel.fetchMessage(event.d.message_id)
                    .then(msg => {
                        var msgReaction = msg.reactions.get(event.d.emoji.name + ":" + event.d.emoji.id);
                        var user = client.users.get(event.d.user_id);
                        client.emit('messageReactionRemove', msgReaction, user);
                    })
                    .catch(err => console.log(err));
                }


        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    var guild = client.guilds.get(config.serverID);

    //Emoji IDs - Role
    //
    //636699302764216340 - Mclaren_Fanboy
    //636699300918984711 - WMotors_Fanboy
    //636699301052940290 - Mustang_Fanboy
    //636699301321637907 - Tesla_Fanboy
    //636699301397004288 - Fiat_Panda_Fanboy
    //636699301292015616 - Pagani_Fanboy
    //636699301023842354 - Prius_Driver
    //636699301048745996 - Delorean_Fanboy
    //636699301656920064 - Dodge_Fanboy
    //636729384153120768 - Audi_Fanboy


    switch(reaction.emoji.id || reaction.emoji.name) {
        case "636699302764216340":
            var Role = guild.roles.find(role => role.name === "Mclaren_Fanboy");
          break;
        case "636699300918984711":
            var Role = guild.roles.find(role => role.name === "WMotors_Fanboy");
          break;
        case "636699301052940290":
            var Role = guild.roles.find(role => role.name === "Mustang_Fanboy");
          break;
        case "636699301321637907":
            var Role = guild.roles.find(role => role.name === "Tesla_Fanboy");
          break;
        case "636699301397004288":
            var Role = guild.roles.find(role => role.name === "Fiat_Panda_Fanboy");
          break;
        case "636699301292015616":
            var Role = guild.roles.find(role => role.name === "Pagani_Fanboy");
          break;
        case "636699301023842354":
            var Role = guild.roles.find(role => role.name === "Prius_Driver");
          break;
        case "636699301048745996":
            var Role = guild.roles.find(role => role.name === "Delorean_Fanboy");
          break;
        case "636699301656920064":
            var Role = guild.roles.find(role => role.name === "Dodge_Fanboy");
          break;
        case "636729384153120768":
            var Role = guild.roles.find(role => role.name === "Audi_Fanboy");
          break;
        default:
          
            // client.channels.find("name", "bot-test").send(`${user.username} reacted with ` + reaction.emoji.name +` ` + reaction.emoji.id +` ` + reaction.emoji +` reaction.`);
        break;
      }
    var member = reaction.message.guild.members.find(member => member.id === user.id);
    member.addRole(Role).catch(console.error);
});

client.on('messageReactionRemove', (reaction, user) => {
    var guild = client.guilds.get(config.serverID);

    //Emoji IDs - Role
    //
    //636699302764216340 - Mclaren_Fanboy
    //636699300918984711 - WMotors_Fanboy
    //636699301052940290 - Mustang_Fanboy
    //636699301321637907 - Tesla_Fanboy
    //636699301397004288 - Fiat_Panda_Fanboy
    //636699301292015616 - Pagani_Fanboy
    //636699301023842354 - Prius_Driver
    //636699301048745996 - Delorean_Fanboy
    //636699301656920064 - Dodge_Fanboy
    //636729384153120768 - Audi_Fanboy


    switch(reaction.emoji.id || reaction.emoji.name) {
        case "636699302764216340":
            var Role = guild.roles.find(role => role.name === "Mclaren_Fanboy");
          break;
        case "636699300918984711":
            var Role = guild.roles.find(role => role.name === "WMotors_Fanboy");
          break;
        case "636699301052940290":
            var Role = guild.roles.find(role => role.name === "Mustang_Fanboy");
          break;
        case "636699301321637907":
            var Role = guild.roles.find(role => role.name === "Tesla_Fanboy");
          break;
        case "636699301397004288":
            var Role = guild.roles.find(role => role.name === "Fiat_Panda_Fanboy");
          break;
        case "636699301292015616":
            var Role = guild.roles.find(role => role.name === "Pagani_Fanboy");
          break;
        case "636699301023842354":
            var Role = guild.roles.find(role => role.name === "Prius_Driver");
          break;
        case "636699301048745996":
            var Role = guild.roles.find(role => role.name === "Delorean_Fanboy");
          break;
        case "636699301656920064":
            var Role = guild.roles.find(role => role.name === "Dodge_Fanboy");
          break;
        case "636729384153120768":
            var Role = guild.roles.find(role => role.name === "Audi_Fanboy");
          break;
        default:
          
        break;
      }
      var member = reaction.message.guild.members.find(member => member.id === user.id);
      member.removeRole(Role).catch(console.error);
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
        command.execute(client, config, dataFile, message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute the command!');
    }
});

// login to Discord with your app's token
client.login(config.token);
