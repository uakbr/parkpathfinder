import OpenAI from "openai";
import { NationalPark } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-development",
});

// Function to generate AI recommendations for a park visit
export async function generateAIRecommendation(
  park: NationalPark,
  month: string,
  userPreferences: string
): Promise<string> {
  try {
    // Create a detailed prompt for the AI
    const prompt = `
You are a National Park expert and travel advisor. You're helping a visitor plan their trip to ${park.name} in ${month}.

Park Information:
- Name: ${park.name}
- Location: ${park.state}
- Description: ${park.description}
- Best months to visit: ${JSON.stringify(park.best_months)}
- Available activities: ${JSON.stringify(park.activities)}
- Weather in ${month}: ${JSON.stringify((park.weather as any)[month.toLowerCase()])}
- Highlights: ${JSON.stringify(park.highlights)}

The visitor has shared the following preferences:
"${userPreferences}"

Please provide a personalized recommendation for their visit to ${park.name} in ${month}, including:
1. 2-3 must-see attractions or viewpoints based on their interests
2. Best times of day for certain activities considering the weather
3. Specific trails or experiences that match their preferences
4. Any special considerations for the park in ${month}
5. Practical tips that would enhance their experience

Keep your response under 200 words, conversational, and focused on making their visit memorable.
`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a national parks expert who gives helpful, personalized advice to visitors.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Return the AI's response
    return response.choices[0].message.content || "Sorry, I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Error generating AI recommendation:", error);
    return "Sorry, I couldn't generate a recommendation at this time. Please try again later.";
  }
}
