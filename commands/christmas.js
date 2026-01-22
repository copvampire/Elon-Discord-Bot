/*
The CHRISTMAS command is used to display the countdown to christmas
*/
const { EmbedBuilder } = require("discord.js");

exports.run = (client, message, args, level) => {

  var now = new Date();
  // v14/Standard Fix: Use setFullYear instead of setYear
  var countDownDate = new Date( "25 Dec 20 00:00:00 GMT" ).setFullYear(now.getFullYear());

  var GMT = new Date( new Date().toLocaleString( "en-US", {
    timeZone: "Europe/London"
  } ) );
  var CET = new Date( new Date().toLocaleString( "en-US", {
    timeZone: "Europe/Luxembourg"
  } ) );
  var EST = new Date( new Date().toLocaleString( "en-US", {
    timeZone: "America/New_York"
  } ) );
  var AST = new Date( new Date().toLocaleString( "en-US", {
    timeZone: "America/Moncton"
  } ) );
  var PST = new Date( new Date().toLocaleString( "en-US", {
    timeZone: "America/Los_Angeles"
  } ) );
  var MST = new Date( new Date().toLocaleString( "en-US", {
    timeZone: "America/Denver"
  } ) );

  var GMTdistance = countDownDate - GMT;

  var GMTdays = Math.floor( GMTdistance / (1000 * 60 * 60 * 24) );
  var GMThours = Math.floor( (GMTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
  var GMTminutes = Math.floor( (GMTdistance % (1000 * 60 * 60)) / (1000 * 60) );
  var GMTseconds = Math.floor( (GMTdistance % (1000 * 60)) / 1000 );
  var GMTmilliseconds = Math.floor( GMTdistance % (1000 * 60 / 1000) );

  var CETdistance = countDownDate - CET;

  var CETdays = Math.floor( CETdistance / (1000 * 60 * 60 * 24) );
  var CEThours = Math.floor( (CETdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
  var CETminutes = Math.floor( (CETdistance % (1000 * 60 * 60)) / (1000 * 60) );
  var CETseconds = Math.floor( (CETdistance % (1000 * 60)) / 1000 );
  var CETmilliseconds = Math.floor( CETdistance % (1000 * 60 / 1000) );

  var ESTdistance = countDownDate - EST;

  var ESTdays = Math.floor( ESTdistance / (1000 * 60 * 60 * 24) );
  var ESThours = Math.floor( (ESTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
  var ESTminutes = Math.floor( (ESTdistance % (1000 * 60 * 60)) / (1000 * 60) );
  var ESTseconds = Math.floor( (ESTdistance % (1000 * 60)) / 1000 );
  var ESTmilliseconds = Math.floor( ESTdistance % (1000 * 60 / 1000) );

  var ASTdistance = countDownDate - AST;

  var ASTdays = Math.floor( ASTdistance / (1000 * 60 * 60 * 24) );
  var ASThours = Math.floor( (ASTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
  var ASTminutes = Math.floor( (ASTdistance % (1000 * 60 * 60)) / (1000 * 60) );
  var ASTseconds = Math.floor( (ASTdistance % (1000 * 60)) / 1000 );
  var ASTmilliseconds = Math.floor( ASTdistance % (1000 * 60 / 1000) );

  var PSTdistance = countDownDate - PST;

  var PSTdays = Math.floor( PSTdistance / (1000 * 60 * 60 * 24) );
  var PSThours = Math.floor( (PSTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
  var PSTminutes = Math.floor( (PSTdistance % (1000 * 60 * 60)) / (1000 * 60) );
  var PSTseconds = Math.floor( (PSTdistance % (1000 * 60)) / 1000 );
  var PSTmilliseconds = Math.floor( PSTdistance % (1000 * 60 / 1000) );

  var MSTdistance = countDownDate - MST;

  var MSTdays = Math.floor( MSTdistance / (1000 * 60 * 60 * 24) );
  var MSThours = Math.floor( (MSTdistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
  var MSTminutes = Math.floor( (MSTdistance % (1000 * 60 * 60)) / (1000 * 60) );
  var MSTseconds = Math.floor( (MSTdistance % (1000 * 60)) / 1000 );
  var MSTmilliseconds = Math.floor( MSTdistance % (1000 * 60 / 1000) );

  var CountdownMessage = new EmbedBuilder()
      .setColor("Random")
      .setTitle( ':snowflake: :snowflake: Christmas countdown!! :snowflake: :snowflake:' )
      .setDescription( ':snowflake: :snowflake: :snowflake: :snowflake: :snowflake::snowflake::snowflake::snowflake: :snowflake: :snowflake: :snowflake: :snowflake:' )
      .addFields(
          { name: ':christmas_tree: Europe', value: 'Timezones for Europe' },
          { name: 'CET', value: 
             "There are " +
             CETdays + " days, " +
             CEThours + " hours, " +
             CETminutes + " minutes, " +
             CETseconds + " seconds, " +
             CETmilliseconds + " milliseconds, " +
             " until christmas in the CET timezone", inline: true },
          { name: 'GMT', value: 
             "There are " +
             GMTdays + " days, " +
             GMThours + " hours, " +
             GMTminutes + " minutes, " +
             GMTseconds + " seconds, " +
             GMTmilliseconds + " milliseconds, " +
             " until christmas in the GMT timezone", inline: true },
          { name: ':christmas_tree: America', value: 'Timezones for the Americas' },
          { name: 'AST', value: 
             "There are " +
             ASTdays + " days, " +
             ASThours + " hours, " +
             ASTminutes + " minutes, " +
             ASTseconds + " seconds, " +
             ASTmilliseconds + " milliseconds, " +
             " until christmas in the AST timezone", inline: true },
          { name: 'EST', value: 
             "There are " +
             ESTdays + " days, " +
             ESThours + " hours, " +
             ESTminutes + " minutes, " +
             ESTseconds + " seconds, " +
             ESTmilliseconds + " milliseconds, " +
             " until christmas in the EST timezone", inline: true },
          { name: 'MST', value: 
             "There are " +
             MSTdays + " days, " +
             MSThours + " hours, " +
             MSTminutes + " minutes, " +
             MSTseconds + " seconds, " +
             MSTmilliseconds + " milliseconds, " +
             " until christmas in the MST timezone", inline: true },
          { name: 'PST', value: 
             "There are " +
             PSTdays + " days, " +
             PSThours + " hours, " +
             PSTminutes + " minutes, " +
             PSTseconds + " seconds, " +
             PSTmilliseconds + " milliseconds, " +
             " until christmas in the PST timezone", inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Completed on' });

  message.channel.send({ embeds: [CountdownMessage] });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["cc", "christmas", "countdown", "christmas-countdown"],
  permLevel: "User"
};

exports.help = {
  name: "christmas",
  category: "Fun",
  description: "Displays countdown to Christmas.",
  usage: "christmas"
};