import React, { useState, useEffect } from "react";
import { WeatherData } from "@/entities/WeatherData";
import { InvokeLLM } from "@/integrations/Core";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Eye, Gauge } from "lucide-react";
import CurrentConditions from "../components/weather/CurrentConditions";
import CityForecasts from "../components/weather/CityForecasts";
import WeatherHeader from "../components/weather/WeatherHeader";
import RadarDisplay from "../components/weather/RadarDisplay";

export default function Weather() {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [nearbyWeather, setNearbyWeather] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [showRadar, setShowRadar] = useState(false);
    // EAS alert state
    const [easAlert, setEasAlert] = useState(null);
    const SLIDELL_COORDS = { lat: 30.2752, lon: -89.7814 };

    useEffect(() => {
        loadWeatherData();
        fetchEASAlerts();
        // Refresh every 10 minutes
        const interval = setInterval(() => {
            loadWeatherData();
            fetchEASAlerts();
        }, 600000);
        return () => clearInterval(interval);
    }, []);

    // Fetch EAS alerts for Louisiana and filter for Slidell
    const fetchEASAlerts = async () => {
        try {
            const response = await fetch('https://api.weather.gov/alerts/active?area=LA');
            const data = await response.json();
            // Filter for alerts affecting Slidell (by areaDesc or geometry)
            const relevant = data.features?.filter(alert => {
                const area = alert.properties.areaDesc || "";
                // Check if Slidell or St. Tammany is mentioned
                return area.includes("Slidell") || area.includes("St. Tammany");
            });
            if (relevant && relevant.length > 0) {
                // Use the first relevant alert for display
                setEasAlert(relevant[0].properties);
            } else {
                setEasAlert(null);
            }
        } catch (error) {
            setEasAlert(null);
        }
    };

    const loadWeatherData = async () => {
        setLoading(true);
        try {
            // Get weather data using LLM with internet context
            const weatherResponse = await InvokeLLM({
                prompt: `Get current weather conditions for Slidell, Louisiana and nearby cities. For Louisiana, include New Orleans, Lake Charles, Baton Rouge, Natchitoches, and Franklinton. For Mississippi, include Tylertown, Jackson, Biloxi, and Natchez. Include temperature, conditions, humidity, wind speed, wind direction, pressure, visibility, and high/low temps for today for all cities.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        slidell: {
                            type: "object",
                            properties: {
                                city: { type: "string" },
                                state: { type: "string" },
                                temperature: { type: "number" },
                                condition: { type: "string" },
                                humidity: { type: "number" },
                                wind_speed: { type: "number" },
                                wind_direction: { type: "string" },
                                pressure: { type: "number" },
                                visibility: { type: "number" },
                                high_temp: { type: "number" },
                                low_temp: { type: "number" }
                            }
                        },
                        nearby_cities: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    city: { type: "string" },
                                    state: { type: "string" },
                                    temperature: { type: "number" },
                                    condition: { type: "string" },
                                    humidity: { type: "number" },
                                    wind_speed: { type: "number" },
                                    wind_direction: { type: "string" },
                                    pressure: { type: "number" },
                                    visibility: { type: "number" },
                                    high_temp: { type: "number" },
                                    low_temp: { type: "number" }
                                }
                            }
                        }
                    }
                }
            });

            if (weatherResponse.slidell) {
                setCurrentWeather(weatherResponse.slidell);
                // Save to database
                await WeatherData.create(weatherResponse.slidell);
            }

            if (weatherResponse.nearby_cities) {
                setNearbyWeather(weatherResponse.nearby_cities);
                // Save nearby cities to database
                for (const cityData of weatherResponse.nearby_cities) {
                    await WeatherData.create(cityData);
                }
            }

            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error loading weather data:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1a2f] via-[#1a2a4f] to-[#0a1a2f] text-white font-inter">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #0a1a2f 0%, #1a2a4f 50%, #0a1a2f 100%);
                }
                .weather-glow {
                    box-shadow: 0 0 30px 10px #00cfff44, 0 0 10px 2px #fff2;
                }
                .retro-border {
                    border: 2px solid #00cfff;
                    border-radius: 16px;
                    background: linear-gradient(135deg, #0a1a2f 60%, #1a2a4f 100%);
                }
                .weather-text-shadow {
                    text-shadow: 2px 2px 8px #000a, 0 0 8px #00cfff88;
                }
                .animated-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .scroll-text {
                    animation: scroll 20s linear infinite;
                    white-space: nowrap;
                    font-size: 1.25rem;
                    color: #fff;
                    text-shadow: 2px 2px 8px #000a, 0 0 8px #00cfff88;
                }
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .eas-crawl {
                    background: linear-gradient(90deg, #c00 0%, #f90 100%);
                    color: #fff;
                    font-weight: bold;
                    font-size: 1.3rem;
                    text-shadow: 2px 2px 8px #000a, 0 0 8px #fff8;
                    border-top: 3px solid #fff;
                    border-bottom: 3px solid #fff;
                    box-shadow: 0 0 20px #c00a, 0 0 10px #f90a;
                    z-index: 100;
                }
            `}</style>

            <WeatherHeader 
                lastUpdated={lastUpdated} 
                onRefresh={loadWeatherData} 
                loading={loading} 
                onShowRadar={() => setShowRadar(true)}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <CurrentConditions weather={currentWeather} loading={loading} />
                    </div>
                    <div className="space-y-6">
                        <CityForecasts cities={nearbyWeather} loading={loading} />
                    </div>
                </div>
                {/* Bottom ticker */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#0a1a2f] bg-opacity-95 backdrop-blur-sm border-t border-[#00cfff]">
                    <div className="py-3 overflow-hidden">
                        <div className="scroll-text">
                            <span className="mx-8">🌤️ Current conditions for the greater New Orleans area</span>
                            <span className="mx-8">🌊 Stay weather aware along the Gulf Coast</span>
                            <span className="mx-8">⚡ Check back for updated forecasts</span>
                            <span className="mx-8">🌡️ Temperatures courtesy of Slidell Weather Center</span>
                        </div>
                    </div>
                </div>
                {/* EAS crawl if alert is active */}
                {easAlert && (
                    <div className="fixed bottom-0 left-0 right-0 eas-crawl">
                        <div className="scroll-text">
                            <span className="mx-8">🚨 {easAlert.headline} — {easAlert.description}</span>
                        </div>
                        {/* EAS beep sound */}
                        <audio autoPlay src="/eas-beep.mp3" />
                    </div>
                )}
            </div>

            {showRadar && (
                <RadarDisplay onClose={() => setShowRadar(false)} />
            )}
        </div>
    );
}
