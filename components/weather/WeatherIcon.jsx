import React from "react";
import { 
    Sun, 
    Cloud, 
    CloudRain, 
    CloudSnow, 
    CloudLightning, 
    CloudDrizzle,
    Cloudy
} from "lucide-react";

export default function WeatherIcon({ condition, size = "medium" }) {
    const getIconSize = () => {
        switch (size) {
            case "small": return "w-8 h-8";
            case "large": return "w-20 h-20";
            default: return "w-12 h-12";
        }
    };

    const getIcon = () => {
        const conditionLower = condition?.toLowerCase() || "";
        
        if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
            return <Sun className={`${getIconSize()} text-yellow-400 animated-float`} />;
        }
        if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
            return <CloudRain className={`${getIconSize()} text-blue-300`} />;
        }
        if (conditionLower.includes("drizzle")) {
            return <CloudDrizzle className={`${getIconSize()} text-blue-300`} />;
        }
        if (conditionLower.includes("snow")) {
            return <CloudSnow className={`${getIconSize()} text-white`} />;
        }
        if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
            return <CloudLightning className={`${getIconSize()} text-yellow-300`} />;
        }
        if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
            return <Cloud className={`${getIconSize()} text-gray-300`} />;
        }
        if (conditionLower.includes("partly") || conditionLower.includes("mostly")) {
            return <Cloudy className={`${getIconSize()} text-gray-200`} />;
        }
        
        // Default icon
        return <Sun className={`${getIconSize()} text-yellow-400`} />;
    };

    return (
        <div className="flex justify-center">
            {getIcon()}
        </div>
    );
}
