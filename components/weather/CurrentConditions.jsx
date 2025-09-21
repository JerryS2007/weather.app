import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Thermometer, Wind, Eye, Gauge, Droplets } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherIcon from "./WeatherIcon";

export default function CurrentConditions({ weather, loading }) {
    if (loading) {
        return (
            <Card className="retro-border bg-blue-800 bg-opacity-30 weather-glow">
                <CardHeader>
                    <Skeleton className="h-8 w-48 bg-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="text-center">
                            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4 bg-blue-600" />
                            <Skeleton className="h-16 w-32 mx-auto bg-blue-600" />
                        </div>
                        <div className="space-y-4">
                            {Array(5).fill(0).map((_, i) => (
                                <Skeleton key={i} className="h-6 w-full bg-blue-600" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!weather) {
        return (
            <Card className="retro-border bg-blue-800 bg-opacity-30 weather-glow">
                <CardContent className="p-12 text-center">
                    <p className="text-blue-200 text-lg">Loading weather data...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="retro-border bg-blue-800 bg-opacity-30 weather-glow">
            <CardHeader className="text-center">
                <h2 className="text-3xl font-bold text-white weather-text-shadow">
                    Current Conditions - {weather.city}, {weather.state}
                </h2>
            </CardHeader>
            <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Temperature and Icon */}
                    <div className="text-center animated-float">
                        <WeatherIcon condition={weather.condition} className="w-24 h-24 mx-auto mb-4" />
                        <div className="text-6xl font-bold text-yellow-300 mb-2">
                            {Math.round(weather.temperature)}°
                        </div>
                        <div className="text-lg text-blue-200 mb-2">
                            {weather.condition}
                        </div>
                        <div className="text-sm text-blue-300">
                            High: {Math.round(weather.high_temp)}° / Low: {Math.round(weather.low_temp)}°
                        </div>
                    </div>
                    {/* Weather Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-100">
                            <Thermometer className="w-5 h-5" />
                            <span>Humidity: {weather.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-100">
                            <Wind className="w-5 h-5" />
                            <span>Wind: {weather.wind_speed} mph {weather.wind_direction}</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-100">
                            <Gauge className="w-5 h-5" />
                            <span>Pressure: {weather.pressure} mb</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-100">
                            <Eye className="w-5 h-5" />
                            <span>Visibility: {weather.visibility} mi</span>
                        </div>
                        <div className="flex items-center gap-3 text-blue-100">
                            <Droplets className="w-5 h-5" />
                            <span>Condition: {weather.condition}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
