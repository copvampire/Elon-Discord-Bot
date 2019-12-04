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

                for (key in obj["Questions"]) {
                    if (obj["Questions"].hasOwnProperty(key)) size++;
                }

                // var SelectedQuestion = size * Math.random() << 0;
                var SelectedQuestion = Library.getRandomNumber(parseInt(size));
                
                // message.channel.send(SelectedQuestion + "=-=" + parseInt(size) + "=-=" + size);
                
                var Question_String = obj["Questions"][SelectedQuestion].Question;
                var Question_Length = Question_String.length;

                var Question_Fitted = Math.floor(Question_Length / 10);

                var Question_Added = Question_Fitted * 10000;

                message.channel.sendEmbed(Library.getStartQuizMessage(obj["Questions"][SelectedQuestion], 30 + Question_Fitted))
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


                }, 30000 + Question_Added);
            }else{
                message.channel.send('You need more permissions to do this command!');
            }
        }

    },
};