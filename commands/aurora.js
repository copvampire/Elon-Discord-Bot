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
            const loadingMsg = await message.channel.send('📡 Fetching space weather, forecasts, and generating graphs...');

            // --- 1. Fetch NOAA Data (Global) ---
            // Observed Kp
            const kpRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
            const kpData = await kpRes.json();
            
            // Forecast Kp (Predicted)
            const kpForecastRes = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json');
            const kpForecastData = await kpForecastRes.json();

            // X-Ray Flux
            const xrayRes = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json');
            const xrayData = await xrayRes.json();

            // --- Process Global Data ---
            const recentKp = kpData.slice(-1)[0];
            const currentKp = parseFloat(recentKp[1]);
            const kpTime = recentKp[0];

            const currentXrayObj = xrayData[xrayData.length - 1];
            const currentXrayFlux = currentXrayObj ? currentXrayObj.flux : 0;

            // --- 2. Handle Location & Generate Local Graphs ---
            let cityField = "Global View (No city specified)";
            let visibilityMsg = "Check the map below!";
            let localTimeMsg = "N/A";
            let chartUrl = ""; // Will hold our composite graph URL

            if (args.length > 0) {
                const query = args.join(' ');
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
                
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (geoData.results && geoData.results.length > 0) {
                    const city = geoData.results[0];
                    const lat = city.latitude;
                    const lon = city.longitude;

                    // Fetch Weather Forecast (Cloud Cover)
                    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover&forecast_days=1`;
                    const weatherRes = await fetch(weatherUrl);
                    const weatherJson = await weatherRes.json();

                    // Process Local Data
                    const timezone = city.timezone;
                    const cityDate = new Date().toLocaleString("en-US", {timeZone: timezone});
                    localTimeMsg = `${cityDate} (${timezone})`;

                    // Calculate Required Kp (Magnetic Lat Logic)
                    // (Simplified Magnetic Lat calculation for brevity)
                    const MAG_POLE_LAT = 80.9;
                    const MAG_POLE_LON = -72.4;
                    const toRad = (d) => d * (Math.PI / 180);
                    const toDeg = (r) => r * (180 / Math.PI);
                    const mlatRad = Math.asin(Math.sin(toRad(lat)) * Math.sin(toRad(MAG_POLE_LAT)) + Math.cos(toRad(lat)) * Math.cos(toRad(MAG_POLE_LAT)) * Math.cos(toRad(lon - MAG_POLE_LON)));
                    const magneticLat = toDeg(mlatRad);
                    
                    let requiredKp = 9;
                    if (magneticLat >= 66.5) requiredKp = 0;
                    else if (magneticLat >= 60.4) requiredKp = 3;
                    else if (magneticLat >= 56.3) requiredKp = 5;
                    else if (magneticLat >= 52.2) requiredKp = 7;
                    else if (magneticLat >= 48.0) requiredKp = 9;

                    cityField = `${city.name}, ${city.country} (Mag Lat: ${magneticLat.toFixed(1)}°)`;

                    // --- GENERATE COMPOSITE GRAPH (QuickChart) ---
                    // 1. Forecast Kp Data (Next ~9 hours)
                    const forecastKps = kpForecastData.slice(-4).map(d => parseFloat(d[1])); // Last 4 entries of forecast
                    const forecastLabels = kpForecastData.slice(-4).map(d => d[0].split(' ')[1].substring(0,5)); // Time HH:MM

                    // 2. Cloud Cover Data (Next 12 hours)
                    const cloudCover = weatherJson.hourly.cloudcover.slice(0, 12);
                    const cloudLabels = weatherJson.hourly.time.slice(0, 12).map(t => t.split('T')[1]);

                    // 3. Probability Score (Inverse of Cloud Cover * Kp Strength)
                    // Simple heuristic: If Cloud > 50%, prob drops. If Kp > Required, prob rises.
                    const probs = cloudCover.map((cloud, i) => {
                        // Map the 3-hour Kp forecast to this hourly weather data
                        const kpIndex = Math.floor(i / 3); 
                        const predKp = forecastKps[kpIndex] || forecastKps[forecastKps.length-1] || 0;
                        
                        if (predKp < requiredKp) return 0; // Kp too low
                        return (100 - cloud); // Clearer sky = Higher prob
                    });

                    const chartConfig = {
                        type: 'bar',
                        data: {
                            labels: cloudLabels,
                            datasets: [
                                {
                                    type: 'line',
                                    label: 'Cloud Cover (%)',
                                    borderColor: 'rgb(255, 99, 132)',
                                    borderWidth: 2,
                                    fill: false,
                                    data: cloudCover,
                                    yAxisID: 'y1'
                                },
                                {
                                    type: 'line',
                                    label: 'Viewing Chance (%)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                    borderColor: 'rgb(75, 192, 192)',
                                    data: probs,
                                    fill: true,
                                    yAxisID: 'y1'
                                },
                                {
                                    type: 'bar',
                                    label: 'Predicted Kp',
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    data: cloudCover.map((_, i) => forecastKps[Math.floor(i/3)] || 0),
                                    yAxisID: 'y2'
                                }
                            ]
                        },
                        options: {
                            title: { display: true, text: `Viewing Conditions: ${city.name}` },
                            scales: {
                                yAxes: [
                                    { id: 'y1', position: 'left', ticks: { min: 0, max: 100 } }, // Percent
                                    { id: 'y2', position: 'right', ticks: { min: 0, max: 9 }, gridLines: { drawOnChartArea: false } } // Kp
                                ]
                            }
                        }
                    };
                    chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=500&h=300&bkg=white`;
                    
                    if (currentKp >= requiredKp) {
                        visibilityMsg = "✅ **VISIBLE!** (Check Clouds Graph)";
                    } else {
                        visibilityMsg = `❌ Not Visible (Need Kp ${requiredKp})`;
                    }
                } else {
                    cityField = `Could not find city: "${query}"`;
                }
            } else {
                // If NO City, show Global X-Ray Graph
                // Downsample X-Ray data (it's 1-minute resolution, too big for URL) -> Take every 10th point
                const xrayFiltered = xrayData.filter((_, i) => i % 15 === 0).slice(-30);
                const xrayFluxes = xrayFiltered.map(x => x.flux);
                const xrayTimes = xrayFiltered.map(x => x.time_tag.split('T')[1].substring(0,5));

                const xrayChart = {
                    type: 'line',
                    data: {
                        labels: xrayTimes,
                        datasets: [{
                            label: 'Solar X-Ray Flux (W/m²)',
                            data: xrayFluxes,
                            borderColor: '#ff9f40',
                            fill: true,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)'
                        }]
                    },
                    options: {
                        title: { display: true, text: 'GOES X-Ray Flux (Last 6 Hours)' },
                        scales: {
                            yAxes: [{ type: 'logarithmic', ticks: { min: 1e-9, max: 1e-3 } }]
                        }
                    }
                };
                chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(xrayChart))}&w=500&h=300&bkg=white`;
            }

            // --- 3. Determine Color ---
            let color = "#0099ff"; 
            if (currentKp >= 4) color = "#00ff00"; 
            if (currentKp >= 6) color = "#ffaa00"; 
            if (currentKp >= 8) color = "#ff0000"; 

            // --- 4. Build Embed ---
            const mapUrl = `https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg?t=${Date.now()}`;

            const embed = new EmbedBuilder()
                .setTitle('🌌 Real-Time Aurora Analysis')
                .setColor(color)
                .setDescription(`Conditions as of ${kpTime} UTC`)
                .addFields(
                    { name: '📊 Kp Index', value: `**${currentKp}**`, inline: true },
                    { name: '☀️ X-Ray Flux', value: `${currentXrayFlux.toExponential(2)} W/m²`, inline: true },
                    { name: '🌍 Location', value: cityField, inline: true },
                    { name: '👀 Visibility', value: visibilityMsg, inline: true },
                    { name: '🕒 Local Time', value: localTimeMsg, inline: true }
                )
                .setImage(chartUrl || mapUrl) // Prioritize Graph if exists, else Map
                .setFooter({ text: 'Data: NOAA SWPC | Weather: Open-Meteo' });

            await loadingMsg.delete();
            message.channel.send({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            message.channel.send('Failed to retrieve Aurora data. NOAA APIs might be down.');
        }
    },
};