// WeatherData schema and utility functions
export const WeatherDataSchema = {
  name: "WeatherData",
  type: "object",
  properties: {
    city: { type: "string", description: "Name of the city" },
    state: { type: "string", description: "State abbreviation" },
    temperature: { type: "number", description: "Current temperature in Fahrenheit" },
    condition: { type: "string", description: "Weather condition description" },
    humidity: { type: "number", description: "Humidity percentage" },
    wind_speed: { type: "number", description: "Wind speed in mph" },
    wind_direction: { type: "string", description: "Wind direction" },
    pressure: { type: "number", description: "Barometric pressure" },
    visibility: { type: "number", description: "Visibility in miles" },
    high_temp: { type: "number", description: "Today's high temperature" },
    low_temp: { type: "number", description: "Today's low temperature" },
    heat_index_or_wind_chill: { type: "number", description: "feels_like" }
  },
  required: ["city", "state", "temperature", "condition"]
};

// Utility to calculate "Feels Like" temperature
export function getFeelsLike({ temperature, humidity, wind_speed }) {
  // If wind > 15mph and temp < 55, use wind chill
  if (wind_speed > 15 && temperature < 55) {
    // Wind chill formula (Fahrenheit)
    // Source: National Weather Service
    const windChill = 35.74 + 0.6215 * temperature - 35.75 * Math.pow(wind_speed, 0.16) + 0.4275 * temperature * Math.pow(wind_speed, 0.16);
    return { value: Math.round(windChill), type: "wind_chill" };
  }
  // Otherwise, use heat index
  // Heat index formula (Fahrenheit)
  // Source: National Weather Service simplified formula
  const T = temperature;
  const R = humidity;
  const heatIndex = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  return { value: Math.round(heatIndex), type: "heat_index" };
}

// Example WeatherData class (stub for DB integration)
export class WeatherData {
  static async create(data) {
    // Implement DB save logic here
    return data;
  }
}
