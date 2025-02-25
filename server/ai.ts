import OpenAI from "openai";
import { NationalPark } from "@shared/schema";

// Define park data types explicitly
interface MonthlyWeather {
  high: string;
  low: string;
  precipitation: string;
}

interface ParkData extends NationalPark {
  activities: string[];
  weather: Record<string, MonthlyWeather>;
  highlights: string[];
  best_months: string[];
  monthly_notes: Record<string, string>;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate AI recommendations for a park visit
export async function generateAIRecommendation(
  parkData: NationalPark,
  month: string,
  userPreferences: string
): Promise<string> {
  // Cast to the proper type with arrays
  const park = parkData as unknown as ParkData;
  try {
    console.log(`Generating AI recommendation for ${park.name} in ${month} with preferences: ${userPreferences}`);
    
    // Format the monthly weather data for better readability
    const monthLower = month.toLowerCase();
    const weatherData = (park.weather as any)[monthLower] || { high: "N/A", low: "N/A", precipitation: "N/A" };
    const weatherInfo = `High: ${weatherData.high}, Low: ${weatherData.low}, Precipitation: ${weatherData.precipitation}`;
    
    // Get monthly notes if available
    const monthlyNotes = (park.monthly_notes as any)?.[monthLower] || "No specific notes for this month.";
    
    // Create a detailed prompt for the AI
    const prompt = `
You are a National Park expert and travel advisor. You're helping a visitor plan their trip to ${park.name} in ${month}.

Park Information:
- Name: ${park.name}
- Location: ${park.state}
- Description: ${park.description}
- Best months to visit: ${Array.isArray(park.best_months) ? park.best_months.join(", ") : "All year"}
- Available activities: ${Array.isArray(park.activities) ? park.activities.join(", ") : "Various activities"}
- Weather in ${month}: ${weatherInfo}
- Highlights: ${Array.isArray(park.highlights) ? park.highlights.join(", ") : "Various highlights"}
- Monthly Notes: ${monthlyNotes}

The visitor has shared the following preferences and interests:
"${userPreferences}"

Please provide a personalized recommendation for their visit to ${park.name} in ${month}, including:
1. A brief introduction addressing them personally
2. 2-3 must-see attractions or viewpoints based on their specific interests
3. Best times of day for certain activities considering the ${month} weather
4. Specific trails or experiences that match their preferences
5. Practical tips that would enhance their experience (clothing, gear, timing)
6. Any special considerations for this park during ${month}

Format your response in a conversational, friendly tone. Break up text into small paragraphs. Use about 200-250 words total.
`;

    console.log("Sending request to OpenAI API");
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert national parks guide who gives personalized, practical advice to visitors. You are concise, friendly, and knowledgeable about outdoor activities, wildlife, and seasonal conditions at US National Parks.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("Received response from OpenAI API");
    
    // Return the AI's response
    return response.choices[0].message.content || "Sorry, I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Error generating AI recommendation:", error);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
    return "Sorry, I couldn't generate a recommendation at this time. Please try again later.";
  }
}
