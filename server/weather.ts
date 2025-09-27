/**
 * Weather service using OpenWeatherMap API
 * Provides current weather data for park locations
 */

interface WeatherData {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

/**
 * Fetch current weather data for a given location
 * @param latitude - Park latitude
 * @param longitude - Park longitude
 * @returns Weather data formatted for the park detail component
 */
export async function getCurrentWeather(latitude: string, longitude: string): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    console.log("OpenWeather API key not configured");
    return null;
  }
  
  // For demonstration purposes, if using fake_key, return mock data
  if (apiKey === 'fake_key') {
    console.log("Using mock weather data for demonstration");
    return {
      temp: 72,
      temp_min: 58,
      temp_max: 78,
      humidity: 65,
      description: "partly cloudy",
      icon: "02d"
    };
  }
  
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`OpenWeather API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data: OpenWeatherResponse = await response.json();
    
    return {
      temp: Math.round(data.main.temp),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || "Clear",
      icon: data.weather[0]?.icon || "01d"
    };
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

/**
 * Format weather data for display in the park detail component
 * @param weather - Raw weather data
 * @returns Formatted weather object matching existing interface
 */
export function formatWeatherForDisplay(weather: WeatherData | null) {
  if (!weather) {
    return {
      high: "N/A",
      low: "N/A",
      precipitation: "N/A"
    };
  }
  
  return {
    high: `${weather.temp_max}°F`,
    low: `${weather.temp_min}°F`,
    precipitation: `${weather.humidity}%` // Using humidity as a proxy for precipitation likelihood
  };
}