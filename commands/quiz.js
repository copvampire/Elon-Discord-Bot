const Library = require('../Lib.js');
const fs = require('fs');
module.exports = {
    name: 'quiz',
    cooldown: 30,
    description: 'Answer a tech question',
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);
        var obj = dataFile["Quiz"];

        if(obj["Settings"].Active == "true"){
            if(args[0]){
                if(args[0] !== "stop"){
                    var SelectedQuestion = dataFile["Quiz"]["Settings"].SelectedQuestion;
                    if(args[0].toUpperCase() == obj["Questions"][SelectedQuestion].Answer){
                        
                        if (!dataFile[config.serverID]["Quiz_Scores"][message.author.id]) {
                            var CorrectAnswers = 1;
                            var WrongAnswers = 0;
                        }else{
                            var CorrectAnswers = dataFile[config.serverID]["Quiz_Scores"][message.author.id].Correct + 1;
                            var WrongAnswers = dataFile[config.serverID]["Quiz_Scores"][message.author.id].Wrong;
                        }
                        
                        dataFile[config.serverID]["Quiz_Scores"][message.author.id] = {
                            Correct: CorrectAnswers,
                            Wrong: WrongAnswers
                        }
        
                        fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                            if (err) throw err;
                        });

                        message.author.sendEmbed(Library.getCorrectQuizMessage(dataFile[config.serverID]["Quiz_Scores"][message.author.id]))
                        .then(() => {
                            message.delete();
                            if (message.channel.type == 'dm') return;
                            message.reply('I\'ve sent you your results!');
                        })
                        .catch(error => {
                            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                            message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                        });

                    }else{

                        if (!dataFile[config.serverID]["Quiz_Scores"][message.author.id]) {
                            var CorrectAnswers = 0;
                            var WrongAnswers = 1;
                        }else{
                            var CorrectAnswers = dataFile[config.serverID]["Quiz_Scores"][message.author.id].Correct;
                            var WrongAnswers = dataFile[config.serverID]["Quiz_Scores"][message.author.id].Wrong + 1;
                        }

                        dataFile[config.serverID]["Quiz_Scores"][message.author.id] = {
                            Correct: CorrectAnswers,
                            Wrong: WrongAnswers
                        }
        
                        fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                            if (err) throw err;
                        });

                        message.author.sendEmbed(Library.getWrongQuizMessage(dataFile[config.serverID]["Quiz_Scores"][message.author.id]))
                        .then(() => {
                            message.delete();
                            if (message.channel.type == 'dm') return;
                            message.reply('I\'ve sent you your results!');
                        })
                        .catch(error => {
                            console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                            message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                        });

                    }
                    
                }else{
                    
                    if (message.member.roles.has(Role.id)) {
                        message.channel.fetchMessage(dataFile["Quiz"]["Settings"].Message_ID).then(messagea => {
                            // messagea.delete();
                            messagea.edit(Library.getEndQuizMessage());

                            dataFile["Quiz"]["Settings"] = {
                                Runs: dataFile["Quiz"]["Settings"].Runs,
                                Active: "false"
                            }
                    
                            fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                                if (err) throw err;
                            });
                        
                        return;
                        
                    })

                    }else{
                        message.channel.send('You need more permissions to do this command!');
                    }
                }
            }
        }else{
            message.channel.send('Too slow, no quiz going on at the moment!');
        }

    },
};