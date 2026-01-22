const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const cron = require('node-cron'); // <--- New Dependency

let lastAlertLevel = 0; 

module.exports = {
    start: function(client, config, dataFile) {
        console.log("🌌 Aurora Tracker: Online (Cron Scheduled)");

        // 1. High Activity Alert System
        // Schedule: Every 30 minutes (e.g. 12:00, 12:30, 1:00...)
        cron.schedule('*/30 * * * *', async () => {
            console.log("🔍 Checking Aurora Alert Status...");
            await checkAuroraAlert(client, config, dataFile);
        });

        // 2. Scheduled 3-Hour Report
        // Schedule: At minute 0 past every 3rd hour (00:00, 03:00, 06:00, etc.)
        cron.schedule('0 */3 * * *', async () => {
            console.log("📨 Sending Scheduled 3-Hour Report...");
            await sendScheduledReport(client);
        });

        // Run the scheduled report 10 seconds after startup (So you get one immediately on boot)
        setTimeout(async () => {
            await sendScheduledReport(client);
        }, 10000);
    }
};

// --- Function 1: The Scheduled 3-Hour Report ---
async function sendScheduledReport(client) {
    try {
        const channel = client.channels.cache.find(ch => 
            ch.name === 'aurora-tracking' && (ch.type === 'GUILD_TEXT' || typeof ch.send === 'function')
        );
        
        if (!channel) {
            console.log("⚠️ Aurora Tracker: Could not find channel 'aurora-tracking'. Please create it.");
            return;
        }

        // --- 1. Fetch All Data Sources ---
        // Observed Kp (Past)
        const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const kpData = await kpRes.json();
        
        // Forecast Kp (Future)
        const kpForecastRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json');
        const kpForecastData = await kpForecastRes.json();

        // X-Ray Flux (Solar Activity)
        const xrayRes = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json');
        const xrayData = await xrayRes.json();


        // --- 2. Process Data ---
        // Get Current Status
        const recentKp = kpData.slice(-1)[0]; 
        const currentKp = parseFloat(recentKp[1]);
        const kpTime = recentKp[0]; // UTC String

        const currentXray = xrayData[xrayData.length - 1];
        const flux = currentXray ? currentXray.flux : 0;

        // --- 3. Generate Chart Data ---
        // We want a chart showing: Past 12h Kp + Next 12h Forecast
        
        // A. Process Past Kp (Last 12 entries = ~36 hours, let's take last 8 for 24h)
        const pastKpData = kpData.slice(-8);
        const pastLabels = pastKpData.map(d => d[0].split(' ')[1].substring(0,5)); // HH:MM
        const pastValues = pastKpData.map(d => parseFloat(d[1]));

        // B. Process Forecast Kp (Next 8 entries = 24h)
        const futureKpData = kpForecastData.slice(-8);
        const futureLabels = futureKpData.map(d => d[0].split(' ')[1].substring(0,5));
        const futureValues = futureKpData.map(d => parseFloat(d[1]));

        // C. Combine Labels (and handle X-Ray overlay scaling)
        const allLabels = [...pastLabels, ...futureLabels];
        const allPastData = [...pastValues, ...Array(futureValues.length).fill(null)]; // Pad with nulls
        const allFutureData = [...Array(pastValues.length).fill(null), ...futureValues]; // Pad with nulls

        const chartConfig = {
            type: 'line',
            data: {
                labels: allLabels,
                datasets: [
                    {
                        label: 'Observed Kp',
                        borderColor: '#36a2eb', // Blue
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        data: allPastData,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: 'Forecast Kp',
                        borderColor: '#ff6384', // Red
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        data: allFutureData,
                        borderDash: [5, 5], // Dashed line for prediction
                        fill: true,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                title: { display: true, text: 'Planetary K-index: 24h History & Forecast' },
                legend: { display: true },
                scales: {
                    yAxes: [{ 
                        ticks: { min: 0, max: 9, stepSize: 1 },
                        scaleLabel: { display: true, labelString: 'Kp Index' },
                        gridLines: { color: 'rgba(200, 200, 200, 0.3)' }
                    }],
                    xAxes: [{
                        ticks: { autoSkip: true, maxTicksLimit: 8 },
                        gridLines: { display: false }
                    }]
                }
            }
        };

        // Get Short URL via POST
        let graphUrl = "";
        try {
            const qcRes = await fetch('https://quickchart.io/chart/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    backgroundColor: 'white',
                    width: 500,
                    height: 300,
                    format: 'png',
                    chart: chartConfig
                })
            });
            const qcJson = await qcRes.json();
            if (qcJson.url) graphUrl = qcJson.url;
        } catch (qcErr) {
            console.error("QuickChart Error:", qcErr);
        }

        const mapUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg?t=${Date.now()}`;

        // --- 4. Format Output ---
        // Timezone Logic
        const utcDate = new Date(kpTime.replace(' ', 'T') + 'Z');
        const ukTime = utcDate.toLocaleTimeString("en-GB", {
            timeZone: "Europe/London",
            hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        });

        // Color Logic
        let color = "#0099ff"; 
        if (currentKp >= 4) color = "#00ff00"; 
        if (currentKp >= 6) color = "#ffaa00"; 
        if (currentKp >= 8) color = "#ff0000"; 

        const embed = new EmbedBuilder()
            .setTitle('🌌 3-Hour Aurora Report')
            .setColor(color)
            .setDescription(`Global space weather conditions and forecast.`)
            .addFields(
                { name: '📊 Current Kp', value: `**${currentKp}**`, inline: true },
                { name: '☀️ X-Ray Flux', value: `${flux.toExponential(2)} W/m²`, inline: true },
                { name: '🔮 Max Forecast', value: `Kp ${Math.max(...futureValues)}`, inline: true },
                { name: '🕒 Time (UK)', value: `${ukTime}`, inline: true },
                { name: '🕒 Time (UTC)', value: `${kpTime}`, inline: true }
            )
            .setImage(graphUrl) // Graph is main image
            .setThumbnail(mapUrl) // Map is thumbnail
            .setFooter({ text: 'Updates every 3 hours | Data: NOAA SWPC' });

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
        const kpTime = latest[0];

        if (kp >= 5) {
            if (kp !== lastAlertLevel) {
                lastAlertLevel = kp;
                
                const serverId = config.serverID; 
                let channelName = "general"; 
                
                if (dataFile[serverId]?.Settings?.AuroraChannel) {
                    channelName = dataFile[serverId].Settings.AuroraChannel;
                } else {
                    const trackCh = client.channels.cache.find(ch => ch.name === 'aurora-tracking');
                    if (trackCh) channelName = 'aurora-tracking';
                }

                const channel = client.channels.cache.find(ch => 
                    ch.name === channelName && (ch.type === 'GUILD_TEXT' || typeof ch.send === 'function')
                );
                
                if (channel) {
                    const utcDate = new Date(kpTime.replace(' ', 'T') + 'Z');
                    const ukTime = utcDate.toLocaleTimeString("en-GB", {
                        timeZone: "Europe/London",
                        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
                    });

                    const mapUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg?t=${Date.now()}`;

                    const embed = new EmbedBuilder()
                        .setTitle('🚨 AURORA ALERT: High Activity Detected!')
                        .setColor('#ff0000')
                        .setDescription(`The Planetary K-index has reached **${kp}**!`)
                        .addFields(
                            { name: '🕒 Time (UK)', value: `${ukTime}`, inline: true },
                            { name: '🕒 Time (UTC)', value: `${kpTime}`, inline: true }
                        )
                        .setImage(mapUrl); 
                    
                    channel.send({ content: '@here', embeds: [embed] });
                }
            }
        } else {
            if (kp < 4) lastAlertLevel = 0; 
        }
    } catch (err) {
        console.error('Error in Aurora Alert Check:', err);
    }
}