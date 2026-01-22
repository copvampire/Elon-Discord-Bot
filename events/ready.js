const logger = require("../modules/Logger.js");
const { getSettings } = require("../modules/functions.js");
const schedule = require('node-schedule');
const { EmbedBuilder, ActivityType } = require("discord.js");
const ddns = require("cloudflare-dynamic-dns");

module.exports = async client => {
  // Log that the bot is online.
  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`, "ready");
  
  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${getSettings("default").prefix}help`, { type: ActivityType.Playing });

  const startMessage = new EmbedBuilder()
    .setColor("Random")
    .setTitle('I have arrived!!')
    .setDescription(`:rocket: :rocket: :rocket:`)
    .setImage('https://media1.tenor.com/images/87d25c8ca0434798fb7da4b4f8018256/tenor.gif?itemid=14245777')
    .setTimestamp()
    .setFooter({ text: 'Started on' });

  // Try/Catch to prevent crash if channel is missing
  const startChannel = client.channels.cache.get("338825465768706049");
  if (startChannel) startChannel.send({ embeds: [startMessage] });

  //Cloudflare dns updater event
  var cloudflareDNS = function() {
    var options = {
        auth: {
            email: "willmiles95@yahoo.co.uk",
            key: "54555e8b738e1d1b84401328134e586d3d905"
        },
        recordName: "ip.willdevelops.co.uk",
        zoneName: "willdevelops.co.uk"
    };
    ddns.update(options, function(err, newIp) {
        if (err) {
          logger.log("An error occurred:", "error");
          logger.log(err, "error");
        }
    });
  };

  // December daily update 0 0 1-24 12 *
  schedule.scheduleJob("0 0 1-24 12 *", function () {
    logger.log(`firing event`, "log");

    var now = new Date();
    var countDownDate = new Date( "25 Dec 20 00:00:00 GMT" ).setYear(now.getFullYear());

    // Helper to calculate distance
    const getDist = (timezone) => {
        const d = new Date( new Date().toLocaleString( "en-US", { timeZone: timezone } ) );
        return countDownDate - d;
    };

    const zones = {
        GMT: getDist("Europe/London"),
        CET: getDist("Europe/Luxembourg"),
        EST: getDist("America/New_York"),
        AST: getDist("America/Moncton"),
        PST: getDist("America/Los_Angeles"),
        MST: getDist("America/Denver")
    };

    const format = (dist) => {
        const days = Math.floor( dist / (1000 * 60 * 60 * 24) );
        const hours = Math.floor( (dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
        const minutes = Math.floor( (dist % (1000 * 60 * 60)) / (1000 * 60) );
        const seconds = Math.floor( (dist % (1000 * 60)) / 1000 );
        return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    };

    var CountdownMessage = new EmbedBuilder()
      .setColor("Random")
      .setTitle( ':snowflake: :snowflake: Christmas countdown!! :snowflake: :snowflake:' )
      .setDescription( ':snowflake: :snowflake: :snowflake: :snowflake: :snowflake::snowflake::snowflake::snowflake: :snowflake: :snowflake: :snowflake: :snowflake:' )
      .addFields(
          { name: ':christmas_tree: Europe', value: 'Timezones for Europe' },
          { name: 'CET', value: `There are ${format(zones.CET)} until christmas in the CET timezone`, inline: true },
          { name: 'GMT', value: `There are ${format(zones.GMT)} until christmas in the GMT timezone`, inline: true },
          { name: ':christmas_tree: America', value: 'Timezones for the Americas' },
          { name: 'AST', value: `There are ${format(zones.AST)} until christmas in the AST timezone`, inline: true },
          { name: 'EST', value: `There are ${format(zones.EST)} until christmas in the EST timezone`, inline: true },
          { name: 'MST', value: `There are ${format(zones.MST)} until christmas in the MST timezone`, inline: true },
          { name: 'PST', value: `There are ${format(zones.PST)} until christmas in the PST timezone`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Completed on' });

    logger.log(`fired event`, "log");
    const channel = client.channels.cache.get("260411848510275585");
    if (channel) channel.send({ embeds: [CountdownMessage] });
  });


// November daily update 0 0 1-24 12 *
schedule.scheduleJob("0 0 * 11 *", function () {
  logger.log(`firing event`, "log");

  var now = new Date();
  var countDownDate = new Date( "25 Dec 20 00:00:00 GMT" ).setYear(now.getFullYear());

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

  var CountdownMessage = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle( ':snowflake: :snowflake: Christmas countdown!! :snowflake: :snowflake:' )
    .setDescription( ':snowflake: :snowflake: :snowflake: :snowflake: :snowflake::snowflake::snowflake::snowflake: :snowflake: :snowflake: :snowflake: :snowflake:' )
    .addField( ':christmas_tree: Europe', 'Timezones for Europe' )
    .addField( 'CET',
        "There are " +
        CETdays + " days, " +
        CEThours + " hours, " +
        CETminutes + " minutes, " +
        CETseconds + " seconds, " +
        CETmilliseconds + " milliseconds, " +
        " until christmas in the CET timezone", true )
    .addField( 'GMT',
        "There are " +
        GMTdays + " days, " +
        GMThours + " hours, " +
        GMTminutes + " minutes, " +
        GMTseconds + " seconds, " +
        GMTmilliseconds + " milliseconds, " +
        " until christmas in the GMT timezone", true )
    .addField( ':christmas_tree: America', 'Timezones for the Americas' )
    .addField( 'AST',
        "There are " +
        ASTdays + " days, " +
        ASThours + " hours, " +
        ASTminutes + " minutes, " +
        ASTseconds + " seconds, " +
        ASTmilliseconds + " milliseconds, " +
        " until christmas in the AST timezone", true )
    .addField( 'EST',
        "There are " +
        ESTdays + " days, " +
        ESThours + " hours, " +
        ESTminutes + " minutes, " +
        ESTseconds + " seconds, " +
        ESTmilliseconds + " milliseconds, " +
        " until christmas in the EST timezone", true )
    .addField( 'MST',
        "There are " +
        MSTdays + " days, " +
        MSThours + " hours, " +
        MSTminutes + " minutes, " +
        MSTseconds + " seconds, " +
        MSTmilliseconds + " milliseconds, " +
        " until christmas in the MST timezone", true )
    .addField( 'PST',
        "There are " +
        PSTdays + " days, " +
        PSThours + " hours, " +
        PSTminutes + " minutes, " +
        PSTseconds + " seconds, " +
        PSTmilliseconds + " milliseconds, " +
        " until christmas in the PST timezone", true )
    .setTimestamp()
    .setFooter( 'Completed on' );



    logger.log(`fired event`, "log");

  client.channels.cache.get("260411848510275585").send({ embeds: [CountdownMessage] });

});


    
  // first day of every month at midday update
  schedule.scheduleJob("0 0 1 1-10 *", function () {

    var countDownDate = new Date( "25 Dec 20 00:00:00 GMT" ).setYear(now.getFullYear());

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
  
    var CountdownMessage = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle( ':snowflake: :snowflake: Christmas countdown!! :snowflake: :snowflake:' )
        .setDescription( `If you want one added, just ask Copvampire` )
        .addField( ':christmas_tree: Europe', 'Timezones for Europe' )
        .addField( 'GMT',
            "There are " +
            GMTdays + " days, " +
            GMThours + " hours, " +
            GMTminutes + " minutes, " +
            GMTseconds + " seconds, " +
            GMTmilliseconds + " milliseconds, " +
            " until christmas in the GMT timezone", true )
        .addField( 'CET',
            "There are " +
            CETdays + " days, " +
            CEThours + " hours, " +
            CETminutes + " minutes, " +
            CETseconds + " seconds, " +
            CETmilliseconds + " milliseconds, " +
            " until christmas in the CET timezone", true )
        .addField( ':christmas_tree: America', 'Timezones for the Americas' )
        .addField( 'EST',
            "There are " +
            ESTdays + " days, " +
            ESThours + " hours, " +
            ESTminutes + " minutes, " +
            ESTseconds + " seconds, " +
            ESTmilliseconds + " milliseconds, " +
            " until christmas in the EST timezone", true )
        .addField( 'AST',
            "There are " +
            ASTdays + " days, " +
            ASThours + " hours, " +
            ASTminutes + " minutes, " +
            ASTseconds + " seconds, " +
            ASTmilliseconds + " milliseconds, " +
            " until christmas in the AST timezone", true )
        .addField( 'PST',
            "There are " +
            PSTdays + " days, " +
            PSThours + " hours, " +
            PSTminutes + " minutes, " +
            PSTseconds + " seconds, " +
            PSTmilliseconds + " milliseconds, " +
            " until christmas in the PST timezone", true )
        .addField( 'MST',
            "There are " +
            MSTdays + " days, " +
            MSThours + " hours, " +
            MSTminutes + " minutes, " +
            MSTseconds + " seconds, " +
            MSTmilliseconds + " milliseconds, " +
            " until christmas in the MST timezone", true )
        .setTimestamp()
        .setFooter( 'Completed on' );



    logger.log(`Fired event`, "ready");

    client.channels.cache.get("260411848510275585").send({ embeds: [CountdownMessage] });

  });

};
