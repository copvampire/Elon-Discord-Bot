const Discord = require('discord.js');
const dataFile = require('./data.json');
const config = require('./config.json');

module.exports = {

    getRandomColor: getRandomColor,
    getRandomNumber: getRandomNumber,
    getCDMessages: getCDMessages,
    getStartQuizMessage: getStartQuizMessage,
    getEndQuizMessage: getEndQuizMessage,
    getCorrectQuizMessage: getCorrectQuizMessage,
    getWrongQuizMessage: getWrongQuizMessage

}

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getRandomNumber(length) {

        // var SelectedQuestion = length * Math.random() << 0;
        var SelectedQuestion = Math.floor((Math.random() * parseInt(length)) + 1);

        return SelectedQuestion;
    }
    
    function getCDMessages() {

        var countDownDate = new Date(dataFile[config.serverID]["Settings"].Countdown).getTime();

        var GMT = new Date(new Date().toLocaleString("en-US", {
            timeZone: "Europe/London"
        }));
        var CET = new Date(new Date().toLocaleString("en-US", {
            timeZone: "Europe/Luxembourg"
        }));
        var EST = new Date(new Date().toLocaleString("en-US", {
            timeZone: "America/New_York"
        }));
        var AST = new Date(new Date().toLocaleString("en-US", {
            timeZone: "America/Moncton"
        }));
        var PST = new Date(new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        }));
        var MST = new Date(new Date().toLocaleString("en-US", {
            timeZone: "America/Denver"
        }));

        var GMTdistance = countDownDate - GMT;

        var GMTdays = Math.floor(GMTdistance / (1000 * 60 * 60 * 24));
        var GMThours = Math.floor((GMTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var GMTminutes = Math.floor((GMTdistance % (1000 * 60 * 60)) / (1000 * 60));
        var GMTseconds = Math.floor((GMTdistance % (1000 * 60)) / 1000);
        var GMTmilliseconds = Math.floor(GMTdistance % (1000 * 60 / 1000));

        var CETdistance = countDownDate - CET;

        var CETdays = Math.floor(CETdistance / (1000 * 60 * 60 * 24));
        var CEThours = Math.floor((CETdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var CETminutes = Math.floor((CETdistance % (1000 * 60 * 60)) / (1000 * 60));
        var CETseconds = Math.floor((CETdistance % (1000 * 60)) / 1000);
        var CETmilliseconds = Math.floor(CETdistance % (1000 * 60 / 1000));

        var ESTdistance = countDownDate - EST;

        var ESTdays = Math.floor(ESTdistance / (1000 * 60 * 60 * 24));
        var ESThours = Math.floor((ESTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var ESTminutes = Math.floor((ESTdistance % (1000 * 60 * 60)) / (1000 * 60));
        var ESTseconds = Math.floor((ESTdistance % (1000 * 60)) / 1000);
        var ESTmilliseconds = Math.floor(ESTdistance % (1000 * 60 / 1000));

        var ASTdistance = countDownDate - AST;

        var ASTdays = Math.floor(ASTdistance / (1000 * 60 * 60 * 24));
        var ASThours = Math.floor((ASTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var ASTminutes = Math.floor((ASTdistance % (1000 * 60 * 60)) / (1000 * 60));
        var ASTseconds = Math.floor((ASTdistance % (1000 * 60)) / 1000);
        var ASTmilliseconds = Math.floor(ASTdistance % (1000 * 60 / 1000));

        var PSTdistance = countDownDate - PST;

        var PSTdays = Math.floor(PSTdistance / (1000 * 60 * 60 * 24));
        var PSThours = Math.floor((PSTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var PSTminutes = Math.floor((PSTdistance % (1000 * 60 * 60)) / (1000 * 60));
        var PSTseconds = Math.floor((PSTdistance % (1000 * 60)) / 1000);
        var PSTmilliseconds = Math.floor(PSTdistance % (1000 * 60 / 1000));

        var MSTdistance = countDownDate - MST;

        var MSTdays = Math.floor(MSTdistance / (1000 * 60 * 60 * 24));
        var MSThours = Math.floor((MSTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var MSTminutes = Math.floor((MSTdistance % (1000 * 60 * 60)) / (1000 * 60));
        var MSTseconds = Math.floor((MSTdistance % (1000 * 60)) / 1000);
        var MSTmilliseconds = Math.floor(MSTdistance % (1000 * 60 / 1000));

        var CountdownMessage = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle(':snowflake: :snowflake: Christmas countdown!! :snowflake: :snowflake:')
            .setDescription(`If you want one added, just ask Copvampire`)
            .addField(':christmas_tree: Europe', 'Timezones for Europe')
            .addField('GMT',
                "There are " +
                GMTdays + " days, " +
                GMThours + " hours, " +
                GMTminutes + " minutes, " +
                GMTseconds + " seconds, " +
                GMTmilliseconds + " milliseconds, " +
                " until christmas in the GMT timezone", true)
            .addField('CET',
                "There are " +
                CETdays + " days, " +
                CEThours + " hours, " +
                CETminutes + " minutes, " +
                CETseconds + " seconds, " +
                CETmilliseconds + " milliseconds, " +
                " until christmas in the CET timezone", true)
            .addBlankField()
            .addField(':christmas_tree: America', 'Timezones for the Americas')
            .addField('EST',
                "There are " +
                ESTdays + " days, " +
                ESThours + " hours, " +
                ESTminutes + " minutes, " +
                ESTseconds + " seconds, " +
                ESTmilliseconds + " milliseconds, " +
                " until christmas in the EST timezone", true)
            .addField('AST',
                "There are " +
                ASTdays + " days, " +
                ASThours + " hours, " +
                ASTminutes + " minutes, " +
                ASTseconds + " seconds, " +
                ASTmilliseconds + " milliseconds, " +
                " until christmas in the AST timezone", true)
            .addField('PST',
                "There are " +
                PSTdays + " days, " +
                PSThours + " hours, " +
                PSTminutes + " minutes, " +
                PSTseconds + " seconds, " +
                PSTmilliseconds + " milliseconds, " +
                " until christmas in the PST timezone", true)
            .addField('MST',
                "There are " +
                MSTdays + " days, " +
                MSThours + " hours, " +
                MSTminutes + " minutes, " +
                MSTseconds + " seconds, " +
                MSTmilliseconds + " milliseconds, " +
                " until christmas in the MST timezone", true)
            .setTimestamp()
            .setFooter('Completed on');

        return CountdownMessage;
    }
    
    function getStartQuizMessage(QuestionData, TimeToAnswer) {

        var TimeMessage = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("You have "+TimeToAnswer+" seconds to answer:")
            .addField('How to answer', "!quiz <A/B/C/D>")
            .setDescription(QuestionData.Question)
            .addField("=-=-=-=-=-=", 'A: ' + QuestionData.Options.A)
            .addField("=-=-=-=-=-=", 'B: ' + QuestionData.Options.B)
            .addField("=-=-=-=-=-=", 'C: ' + QuestionData.Options.C)
            .addField("=-=-=-=-=-=", 'D: ' + QuestionData.Options.D)
            .setTimestamp()
            .setFooter('Asked on');

        return TimeMessage;
    }
    function getEndQuizMessage() {

        var TimeMessage = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("Question ended")
            .setTimestamp()
            .setFooter('Closed on');

        return TimeMessage;
    }
    function getCorrectQuizMessage(UserData) {

        var TimeMessage = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("Look who is smart! You got it right!")
            .setDescription("Stats: ")
            .addField('Correct', UserData.Correct)
            .addField('Wrong', UserData.Wrong)
            .setTimestamp()
            .setFooter('Started on');

        return TimeMessage;
    }
    function getWrongQuizMessage(UserData) {

        var TimeMessage = new Discord.RichEmbed()
            .setColor(getRandomColor())
            .setTitle("Sorry dumbass, but you were wrong!")
            .setDescription("Stats: ")
            .addField('Correct', UserData.Correct)
            .addField('Wrong', UserData.Wrong)
            .setTimestamp()
            .setFooter('Asked on');

        return TimeMessage;
    }