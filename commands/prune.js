module.exports = {
    name: 'prune',
    description: 'deleted specified number of messages',
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);

        const amount = parseInt(args[0]) + 1;
        if (message.member.roles.has(Role.id)) {
            if (isNaN(amount)) {
                return message.reply('That doesn\'t seem to be a valid number!');
            } else if (amount <= 1 || amount >= 99) {
                return message.reply('You need to input a number between 1 and 99.');
            }

            message.channel.bulkDelete(amount, true).catch(err => {
                console.log(err);
                message.channel.send('There was an error trying to prune messages in this channel!');
            });
        }else{
            message.channel.send('You need more permissions to do this command!');
        }
    },
};