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

    useEffect(() => {
        loadWeatherData();
        // Refresh every 10 minutes
        const interval = setInterval(loadWeatherData, 600000);
        return () => clearInterval(interval);
    }, []);

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
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
                }
                .weather-glow {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }
                .retro-border {
                    border: 2px solid rgba(96, 165, 250, 0.5);
                    border-radius: 12px;
                    backdrop-filter: blur(10px);
                }
                .weather-text-shadow {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
                .animated-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                .scroll-text {
                    animation: scroll 20s linear infinite;
                    white-space: nowrap;
                }
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
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
                <div className="fixed bottom-0 left-0 right-0 bg-blue-950 bg-opacity-90 backdrop-blur-sm border-t border-blue-400">
                    <div className="py-3 overflow-hidden">
                        <div className="scroll-text text-blue-100">
                            <span className="mx-8">🌤️ Current conditions for the greater New Orleans area</span>
                            <span className="mx-8">🌊 Stay weather aware along the Gulf Coast</span>
                            <span className="mx-8">⚡ Check back for updated forecasts</span>
                            <span className="mx-8">🌡️ Temperatures courtesy of Slidell Weather Center</span>
                        </div>
                    </div>
                </div>
            </div>
            {showRadar && (
                <RadarDisplay onClose={() => setShowRadar(false)} />
            )}
        </div>
    );
}
