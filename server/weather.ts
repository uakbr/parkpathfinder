/**
 * Weather service using OpenWeatherMap API
 * Provides current weather data for park locations
 */

import { config } from "./config";

const WEATHER_TIMEOUT_MS = 10000; // 10 seconds

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

export type WeatherResult = 
  | { success: true; data: WeatherData }
  | { success: false; error: 'missing_key' | 'timeout' | 'invalid_coords' | 'api_error'; message: string };

/**
 * Fetch current weather data for a given location
 * @param latitude - Park latitude
 * @param longitude - Park longitude
 * @returns Weather result with success/error information
 */
export async function getCurrentWeather(latitude: string, longitude: string): Promise<WeatherResult> {
  const apiKey = config.openWeatherKey;
  
  if (!apiKey) {
    console.log("OpenWeather API key not configured");
    return { 
      success: false, 
      error: 'missing_key',
      message: "Weather API key not configured"
    };
  }
  
  // For demonstration purposes, if using fake_key, return mock data
  if (apiKey === 'fake_key') {
    console.log("Using mock weather data for demonstration");
    return {
      success: true,
      data: {
        temp: 72,
        temp_min: 58,
        temp_max: 78,
        humidity: 65,
        description: "partly cloudy",
        icon: "02d"
      }
    };
  }
  
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WEATHER_TIMEOUT_MS);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`OpenWeather API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 400 || response.status === 404) {
        return {
          success: false,
          error: 'invalid_coords',
          message: `Invalid coordinates: ${latitude}, ${longitude}`
        };
      }
      
      return {
        success: false,
        error: 'api_error',
        message: `Weather API returned ${response.status}`
      };
    }
    
    const data: OpenWeatherResponse = await response.json();
    
    return {
      success: true,
      data: {
        temp: Math.round(data.main.temp),
        temp_min: Math.round(data.main.temp_min),
        temp_max: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        description: data.weather[0]?.description || "Clear",
        icon: data.weather[0]?.icon || "01d"
      }
    };
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'timeout',
        message: "Weather API request timed out"
      };
    }
    
    return {
      success: false,
      error: 'api_error',
      message: "Failed to fetch weather data"
    };
  }
}

/**
 * Format weather data for display in the park detail component
 * @param weatherResult - Weather result from getCurrentWeather
 * @returns Formatted weather object matching existing interface
 */
export function formatWeatherForDisplay(weatherResult: WeatherResult) {
  if (!weatherResult.success) {
    // Return N/A with error context
    return {
      high: "N/A",
      low: "N/A",
      precipitation: "N/A",
      error: weatherResult.error,
      errorMessage: weatherResult.message
    };
  }
  
  const weather = weatherResult.data;
  return {
    high: `${weather.temp_max}°F`,
    low: `${weather.temp_min}°F`,
    precipitation: `${weather.humidity}%` // Using humidity as a proxy for precipitation likelihood
  };
}