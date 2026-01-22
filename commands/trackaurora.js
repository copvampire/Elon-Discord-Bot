const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'trackaurora',
    description: 'Track aurora visibility for a city with updates every 5 minutes.',
    usage: '[City Name] | stop | continue',
    cooldown: 5,
    async execute(client, config, dataFile, message, args) {
        // 1. Initialize the tracker storage if it doesn't exist
        if (!client.auroraTrackers) {
            client.auroraTrackers = new Map();
        }

        const userID = message.author.id;
        const input = args.join(' ').trim();

        // --- COMMAND: STOP ---
        if (input.toLowerCase() === 'stop') {
            if (client.auroraTrackers.has(userID)) {
                const tracker = client.auroraTrackers.get(userID);
                clearInterval(tracker.interval);
                clearTimeout(tracker.timeout);
                client.auroraTrackers.delete(userID);
                return message.reply("🛑 Tracker stopped. You will no longer receive updates.");
            } else {
                return message.reply("You don't have an active tracker running.");
            }
        }

        // --- COMMAND: CONTINUE ---
        if (input.toLowerCase() === 'continue') {
            if (client.auroraTrackers.has(userID)) {
                const tracker = client.auroraTrackers.get(userID);
                
                // Clear the old timeout and set a new 6-hour one
                clearTimeout(tracker.timeout);
                tracker.timeout = setTimeout(() => {
                    clearInterval(tracker.interval);
                    client.auroraTrackers.delete(userID);
                    message.author.send("💤 **Tracker Stopped:** Your 6-hour limit has been reached. Use `!trackaurora continue` next time to extend it, or start a new one.");
                }, 6 * 60 * 60 * 1000); // 6 Hours

                return message.reply("✅ Tracker extended! You have another 6 hours of updates.");
            } else {
                return message.reply("You don't have an active tracker to continue. Start one with `!trackaurora [City]`.");
            }
        }

        // --- COMMAND: START (Default) ---
        if (!input) return message.reply("Please specify a city! Usage: `!trackaurora [City]` or `!trackaurora stop`");

        // 2. Geocode the City
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input)}&count=1&language=en&format=json`;
        let cityData;
        try {
            const geoRes = await fetch(geoUrl);
            const geoJson = await geoRes.json();
            if (!geoJson.results || geoJson.results.length === 0) {
                return message.reply(`Could not find location: "${input}". Please try a major city name.`);
            }
            cityData = geoJson.results[0];
        } catch (e) {
            console.error(e);
            return message.reply("Error fetching location data.");
        }

        // 3. Stop existing tracker if the user is already tracking something
        if (client.auroraTrackers.has(userID)) {
            const oldTracker = client.auroraTrackers.get(userID);
            clearInterval(oldTracker.interval);
            clearTimeout(oldTracker.timeout);
            client.auroraTrackers.delete(userID);
            message.channel.send("🔄 Replacing your previous tracker with this new one...");
        }

        const cityName = `${cityData.name}, ${cityData.country}`;
        const lat = cityData.latitude;
        
        message.reply(`🔭 **Started tracking for ${cityName}!**\nI will DM you updates every 5 minutes for the next 6 hours.\nType \`!trackaurora stop\` to cancel or \`!trackaurora continue\` to extend.`);

        // 4. Define the Update Logic
        const sendUpdate = async () => {
            try {
                // Fetch Kp Data
                const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
                const kpData = await kpRes.json();
                const recentKp = kpData.slice(-1)[0]; // Last entry
                const currentKp = parseFloat(recentKp[1]);
                const kpTime = recentKp[0];

                // Calculate Visibility for this specific Lat
                let requiredKp = 99;
                if (Math.abs(lat) >= 66) requiredKp = 0;
                else if (Math.abs(lat) >= 64) requiredKp = 2;
                else if (Math.abs(lat) >= 60) requiredKp = 3;
                else if (Math.abs(lat) >= 56) requiredKp = 5;
                else if (Math.abs(lat) >= 52) requiredKp = 7;
                else if (Math.abs(lat) >= 48) requiredKp = 9;

                let status = "❌ Not Visible";
                let color = "#36393f"; // Gray
                if (currentKp >= requiredKp) {
                    status = "✅ **VISIBLE!** (Weather Permitting)";
                    color = "#00ff00"; // Green
                }

                // Build Embed
                const embed = new EmbedBuilder()
                    .setTitle(`Aurora Update: ${cityName}`)
                    .setDescription(`**Visibility Status:** ${status}`)
                    .setColor(color)
                    .addFields(
                        { name: 'Current Kp', value: `${currentKp}`, inline: true },
                        { name: 'Required Kp', value: `${requiredKp}`, inline: true },
                        { name: 'Time (UTC)', value: `${kpTime}`, inline: true }
                    )
                    .setFooter({ text: 'Updates every 5m | Type !trackaurora stop to end' });

                // Send DM to User
                await message.author.send({ embeds: [embed] });

            } catch (err) {
                console.error("Tracker Error:", err);
                // If DM fails (blocked/closed), stop the tracker to prevent errors
                if (err.code === 50007) {
                    const t = client.auroraTrackers.get(userID);
                    if(t) {
                        clearInterval(t.interval);
                        clearTimeout(t.timeout);
                        client.auroraTrackers.delete(userID);
                    }
                }
            }
        };

        // 5. Start the processes
        
        // Run once immediately
        await sendUpdate();

        // Set Interval (Every 5 minutes)
        const interval = setInterval(sendUpdate, 5 * 60 * 1000);

        // Set Timeout (Stop after 6 hours)
        const timeout = setTimeout(() => {
            clearInterval(interval);
            client.auroraTrackers.delete(userID);
            message.author.send("💤 **Tracker Time Limit Reached:** 6 hours have passed. Use `!trackaurora [City]` to start again or `!trackaurora continue` before time runs out next time.").catch(() => {});
        }, 6 * 60 * 60 * 1000);

        // Store the timer IDs so we can stop them later
        client.auroraTrackers.set(userID, {
            city: cityName,
            interval: interval,
            timeout: timeout
        });
    }
};