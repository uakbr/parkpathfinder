import { describe, it, expect } from "vitest";
import { formatWeatherForDisplay } from "../server/weather";

describe("Weather Service", () => {
  it("should format weather data correctly", () => {
    const mockWeatherResult = {
      success: true as const,
      data: {
        temp: 72,
        temp_min: 58,
        temp_max: 78,
        humidity: 65,
        description: "partly cloudy",
        icon: "02d"
      }
    };

    const formatted = formatWeatherForDisplay(mockWeatherResult);

    expect(formatted).toEqual({
      high: "78°F",
      low: "58°F", 
      precipitation: "65%"
    });
  });

  it("should handle error weather data gracefully", () => {
    const mockErrorResult = {
      success: false as const,
      error: 'missing_key' as const,
      message: "Weather API key not configured"
    };
    
    const formatted = formatWeatherForDisplay(mockErrorResult);

    expect(formatted).toEqual({
      high: "N/A",
      low: "N/A",
      precipitation: "N/A",
      error: 'missing_key',
      errorMessage: "Weather API key not configured"
    });
  });
});