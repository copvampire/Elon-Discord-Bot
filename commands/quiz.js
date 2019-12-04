const Library = require('../Lib.js');
const fs = require('fs');
module.exports = {
    name: 'quiz',
    description: 'Get a tech question',
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);
        var obj = dataFile["Quiz"];

        if(obj["Settings"].Active == "false"){
            
            if (message.member.roles.has(Role.id)) {
                var size = 0;

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }

                // var SelectedQuestion = size * Math.random() << 0;
                var SelectedQuestion = Library.getRandomNumber(size);

                message.channel.sendEmbed(Library.getStartQuizMessage(obj["Questions"][SelectedQuestion]))
                .then(sent => {

                    dataFile["Quiz"]["Settings"] = {
                        Active: "true",
                        SelectedQuestion: SelectedQuestion,
                        Message_ID: sent.id
                    }

                    fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                        if (err) throw err;
                    });
                    
                });

                setTimeout(function(){
                    // channel.fetchMessage(dataFile["Quiz"]["Settings"].Message_ID).then(msg => msg.delete());
                    // message.channel.messages.fetch(dataFile["Quiz"]["Settings"].Message_ID).edit("Closed");

                    message.channel.fetchMessage(dataFile["Quiz"]["Settings"].Message_ID).then(messagea => {
                        // messagea.delete();
                        messagea.edit(Library.getEndQuizMessage());
                        return;
                    })
                    

                    dataFile["Quiz"]["Settings"] = {
                        Active: "false"
                    }
        
                    fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                        if (err) throw err;
                    });


                }, 30000);
            }else{
                message.channel.send('You need more permissions to do this command!');
            }


        }else{
            // message.channel.send("Quiz Started!");

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
                        if (message.channel.type == 'dm') return;
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
                        return;
                    })

                    dataFile["Quiz"]["Settings"] = {
                        Active: "false"
                    }
            
                    fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                        if (err) throw err;
                    });

                }else{
                    message.channel.send('You need more permissions to do this command!');
                }
            }
        }

    },
};