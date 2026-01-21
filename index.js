// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();

// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");

// --- [ADD THESE 3 LINES HERE] ---
const AuroraTracker = require('./auroraTracker.js');
const config = require('./config.json');  // <--- DEFINES "config"
const dataFile = require('./data.json');  // <--- DEFINES "dataFile"
// --------------------------------

const logger = require("./modules/Logger.js");
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Client({ intents, partials });

// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
  commands,
  aliases,
  slashcmds,
  levelCache
};

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {

// Here we load **commands** into memory, as a collection, so they're accessible
  const commands = readdirSync("./commands/").filter(file => file.endsWith(".js"));
  for (const file of commands) {
    let props = require(`./commands/${file}`);

    // --- [COMPATIBILITY FIX START] ---
    // If this is an "Old Style" command (has .execute but no .conf), 
    // we create a fake .conf and .help so the new bot handler accepts it.
    if (!props.conf && props.execute) {
        props.conf = {
            enabled: true,
            guildOnly: false,
            aliases: props.aliases || [],
            permLevel: "User"
        };
        
        props.help = {
            name: props.name,
            category: "General",
            description: props.description || "No description",
            usage: props.usage || props.name
        };

        // CRITICAL: The new handler likely calls ".run", but old commands use ".execute".
        // We create a wrapper to pass the variables your old commands need (config, dataFile).
        // Note: This assumes the new handler sends (client, message, args). 
        // If commands still fail, we will need to see events/messageCreate.js.
        props.run = async (client, message, args) => {
            return props.execute(client, config, dataFile, message, args);
        };
    }
    // --- [COMPATIBILITY FIX END] ---

    // FIX: Check for both new format (props.help.name) and old format (props.name)
    const commandName = props.help ? props.help.name : props.name;

    // If the file doesn't have a valid name, skip it to prevent crash
    if (!commandName) {
        logger.log(`Skipping ${file}: Missing command name.`, "warn");
        continue;
    }

    logger.log(`Loading Command: ${commandName}. 👌`, "log");
    client.container.commands.set(commandName, props);
    
    // FIX: Check for both new alias format (props.conf.aliases) and old (props.aliases)
    const aliases = (props.conf && props.conf.aliases) ? props.conf.aliases : props.aliases;
    
    if (aliases) {
        aliases.forEach(alias => {
          client.container.aliases.set(alias, commandName);
        });
    }
  }

  // Now we load any **slash** commands you may have in the ./slash directory.
  const slashFiles = readdirSync("./slash").filter(file => file.endsWith(".js"));
  for (const file of slashFiles) {
    const command = require(`./slash/${file}`);
    const commandName = file.split(".")[0];
    logger.log(`Loading Slash command: ${commandName}. 👌`, "log");
    
    // Now set the name of the command with it's properties.
    client.container.slashcmds.set(command.commandData.name, command);
  }

  // Then we load events, which will include our message and ready event.
  const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    const eventName = file.split(".")[0];
    logger.log(`Loading Event: ${eventName}. 👌`, "log");
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  }  

  // Threads are currently in BETA.
  // This event will fire when a thread is created, if you want to expand
  // the logic, throw this in it's own event file like the rest.
  client.on("threadCreate", (thread) => thread.join());

  client.once("ready", () => {
      logger.log("Starting Aurora Tracker...", "log");
      AuroraTracker.start(client, config, dataFile);
  });

  // Here we login the client.
  client.login();

// End top-level async/await function.
};

init();
