const Discord = require('discord.js');
const fetch = require('node-fetch');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'aurora',
    description: 'Get real-time Aurora Borealis tracking, Kp index, and visibility scores.',
    cooldown: 10,
    async execute(client, config, dataFile, message, args) {
        try {
            const loadingMsg = await message.channel.send('📡 Fetching space weather data from NOAA...');

            // 1. Fetch Kp Index (Planetary K-index)
            // Returns array of [time, kp, a_index, status]
            const kpResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
            const kpData = await kpResponse.json();

            // 2. Fetch GOES X-Ray Flux
            // Returns array of object with time_tag and flux values
            const xrayResponse = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json');
            const xrayData = await xrayResponse.json();

            // Process Data
            // Get the last 24 hours of Kp data (Kp is usually every 3 hours)
            // The API returns a header row, so we slice from 1
            const recentKp = kpData.slice(-8); 
            const currentKpObj = recentKp[recentKp.length - 1];
            const currentKp = parseFloat(currentKpObj[1]);
            const currentTime = currentKpObj[0];

            // Get current X-Ray Flux (Long channel 0.1-0.8nm is standard)
            const currentXrayObj = xrayData[xrayData.length - 1];
            const currentXrayFlux = currentXrayObj ? currentXrayObj.flux : 0;
            
            // Calculate Visibility Score & Cities
            let visibilityScore = "Low";
            let color = "#0099ff"; // Blue
            let cities = "High Latitude regions only (Antarctica, Arctic)";
            
            if (currentKp >= 4) {
                visibilityScore = "Moderate";
                color = "#00ff00"; // Green
                cities = "Oslo, Helsinki, Northern Scotland, Alaska";
            }
            if (currentKp >= 6) {
                visibilityScore = "High";
                color = "#ffaa00"; // Orange
                cities = "Edinburgh, Glasgow, Copenhagen, Moscow, Anchorage";
            }
            if (currentKp >= 8) {
                visibilityScore = "Extreme (Storm)";
                color = "#ff0000"; // Red
                cities = "London, Berlin, Toronto, Seattle, Paris, Northern US";
            }

            // Generate Graph using QuickChart
            // We will plot the last 8 Kp values
            const labels = recentKp.map(d => d[0].split(' ')[1].substring(0, 5)); // Extract HH:MM
            const dataPoints = recentKp.map(d => parseFloat(d[1]));

            const chartConfig = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Kp Index',
                        data: dataPoints,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        yAxisID: 'y-axis-kp'
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'Planetary K-index (Last 24 Hours)',
                        fontColor: '#fff'
                    },
                    legend: {
                        labels: { fontColor: '#fff' }
                    },
                    scales: {
                        xAxes: [{ ticks: { fontColor: '#fff' }, gridLines: { color: 'rgba(255,255,255,0.1)' } }],
                        yAxes: [{
                            id: 'y-axis-kp',
                            ticks: { beginAtZero: true, max: 9, fontColor: '#fff' },
                            gridLines: { color: 'rgba(255,255,255,0.1)' },
                            scaleLabel: { display: true, labelString: 'Kp Index', fontColor: '#fff' }
                        }]
                    }
                }
            };

            const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=500&h=300&bkg=black`;

            // Build Embed
            const embed = new EmbedBuilder()
    .setTitle('🌌 Real-Time Aurora Borealis Tracker')
    .setColor(color)
    .setDescription(`Current Space Weather Conditions as of ${currentTime} UTC`)
    .addFields(
        { name: '📊 Kp Index', value: `**${currentKp}** (${visibilityScore})`, inline: true },
        { name: '☀️ GOES X-Ray Flux', value: `${currentXrayFlux.toExponential(2)} W/m²`, inline: true },
        { name: '👀 Visibility Score', value: visibilityScore, inline: true },
        { name: '🏙️ Perfect Viewing In', value: cities },
        { name: '🕐 Best Time to Look', value: 'Between 10 PM and 2 AM local time, away from city lights.' }
    )
    .setImage(chartUrl)
    .setFooter({ text: 'Data provided by NOAA SWPC' });

            await loadingMsg.delete();
            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('Failed to retrieve Aurora data. NOAA APIs might be down.');
        }
    },
};