import { describe, it, expect } from "vitest";
import { formatWeatherForDisplay } from "../server/weather";

describe("Weather Service", () => {
  it("should format weather data correctly", () => {
    const mockWeather = {
      temp: 72,
      temp_min: 58,
      temp_max: 78,
      humidity: 65,
      description: "partly cloudy",
      icon: "02d"
    };

    const formatted = formatWeatherForDisplay(mockWeather);

    expect(formatted).toEqual({
      high: "78°F",
      low: "58°F", 
      precipitation: "65%"
    });
  });

  it("should handle null weather data gracefully", () => {
    const formatted = formatWeatherForDisplay(null);

    expect(formatted).toEqual({
      high: "N/A",
      low: "N/A",
      precipitation: "N/A"
    });
  });
});