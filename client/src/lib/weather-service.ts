import { apiRequest } from "./queryClient";
import { MonthlyWeather } from "./types";

/**
 * Fetch current weather data for a park
 * @param parkId - The ID of the national park
 * @returns Current weather data formatted for the park detail component
 */
export async function getCurrentWeatherForPark(parkId: number): Promise<MonthlyWeather> {
  try {
    console.log(`Fetching current weather for park ${parkId}`);
    
    const response = await apiRequest("GET", `/api/parks/${parkId}/weather`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const weatherData = await response.json() as MonthlyWeather;
    
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return fallback data on error
    return {
      high: "N/A",
      low: "N/A",
      precipitation: "N/A"
    };
  }
}