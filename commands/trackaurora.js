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
        const lon = cityData.longitude; 
        const timezone = cityData.timezone; // Needed for local time labels

        message.reply(`🔭 **Started tracking for ${cityName}!**\nI will DM you updates every 5 minutes for the next 6 hours.\nType \`!trackaurora stop\` to cancel or \`!trackaurora continue\` to extend.`);

        // 4. Define the Update Logic
        const sendUpdate = async () => {
            try {
                // --- FETCH DATA SOURCES ---
                // A. Current & Past Kp
                const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
                const kpData = await kpRes.json(); // [Time, Kp, ...]
                
                // B. Forecast Kp
                const kpForecastRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json');
                const kpForecastData = await kpForecastRes.json();

                // C. Weather (History + Forecast)
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover&past_days=1&forecast_days=2`;
                const weatherRes = await fetch(weatherUrl);
                const weatherJson = await weatherRes.json();

                // --- PROCESS CURRENT STATUS ---
                const recentKp = kpData.slice(-1)[0]; 
                const currentKp = parseFloat(recentKp[1]);
                const kpTime = recentKp[0]; 

                // Timezone Logic (UK/UTC)
                const utcDate = new Date(kpTime.replace(' ', 'T') + 'Z');
                const ukTime = utcDate.toLocaleTimeString("en-GB", {
                    timeZone: "Europe/London",
                    hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
                });

                // --- MAGNETIC LATITUDE CALCULATION ---
                const MAG_POLE_LAT = 80.9;
                const MAG_POLE_LON = -72.4; 
                const toRad = (deg) => deg * (Math.PI / 180);
                const toDeg = (rad) => rad * (180 / Math.PI);

                const mlatRad = Math.asin(
                    Math.sin(toRad(lat)) * Math.sin(toRad(MAG_POLE_LAT)) +
                    Math.cos(toRad(lat)) * Math.cos(toRad(MAG_POLE_LAT)) * Math.cos(toRad(lon - MAG_POLE_LON))
                );
                const magneticLat = toDeg(mlatRad);

                // Calculate Required Kp
                let requiredKp = 9; 
                if (magneticLat >= 66.5) requiredKp = 0;
                else if (magneticLat >= 64.5) requiredKp = 1;
                else if (magneticLat >= 62.4) requiredKp = 2;
                else if (magneticLat >= 60.4) requiredKp = 3;
                else if (magneticLat >= 58.3) requiredKp = 4;
                else if (magneticLat >= 56.3) requiredKp = 5;
                else if (magneticLat >= 54.2) requiredKp = 6;
                else if (magneticLat >= 52.2) requiredKp = 7;
                else if (magneticLat >= 50.1) requiredKp = 8;
                else if (magneticLat >= 48.0) requiredKp = 9;

                let status = "❌ Not Visible";
                let color = "#36393f"; // Gray
                if (magneticLat < 45) {
                    status = "❌ Too far south"; 
                } else if (currentKp >= requiredKp) {
                    status = "✅ **VISIBLE!** (Weather Permitting)";
                    color = "#00ff00"; // Green
                }

                // --- GRAPH GENERATION (History 6h + Forecast 6h) ---
                
                // 1. Identify "Now" index in Weather Data
                const nowUTC = new Date();
                nowUTC.setMinutes(0, 0, 0); 
                const nowISO = nowUTC.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
                
                // Find index matching current hour
                const currentIndex = weatherJson.hourly.time.findIndex(t => t.startsWith(nowISO));
                
                if (currentIndex === -1) {
                    console.log("Error: Could not align weather timeline.");
                    return; 
                }

                // 2. Slice Data (6 hours back, 6 hours forward = 13 points incl current)
                const startIndex = Math.max(0, currentIndex - 6);
                const endIndex = Math.min(weatherJson.hourly.time.length, currentIndex + 7); 

                const timeSlice = weatherJson.hourly.time.slice(startIndex, endIndex);
                const cloudSlice = weatherJson.hourly.cloudcover.slice(startIndex, endIndex);

                // 3. Generate Local Time Labels
                const labels = timeSlice.map(isoStr => {
                    const d = new Date(isoStr + ":00Z"); // Force UTC
                    return d.toLocaleTimeString('en-US', { 
                        timeZone: timezone, 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: false // 24-hour format
                    });
                });

                // 4. Map Kp Data to this Timeline
                const combinedKp = timeSlice.map((isoStr, i) => {
                    const timeObj = new Date(isoStr + ":00Z");
                    const timeMs = timeObj.getTime();
                    
                    if (timeMs <= nowUTC.getTime()) {
                        // PAST: Use Observed Kp
                        const match = kpData.slice().reverse().find(row => {
                            const rowTime = new Date(row[0].replace(' ', 'T') + 'Z').getTime();
                            return rowTime <= timeMs;
                        });
                        return match ? parseFloat(match[1]) : 0;
                    } else {
                        // FUTURE: Use Forecast Kp
                        const match = kpForecastData.find(row => {
                            const rowTime = new Date(row[0].replace(' ', 'T') + 'Z').getTime();
                            return rowTime >= timeMs; 
                        });
                        return match ? parseFloat(match[1]) : 0;
                    }
                });

                // 5. Calculate Viewing Probability
                const probs = cloudSlice.map((cloud, i) => {
                    const k = combinedKp[i];
                    if (k < requiredKp) return 0;
                    return (100 - cloud);
                });

                // 6. Build Chart Config
                const chartConfig = {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                type: 'line',
                                label: 'Cloud Cover (%)',
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 2,
                                fill: false,
                                data: cloudSlice,
                                yAxisID: 'y1'
                            },
                            {
                                type: 'line',
                                label: 'Viewing Chance (%)',
                                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                borderColor: 'rgb(75, 192, 192)',
                                data: probs,
                                fill: true,
                                yAxisID: 'y1'
                            },
                            {
                                type: 'bar',
                                label: 'Kp Index',
                                backgroundColor: combinedKp.map((_, i) => (i < 6) ? 'rgba(54, 162, 235, 0.5)' : 'rgba(153, 102, 255, 0.5)'), // Blue for past, Purple for future
                                data: combinedKp,
                                yAxisID: 'y2'
                            }
                        ]
                    },
                    options: {
                        title: { display: true, text: `History & Forecast (-6h / +6h): ${cityName}` },
                        scales: {
                            yAxes: [
                                { id: 'y1', position: 'left', ticks: { min: 0, max: 100 }, scaleLabel: { display: true, labelString: '%' } },
                                { id: 'y2', position: 'right', ticks: { min: 0, max: 9 }, gridLines: { drawOnChartArea: false }, scaleLabel: { display: true, labelString: 'Kp' } }
                            ]
                        }
                    }
                };

                // --- FIX: USE POST REQUEST FOR SHORT URL ---
                let chartUrl = "";
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
                    if (qcJson.url) chartUrl = qcJson.url;
                } catch (qcErr) {
                    console.error("QuickChart Error:", qcErr);
                }

                // --- BUILD EMBED ---
                const embed = new EmbedBuilder()
                    .setTitle(`Aurora Update: ${cityName}`)
                    .setDescription(`**Status:** ${status}`)
                    .setColor(color)
                    .addFields(
                        { name: 'Current Kp', value: `${currentKp}`, inline: true },
                        { name: 'Required Kp', value: `${requiredKp}`, inline: true },
                        { name: 'Magnetic Lat', value: `${magneticLat.toFixed(1)}°`, inline: true },
                        { name: 'Time (UK)', value: `${ukTime}`, inline: true },
                        { name: 'Time (UTC)', value: `${kpTime}`, inline: true }
                    )
                    .setFooter({ text: 'Blue Bars = History | Purple Bars = Forecast' });

                if (chartUrl) {
                    embed.setImage(chartUrl);
                }

                // Send DM to User
                await message.author.send({ embeds: [embed] });

            } catch (err) {
                console.error("Tracker Error:", err);
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