const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'aurora',
    description: 'Get real-time Aurora tracking. Usage: !aurora [city name]',
    usage: '[city name]',
    cooldown: 10,
    async execute(client, config, dataFile, message, args) {
        try {
            const loadingMsg = await message.channel.send('📡 Fetching space weather and location data...');

            // --- 1. Fetch NOAA Data ---
            // Kp Index
            const kpResponse = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
            const kpData = await kpResponse.json();

            // X-Ray Flux
            const xrayResponse = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json');
            const xrayData = await xrayResponse.json();

            // Process Kp Data (Get the most recent valid entry)
            // The API returns an array of arrays. We grab the last one.
            const recentKp = kpData.slice(-24); // Look at last 24 entries
            const currentKpObj = recentKp[recentKp.length - 1];
            const currentKp = parseFloat(currentKpObj[1]);
            const kpTime = currentKpObj[0];

            // Process X-Ray Data
            const currentXrayObj = xrayData[xrayData.length - 1];
            const currentXrayFlux = currentXrayObj ? currentXrayObj.flux : 0;

            // --- 2. Handle City / User Location ---
            let cityField = "Global View (No city specified)";
            let visibilityMsg = "Check the map below!";
            let localTimeMsg = "N/A";
            
            // If user provided a city argument (e.g. "!aurora Paris")
            if (args.length > 0) {
                const query = args.join(' ');
                // Use Open-Meteo Geocoding API to find lat/lon/timezone
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
                
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (geoData.results && geoData.results.length > 0) {
                    const city = geoData.results[0];
                    const lat = city.latitude;
                    const timezone = city.timezone;

                    // Calculate Local Time in that city
                    const cityDate = new Date().toLocaleString("en-US", {timeZone: timezone});
                    localTimeMsg = `${cityDate} (${timezone})`;

                    // Estimate Required Kp based on Latitude
                    // Lower latitude = Higher Kp needed
                    let requiredKp = 99;
                    if (Math.abs(lat) >= 66) requiredKp = 0;      // Arctic Circle
                    else if (Math.abs(lat) >= 64) requiredKp = 2; // Reykjavik/Fairbanks
                    else if (Math.abs(lat) >= 60) requiredKp = 3; // Oslo/Helsinki
                    else if (Math.abs(lat) >= 56) requiredKp = 5; // Scotland/Moscow
                    else if (Math.abs(lat) >= 52) requiredKp = 7; // London/Berlin
                    else if (Math.abs(lat) >= 48) requiredKp = 9; // Paris/Seattle

                    cityField = `${city.name}, ${city.country} (Lat: ${lat.toFixed(1)}°)`;

                    // Determine Visibility
                    if (currentKp >= requiredKp) {
                        visibilityMsg = "✅ **VISIBLE!** (Weather permitting)";
                    } else {
                        visibilityMsg = `❌ Not Visible (Need Kp ${requiredKp})`;
                    }

                } else {
                    cityField = `Could not find city: "${query}"`;
                }
            }

            // --- 3. Determine Status Color ---
            let color = "#0099ff"; // Blue (Calm)
            if (currentKp >= 4) color = "#00ff00"; // Green (Active)
            if (currentKp >= 6) color = "#ffaa00"; // Orange (Storm)
            if (currentKp >= 8) color = "#ff0000"; // Red (Extreme)

            // --- 4. Build Embed using EmbedBuilder ---
            const embed = new EmbedBuilder()
                .setTitle('🌌 Real-Time Aurora Borealis Tracker')
                .setColor(color)
                .setDescription(`Current conditions as of ${kpTime} UTC`)
                .addFields(
                    { name: '📊 Kp Index', value: `**${currentKp}**`, inline: true },
                    { name: '☀️ X-Ray Flux', value: `${currentXrayFlux.toExponential(2)} W/m²`, inline: true },
                    { name: '🌍 Location', value: cityField, inline: true },
                    { name: '👀 Visibility', value: visibilityMsg, inline: true },
                    { name: '🕒 Local Time', value: localTimeMsg, inline: true }
                )
                .setImage('https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg') // Live NOAA Map
                .setFooter({ text: 'Data: NOAA SWPC | Geocoding: Open-Meteo' });

            await loadingMsg.delete();
            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('Failed to retrieve Aurora data. NOAA APIs might be down.');
        }
    },
};