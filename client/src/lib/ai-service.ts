import { apiRequest } from "./queryClient";
import { AIRecommendationResponse } from "./types";

/**
 * Gets an AI-generated recommendation for a national park visit
 * @param parkId - The ID of the national park
 * @param month - The month of the planned visit
 * @param preferences - User's preferences and interests
 * @returns A personalized recommendation string
 */
export async function getAIRecommendation(
  parkId: number,
  month: string,
  preferences: string
): Promise<string> {
  try {
    console.log(`Requesting AI recommendation for park ${parkId} in ${month}`);
    
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
    
    if (!data.recommendation) {
      throw new Error("No recommendation received from server");
    }
    
    return data.recommendation;
  } catch (error) {
    console.error("Error getting AI recommendation:", error);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
    return "Sorry, I couldn't generate a recommendation right now. Please try again in a moment.";
  }
}
