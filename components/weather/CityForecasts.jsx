import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherIcon from "./WeatherIcon";

// Utility to shuffle an array
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array]; // Create a copy to avoid mutating the original

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
};

export default function CityForecasts({ cities, loading }) {
    const displayedCities = useMemo(() => {
        if (!cities || cities.length === 0) return [];
        return shuffle(cities).slice(0, 4);
    }, [cities]);
    
    if (loading) {
        return (
            <Card className="retro-border bg-blue-800 bg-opacity-30 weather-glow">
                <CardHeader>
                    <Skeleton className="h-6 w-32 bg-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-4 w-24 bg-blue-600" />
                                <Skeleton className="h-8 w-8 rounded bg-blue-600" />
                                <Skeleton className="h-4 w-12 bg-blue-600" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="retro-border bg-blue-800 bg-opacity-30 weather-glow">
            <CardHeader>
                <CardTitle className="text-xl text-blue-100 font-bold weather-text-shadow">
                    Nearby City Forecasts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayedCities.map((city, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-blue-900 bg-opacity-40">
                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-white">{city.city}, {city.state}</span>
                                <span className="text-sm text-blue-200">{city.condition}</span>
                            </div>
                            <WeatherIcon condition={city.condition} className="w-8 h-8 mx-2" />
                            <div className="flex flex-col items-end">
                                <span className="text-xl text-yellow-300 font-bold">{Math.round(city.temperature)}°</span>
                                <span className="text-xs text-blue-300">H: {Math.round(city.high_temp)}° / L: {Math.round(city.low_temp)}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
