import OpenAI from "openai";
import { NationalPark, ParkActivity } from "@shared/schema";

export interface ItineraryDay {
  day_number: number;
  title: string;
  description: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  activity_id: number;
  name: string;
  start_time: string;
  end_time: string;
  notes: string;
  order: number;
}

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

// Function to generate an AI-powered trip itinerary
export async function generateTripItinerary(
  parkData: NationalPark,
  parkActivities: ParkActivity[],
  month: string,
  days: number,
  userPreferences: string
): Promise<ItineraryDay[]> {
  // Cast to the proper type with arrays
  const park = parkData as unknown as ParkData;
  try {
    console.log(`Generating ${days}-day trip itinerary for ${park.name} in ${month}`);
    
    // Format the monthly weather data for better readability
    const monthLower = month.toLowerCase();
    const weatherData = (park.weather as any)[monthLower] || { high: "N/A", low: "N/A", precipitation: "N/A" };
    const weatherInfo = `High: ${weatherData.high}, Low: ${weatherData.low}, Precipitation: ${weatherData.precipitation}`;
    
    // Format available activities with their details
    const activitiesInfo = parkActivities.map(act => {
      return {
        id: act.id,
        name: act.name,
        description: act.description,
        duration_minutes: act.duration_minutes,
        category: act.category,
        difficulty: act.difficulty || "moderate"
      };
    });
    
    // Create a structured prompt for the AI to generate a day-by-day itinerary
    const prompt = `
You are a National Park trip planner. Create a ${days}-day itinerary for ${park.name} in ${month}.

Park Information:
- Name: ${park.name}
- Location: ${park.state}
- Weather in ${month}: ${weatherInfo}

Available Activities (${activitiesInfo.length}):
${JSON.stringify(activitiesInfo, null, 2)}

Visitor Preferences:
"${userPreferences}"

Create a detailed day-by-day itinerary for ${days} days. For each day:
1. Provide a title for the day (e.g., "Day 1: Exploring the Valley Floor")
2. A brief description of the day's theme/focus
3. A logical sequence of 3-5 activities from the available activities list
4. Include start and end times for each activity
5. Consider travel time between activities
6. Balance difficulty levels
7. Account for the visitor's preferences

Structure your response as valid JSON with this exact format:
{
  "itinerary": [
    {
      "day_number": 1,
      "title": "Day title",
      "description": "Brief description of day's focus",
      "activities": [
        {
          "activity_id": 123,
          "name": "Activity name",
          "start_time": "09:00",
          "end_time": "11:30",
          "notes": "Brief note or tip",
          "order": 1
        },
        ...more activities
      ]
    },
    ...more days
  ]
}

Make sure your response is ONLY the valid JSON without any other text.
`;

    console.log("Sending itinerary request to OpenAI API");
    
    // Call the OpenAI API with JSON response format
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert national parks trip planner who creates detailed itineraries. You always respond with valid JSON that exactly matches the requested format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.7,
    });

    console.log("Received itinerary response from OpenAI API");
    
    // Parse the response as JSON
    const content = response.choices[0].message.content || "{}";
    const parsedResponse = JSON.parse(content);
    
    if (!parsedResponse.itinerary || !Array.isArray(parsedResponse.itinerary)) {
      throw new Error("Invalid itinerary format received from AI");
    }
    
    return parsedResponse.itinerary as ItineraryDay[];
  } catch (error) {
    console.error("Error generating trip itinerary:", error);
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
    
    // Return a simple fallback itinerary if AI generation fails
    return generateFallbackItinerary(days, parkActivities);
  }
}

// Helper function to generate a simple fallback itinerary if AI fails
function generateFallbackItinerary(days: number, activities: ParkActivity[]): ItineraryDay[] {
  const itinerary: ItineraryDay[] = [];
  
  // Sort activities by category to group similar activities
  const sortedActivities = [...activities].sort((a, b) => a.category.localeCompare(b.category));
  
  // Create a simple itinerary with evenly distributed activities across days
  for (let day = 1; day <= days; day++) {
    const dayActivities: ItineraryActivity[] = [];
    const activitiesPerDay = Math.min(4, Math.ceil(sortedActivities.length / days));
    const startIdx = (day - 1) * activitiesPerDay;
    
    // Get activities for this day
    for (let i = 0; i < activitiesPerDay; i++) {
      const actIdx = (startIdx + i) % sortedActivities.length;
      const activity = sortedActivities[actIdx];
      
      if (activity) {
        // Calculate a simple time slot (30 min break between activities)
        const startHour = 9 + i * 2;
        const endHour = startHour + Math.floor(activity.duration_minutes / 60);
        const endMinutes = activity.duration_minutes % 60;
        
        dayActivities.push({
          activity_id: activity.id,
          name: activity.name,
          start_time: `${startHour.toString().padStart(2, '0')}:00`,
          end_time: `${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`,
          notes: "Suggested activity",
          order: i + 1
        });
      }
    }
    
    itinerary.push({
      day_number: day,
      title: `Day ${day}: Exploring the Park`,
      description: "A balanced day of activities in the park.",
      activities: dayActivities
    });
  }
  
  return itinerary;
}
