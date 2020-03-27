const Library = require('../Lib.js');
const questionsFile = require('../questions.json');
const fs = require('fs');

module.exports = {
    name: 'startquiz',
    cooldown: 30,
    description: 'Start quiz with a question from a topic: tech, cars, science, or enter no topic for a random one',
    execute(client, config, dataFile, message, args) {
        var Role = message.guild.roles.find(Role => Role.name === config.modrank);

        var TopicArray = [
            "tech",
            "cars",
            "science"
          ];

        if(dataFile[config.serverID]["Settings"]["Quiz"].Active == "false"){
            
            if (message.member.roles.has(Role.id)) {

                if(args[0]){
                    switch(args[0].toLowerCase()) {
                        case "tech":
                            var ChosenTopic = "tech";
                            var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs;
                          break;
                        case "cars":
                            var ChosenTopic = "cars";
                            var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs;
                          break;
                        case "science":
                            var ChosenTopic = "science";
                            var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs;
                          break;
                        default:
                            var ChosenTopic = TopicArray[Math.floor(Math.random()*TopicArray.length)];

                            if(ChosenTopic == "tech"){
                                var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs;

                            }else if(ChosenTopic == "cars"){
                                var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs;

                            }else if(ChosenTopic == "science"){
                                var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs;

                            }
                      }
                }else{
                    var ChosenTopic = TopicArray[Math.floor(Math.random()*TopicArray.length)];

                    if(ChosenTopic == "tech"){
                        var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs;

                    }else if(ChosenTopic == "cars"){
                        var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs;

                    }else if(ChosenTopic == "science"){
                        var Topic_Runs = dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs;

                    }
                }

                var size = 0;
                var selected_Question = "false";

                for (key in questionsFile[ChosenTopic]["Questions"]) {
                    if (questionsFile[ChosenTopic]["Questions"].hasOwnProperty(key)) size++;
                }

                // var SelectedQuestion = size * Math.random() << 0;
                // var SelectedQuestion = Library.getRandomNumber(parseInt(size));
                
                // message.channel.send(SelectedQuestion + "=-=" + parseInt(size) + "=-=" + size);


                while (selected_Question == "false") {
                    var SelectedQuestion = Library.getRandomNumber(parseInt(size));
                    
                    if(questionsFile[ChosenTopic]["Questions"][SelectedQuestion].Ran <= Math.floor(Topic_Runs / size)){

                        var Question_String = questionsFile[ChosenTopic]["Questions"][SelectedQuestion].Question;
                        var NewCount = questionsFile[ChosenTopic]["Questions"][SelectedQuestion].Ran + 1;

                        questionsFile[ChosenTopic]["Questions"][SelectedQuestion] = {
                            Question: questionsFile[ChosenTopic]["Questions"][SelectedQuestion].Question,
                            Options: {
                                A: questionsFile[ChosenTopic]["Questions"][SelectedQuestion]["Options"].A,
                                B: questionsFile[ChosenTopic]["Questions"][SelectedQuestion]["Options"].B,
                                C: questionsFile[ChosenTopic]["Questions"][SelectedQuestion]["Options"].C,
                                D: questionsFile[ChosenTopic]["Questions"][SelectedQuestion]["Options"].D
                            },
                            Answer: questionsFile[ChosenTopic]["Questions"][SelectedQuestion].Answer,
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

                message.channel.sendEmbed(Library.getStartQuizMessage(questionsFile[ChosenTopic]["Questions"][SelectedQuestion], ChosenTopic, 30 + Question_Fitted))
                .then(sent => {

                    dataFile[config.serverID]["Settings"]["Quiz"] = {
                        Active: "true",
                        Tech_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs,
                        Car_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs,
                        Science_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs,
                        SelectedTopic: ChosenTopic,
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

                    message.channel.fetchMessage(dataFile[config.serverID]["Settings"]["Quiz"].Message_ID).then(messagea => {
                        // messagea.delete();
                        messagea.edit(Library.getEndQuizMessage());
                        return;
                    })

                    if(ChosenTopic == "tech"){
                        var NewQuizCount = dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs + 1;

                        dataFile[config.serverID]["Settings"]["Quiz"] = {
                            Tech_Runs: NewQuizCount,
                            Car_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs,
                            Science_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs,
                            Active: "false"
                        }

                    }else if(ChosenTopic == "car"){
                        var NewQuizCount = dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs + 1;

                        dataFile[config.serverID]["Settings"]["Quiz"] = {
                            Tech_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs,
                            Car_Runs: NewQuizCount,
                            Science_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs,
                            Active: "false"
                        }
                    }else{
                        var NewQuizCount = dataFile[config.serverID]["Settings"]["Quiz"].Science_Runs + 1;

                        dataFile[config.serverID]["Settings"]["Quiz"] = {
                            Tech_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Tech_Runs,
                            Car_Runs: dataFile[config.serverID]["Settings"]["Quiz"].Car_Runs,
                            Science_Runs: NewQuizCount,
                            Active: "false"
                        }

                    }
                    
                    // dataFile[config.serverID]["Settings"]["Quiz"] = {
                    //     Runs: NewQuizCount,
                    //     Active: "false"
                    // }
        
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