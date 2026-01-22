const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

let lastAlertLevel = 0; // Keeps track of the last Kp for alerts

module.exports = {
    start: function(client, config, dataFile) {
        console.log("🌌 Aurora Tracker: Online");

        // 1. High Activity Alert System (Checks every 30 minutes)
        setInterval(async () => {
            await checkAuroraAlert(client, config, dataFile);
        }, 30 * 60 * 1000);

        // 2. Scheduled 3-Hour Report (Checks every 3 hours)
        setInterval(async () => {
            await sendScheduledReport(client);
        }, 3 * 60 * 60 * 1000);

        // Run the scheduled report 10 seconds after startup so you see it works immediately
        setTimeout(async () => {
            await sendScheduledReport(client);
        }, 10000);
    }
};

// --- Function 1: The Scheduled 3-Hour Report ---
async function sendScheduledReport(client) {
    try {
        // FIX: Replaced .isText() with .type === 'GUILD_TEXT' for Discord.js v13 compatibility
        // If you are on v14, this might need to be ch.type === 0
        // The safest fallback is checking if ch.send exists
        const channel = client.channels.cache.find(ch => 
            ch.name === 'aurora-tracking' && (ch.type === 'GUILD_TEXT' || typeof ch.send === 'function')
        );
        
        if (!channel) {
            console.log("⚠️ Aurora Tracker: Could not find channel 'aurora-tracking'. Please create it.");
            return;
        }

        // Fetch Data
        const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const kpData = await kpRes.json();
        const xrayRes = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json');
        const xrayData = await xrayRes.json();

        // Process Data
        const recentKp = kpData.slice(-1)[0]; // Last entry
        const currentKp = parseFloat(recentKp[1]);
        const kpTime = recentKp[0];

        const currentXray = xrayData[xrayData.length - 1];
        const flux = currentXray ? currentXray.flux : 0;

        // Determine Color
        let color = "#0099ff"; // Blue
        if (currentKp >= 4) color = "#00ff00"; // Green
        if (currentKp >= 6) color = "#ffaa00"; // Orange
        if (currentKp >= 8) color = "#ff0000"; // Red

        const embed = new EmbedBuilder()
            .setTitle('🌌 3-Hour Aurora Update')
            .setColor(color)
            .setDescription(`Current global space weather conditions.`)
            .addFields(
                { name: '📊 Kp Index', value: `**${currentKp}**`, inline: true },
                { name: '☀️ X-Ray Flux', value: `${flux.toExponential(2)} W/m²`, inline: true },
                { name: '🕒 Data Time', value: `${kpTime} UTC`, inline: true }
            )
            .setImage('https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg') // Live NOAA Map
            .setFooter({ text: 'Updates automatically every 3 hours' });

        channel.send({ embeds: [embed] });
        console.log(`✅ Sent scheduled Aurora report to #${channel.name}`);

    } catch (err) {
        console.error("❌ Error sending scheduled Aurora report:", err);
    }
}

// --- Function 2: The High Activity Alert (Conditional) ---
async function checkAuroraAlert(client, config, dataFile) {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const data = await response.json();
        
        const latest = data[data.length - 1];
        const kp = parseFloat(latest[1]);

        // Alert Threshold: Kp >= 5 (Storm Level G1)
        if (kp >= 5) {
            if (kp !== lastAlertLevel) {
                lastAlertLevel = kp;
                
                // Find channel (Prioritize settings, fallback to 'aurora-tracking', then 'general')
                const serverId = config.serverID; 
                let channelName = "general"; 
                
                if (dataFile[serverId]?.Settings?.AuroraChannel) {
                    channelName = dataFile[serverId].Settings.AuroraChannel;
                } else {
                    // If no setting, try the tracking channel first
                    const trackCh = client.channels.cache.find(ch => ch.name === 'aurora-tracking');
                    if (trackCh) channelName = 'aurora-tracking';
                }

                // FIX: Replaced .isText() with .type === 'GUILD_TEXT' check here too
                const channel = client.channels.cache.find(ch => 
                    ch.name === channelName && (ch.type === 'GUILD_TEXT' || typeof ch.send === 'function')
                );
                
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setTitle('🚨 AURORA ALERT: High Activity Detected!')
                        .setColor('#ff0000')
                        .setDescription(`The Planetary K-index has reached **${kp}**!`)
                        .setImage('https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg');
                    
                    channel.send({ content: '@here', embeds: [embed] });
                }
            }
        } else {
            if (kp < 4) lastAlertLevel = 0; // Reset if it calms down
        }
    } catch (err) {
        console.error('Error in Aurora Alert Check:', err);
    }
}