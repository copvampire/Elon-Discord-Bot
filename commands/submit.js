module.exports = {
    name: 'submit',
    description: 'Submit a game code to the giveaway',
    execute(client, config, dataFile, message, args) {
        if (message.channel.type == 'dm') {
            if (args[0]) {

                const taggedUser = message.author.id;
                const Code = args[0];

                if (!dataFile[config.serverID]["Submitted_Codes"][Code]) {
        
                    dataFile[config.serverID]["Submitted_Codes"][Code] = {
                        Submitter: taggedUser
                    }
        
                    fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                        if (err) throw err;
                    });
                    message.channel.send('Code Submitted!');
                }else{
                    message.channel.send('Code has already been submitted!');
                }
            }else{
                message.channel.send('You forgot the code! !submit <code>');
            }

        }else{
            message.channel.send('Submit the code in dms!');
        }
    },
};