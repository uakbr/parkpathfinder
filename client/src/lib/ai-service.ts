import { apiRequest } from "./queryClient";
import { AIRecommendationResponse } from "./types";

export async function getAIRecommendation(
  parkId: number,
  month: string,
  preferences: string
): Promise<string> {
  try {
    const response = await apiRequest(
      "POST",
      "/api/recommendations",
      {
        parkId,
        month,
        preferences
      }
    );
    
    const data = await response.json() as AIRecommendationResponse;
    return data.recommendation;
  } catch (error) {
    console.error("Error getting AI recommendation:", error);
    return "Sorry, I couldn't generate a recommendation at this time. Please try again later.";
  }
}
