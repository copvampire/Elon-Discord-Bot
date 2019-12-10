const Library = require('../Lib.js');
const fs = require('fs');
module.exports = {
    name: 'startquiz',
    cooldown: 30,
    description: 'Start a tech question',
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);
        var obj = dataFile["Quiz"];


        if(obj["Settings"].Active == "false"){
            
            if (message.member.roles.has(Role.id)) {
                var size = 0;
                var selected_Question = "false";

                for (key in obj["Questions"]) {
                    if (obj["Questions"].hasOwnProperty(key)) size++;
                }

                // var SelectedQuestion = size * Math.random() << 0;
                // var SelectedQuestion = Library.getRandomNumber(parseInt(size));
                
                // message.channel.send(SelectedQuestion + "=-=" + parseInt(size) + "=-=" + size);


                while (selected_Question == "false") {
                    var SelectedQuestion = Library.getRandomNumber(parseInt(size));
                    
                    if(obj["Questions"][SelectedQuestion].Ran <= Math.floor(obj["Settings"].Runs / size)){

                        var Question_String = obj["Questions"][SelectedQuestion].Question;
                        var NewCount = obj["Questions"][SelectedQuestion].Ran + 1;

                        dataFile["Quiz"]["Questions"][SelectedQuestion] = {
                            Question: obj["Questions"][SelectedQuestion].Question,
                            Options: {
                                A: obj["Questions"][SelectedQuestion]["Options"].A,
                                B: obj["Questions"][SelectedQuestion]["Options"].B,
                                C: obj["Questions"][SelectedQuestion]["Options"].C,
                                D: obj["Questions"][SelectedQuestion]["Options"].D
                            },
                            Answer: obj["Questions"][SelectedQuestion].Answer,
                            Ran: NewCount
                        }

                        fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                            if (err) throw err;
                        });

                        var selected_Question = "true";
                    }
                }

                var Question_Length = Question_String.length;
                var Question_Fitted = Math.floor(Question_Length / 10);

                var Question_Added = Question_Fitted * 1000;

                message.channel.sendEmbed(Library.getStartQuizMessage(obj["Questions"][SelectedQuestion], 30 + Question_Fitted))
                .then(sent => {

                    dataFile[config.serverID]["Quiz"] = {
                        Active: "true",
                        Runs: dataFile[config.serverID]["Quiz"].Runs,
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

                    message.channel.fetchMessage(dataFile[config.serverID]["Quiz"].Message_ID).then(messagea => {
                        // messagea.delete();
                        messagea.edit(Library.getEndQuizMessage());
                        return;
                    })
                    var NewQuizCount = dataFile[config.serverID]["Quiz"].Runs + 1;
                    
                    dataFile[config.serverID]["Quiz"] = {
                        Runs: NewQuizCount,
                        Active: "false"
                    }
        
                    fs.writeFile("./data.json", JSON.stringify(dataFile, null, 4), err => {
                        if (err) throw err;
                    });


                }, 30000 + Question_Added);
            }else{
                message.channel.send('You need more permissions to do this command!');
            }
        }

    },
};