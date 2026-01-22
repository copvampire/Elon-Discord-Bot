const fetch = require('node-fetch');
const Discord = require('discord.js');

let lastAlertLevel = 0; // Prevent spamming the same alert

module.exports = {
    start: function(client, config, dataFile) {
        // Schedule a check every 30 minutes
        setInterval(async () => {
            await checkAurora(client, config, dataFile);
        }, 30 * 60 * 1000); 
    }
};

async function checkAurora(client, config, dataFile) {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const data = await response.json();
        
        // Get latest Kp
        const latest = data[data.length - 1];
        const kp = parseFloat(latest[1]);
        const time = latest[0];

        // Define Alert Threshold (e.g., Kp >= 5 is Storm Level G1)
        if (kp >= 5) {
            // Only alert if the level has increased or hasn't been sent recently
            // Simple logic: if kp is high and different from last check
            if (kp !== lastAlertLevel) {
                lastAlertLevel = kp;
                
                // Find the channel to send alerts to
                // You can add a setting in your config.json or data.json for "AuroraChannel"
                const serverId = config.serverID; 
                let channelName = "general"; // Default
                
                if (dataFile[serverId] && dataFile[serverId]["Settings"] && dataFile[serverId]["Settings"].AuroraChannel) {
                    channelName = dataFile[serverId]["Settings"].AuroraChannel;
                }

                const channel = client.channels.find(ch => ch.name === channelName && ch.type === 'text');
                
                if (channel) {
                    const embed = new Discord.RichEmbed()
                        .setTitle('🚨 AURORA ALERT: High Activity Detected!')
                        .setColor('#ff0000')
                        .setDescription(`The Planetary K-index has reached **${kp}**!`)
                        .addField('Time', time + ' UTC')
                        .addField('Recommendation', 'Look outside now if you are in a high latitude area! Clear skies required.')
                        .setImage('https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg'); // Live NOAA Map
                    
                    channel.send(embed);
                    console.log(`Aurora Alert sent to ${channelName} for Kp ${kp}`);
                }
            }
        } else {
            // Reset alert level if Kp drops
            if (kp < 4) lastAlertLevel = 0;
        }
    } catch (err) {
        console.error('Error in Aurora Auto-Tracker:', err);
    }
}