import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIRecommendation, generateTripItinerary } from "./ai";
import { getCurrentWeather, formatWeatherForDisplay } from "./weather";
import { 
  insertAiRecommendationSchema, 
  insertTripPlanSchema, 
  insertTripDaySchema, 
  insertTripActivitySchema 
} from "@shared/schema";

// Constants for input validation
const MAX_PREFERENCES_LENGTH = 500;
const MAX_TRIP_NAME_LENGTH = 100;
const MAX_TRIP_DAYS = 30;
const VALID_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

// Helper functions to reduce duplicate validation logic
function validateParkId(parkId: any): number {
  const parkIdNum = parseInt(parkId);
  if (isNaN(parkIdNum) || parkIdNum < 1) {
    throw new Error("Invalid park ID");
  }
  return parkIdNum;
}

function validateMonth(month: any): string {
  if (!VALID_MONTHS.includes(month)) {
    throw new Error("Invalid month");
  }
  return month;
}

function validateDays(days: any): number {
  const daysNum = parseInt(days);
  if (isNaN(daysNum) || daysNum < 1 || daysNum > MAX_TRIP_DAYS) {
    throw new Error(`Days must be between 1 and ${MAX_TRIP_DAYS}`);
  }
  return daysNum;
}

function sanitizePreferences(preferences: any): string {
  // Note: No HTML escaping needed - React auto-escapes all user content.
  // If rendering preferences outside React, add HTML sanitization.
  if (typeof preferences !== 'string' || preferences.trim().length === 0) {
    throw new Error("Preferences must be a non-empty string");
  }
  
  if (preferences.length > MAX_PREFERENCES_LENGTH) {
    throw new Error(`Preferences text too long (max ${MAX_PREFERENCES_LENGTH} characters)`);
  }
  
  return preferences.trim().substring(0, MAX_PREFERENCES_LENGTH);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Health check with service dependency verification
  app.get("/api/health", async (_req, res) => {
    try {
      const health = {
        status: "ok",
        uptime: process.uptime(),
        env: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
      };

      res.json(health);
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(503).json({
        status: "error",
        message: "Service unavailable",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Get all parks
  app.get("/api/parks", async (req, res) => {
    try {
      const parks = await storage.getAllParks();
      res.json(parks);
    } catch (error) {
      console.error("Failed to retrieve parks:", error);
      res.status(500).json({ message: "Failed to retrieve parks" });
    }
  });

  // Get park by id
  app.get("/api/parks/:id", async (req, res) => {
    try {
      const parkId = validateParkId(req.params.id);
      
      const park = await storage.getParkById(parkId);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }
      
      res.json(park);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid")) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Failed to retrieve park:", error);
      res.status(500).json({ message: "Failed to retrieve park" });
    }
  });

  // Get current weather for a park
  app.get("/api/parks/:id/weather", async (req, res) => {
    try {
      const parkId = parseInt(req.params.id);
      if (isNaN(parkId)) {
        return res.status(400).json({ message: "Invalid park ID" });
      }
      
      const park = await storage.getParkById(parkId);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }
      
      const weatherData = await getCurrentWeather(park.latitude, park.longitude);
      const formattedWeather = formatWeatherForDisplay(weatherData);
      
      res.json(formattedWeather);
    } catch (error: any) {
      console.error("Error fetching weather:", error);
      res.status(500).json({ 
        message: "Failed to fetch weather data",
        weather: {
          high: "N/A",
          low: "N/A", 
          precipitation: "N/A"
        }
      });
    }
  });

  // Get parks by month
  app.get("/api/parks/month/:month", async (req, res) => {
    try {
      const month = validateMonth(req.params.month);
      
      const parks = await storage.getParksByMonth(month);
      res.json(parks);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid")) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Failed to retrieve parks for month:", error);
      res.status(500).json({ message: "Failed to retrieve parks for month" });
    }
  });

  // Get AI recommendation
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { parkId, month, preferences } = req.body;
      
      // Input validation
      if (!parkId || !month || !preferences) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Input validation using helper functions
      const parkIdNum = validateParkId(parkId);
      const validMonth = validateMonth(month);
      const sanitizedPreferences = sanitizePreferences(preferences);
      
      console.log(`Received recommendation request for park ${parkIdNum} in ${validMonth}`);
      
      // Check if we have a cached recommendation with these exact preferences
      let recommendation = await storage.getAiRecommendation(parkIdNum, validMonth, sanitizedPreferences);
      
      if (!recommendation) {
        console.log("No cached recommendation found, generating new one");
        // If not, generate a new recommendation
        const park = await storage.getParkById(parkIdNum);
        if (!park) {
          return res.status(404).json({ message: "Park not found" });
        }
        
        const recommendationText = await generateAIRecommendation(park, validMonth, sanitizedPreferences);
        
        const now = new Date().toISOString();
        
        const newRecommendation = {
          park_id: parkIdNum,
          month: validMonth,
          user_preferences: sanitizedPreferences,
          recommendation: recommendationText,
          created_at: now
        };
        
        // Validate the data using the schema
        const validatedData = insertAiRecommendationSchema.parse(newRecommendation);
        recommendation = await storage.createAiRecommendation(validatedData);
        
        console.log("New AI recommendation generated and stored");
      } else {
        console.log("Using cached AI recommendation");
      }
      
      // Return the recommendation to the client
      res.json({ recommendation: recommendation.recommendation });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid") || error.message.includes("Missing")) {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.includes("not found")) {
          return res.status(404).json({ message: error.message });
        }
      }
      console.error("Failed to generate recommendation:", error);
      res.status(500).json({ message: "Failed to generate recommendation" });
    }
  });

  // TRIP PLANNING API ROUTES
  
  // Get park activities
  app.get("/api/parks/:id/activities", async (req, res) => {
    try {
      const parkId = validateParkId(req.params.id);
      
      const activities = await storage.getParkActivities(parkId);
      res.json(activities);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid")) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Failed to retrieve park activities:", error);
      res.status(500).json({ message: "Failed to retrieve park activities" });
    }
  });
  
  // Get a specific park activity by ID
  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activityId = parseInt(req.params.id);
      if (isNaN(activityId)) {
        return res.status(400).json({ message: "Invalid activity ID" });
      }
      
      const activity = await storage.getParkActivityById(activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      res.json(activity);
    } catch (error) {
      console.error("Failed to retrieve activity:", error);
      res.status(500).json({ message: "Failed to retrieve activity" });
    }
  });
  
  // Create a new trip plan
  app.post("/api/trips", async (req, res) => {
    try {
      const { parkId, month, days, preferences, userId, name } = req.body;
      
      if (!parkId || !month || !days) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Input validation using helper functions
      const parkIdNum = validateParkId(parkId);
      const validMonth = validateMonth(month);  
      const daysNum = validateDays(days);
      
      // Sanitize optional fields
      const sanitizedPreferences = preferences && typeof preferences === 'string' 
        ? preferences.trim().substring(0, MAX_PREFERENCES_LENGTH) 
        : null;
      const sanitizedName = name && typeof name === 'string'
        ? name.trim().substring(0, MAX_TRIP_NAME_LENGTH) || "My Trip Plan"
        : "My Trip Plan";
      const userIdNum = userId && !isNaN(parseInt(userId)) ? parseInt(userId) : null;
      
      // Validate the data using the schema
      const newTripPlan = {
        park_id: parkIdNum,
        month: validMonth,
        days: daysNum,
        user_id: userIdNum,
        preferences: sanitizedPreferences,
        name: sanitizedName,
        created_at: new Date().toISOString()
      };
      
      const validatedData = insertTripPlanSchema.parse(newTripPlan);
      const tripPlan = await storage.createTripPlan(validatedData);
      
      res.status(201).json(tripPlan);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Invalid") || error.message.includes("Missing") || error.message.includes("must be")) {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.includes("Maximum number")) {
          return res.status(429).json({ message: error.message });
        }
      }
      console.error("Failed to create trip plan:", error);
      res.status(500).json({ message: "Failed to create trip plan" });
    }
  });
  
  // Get a trip plan by ID
  app.get("/api/trips/:id", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      
      const tripPlan = await storage.getTripPlanById(tripId);
      if (!tripPlan) {
        return res.status(404).json({ message: "Trip plan not found" });
      }
      
      res.json(tripPlan);
    } catch (error) {
      console.error("Failed to retrieve trip plan:", error);
      res.status(500).json({ message: "Failed to retrieve trip plan" });
    }
  });
  
  // Get trip days for a trip
  app.get("/api/trips/:id/days", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      
      const tripDays = await storage.getTripDaysByTripId(tripId);
      res.json(tripDays);
    } catch (error) {
      console.error("Failed to retrieve trip days:", error);
      res.status(500).json({ message: "Failed to retrieve trip days" });
    }
  });
  
  // Get activities for a trip day
  app.get("/api/days/:dayId/activities", async (req, res) => {
    try {
      const dayId = parseInt(req.params.dayId);
      if (isNaN(dayId)) {
        return res.status(400).json({ message: "Invalid day ID" });
      }
      
      const activities = await storage.getTripActivitiesByDayId(dayId);
      res.json(activities);
    } catch (error) {
      console.error("Failed to retrieve trip activities:", error);
      res.status(500).json({ message: "Failed to retrieve trip activities" });
    }
  });
  
  // Generate an AI trip itinerary
  app.post("/api/trips/:id/generate", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ message: "Invalid trip ID" });
      }
      
      const tripPlan = await storage.getTripPlanById(tripId);
      if (!tripPlan) {
        return res.status(404).json({ message: "Trip plan not found" });
      }
      
      const park = await storage.getParkById(tripPlan.park_id);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }
      
      const parkActivities = await storage.getParkActivities(tripPlan.park_id);
      if (parkActivities.length === 0) {
        return res.status(404).json({ message: "No activities found for this park" });
      }
      
      console.log(`Generating itinerary for trip ${tripId} at ${park.name} for ${tripPlan.days} days`);
      
      // Generate the itinerary using AI
      const itinerary = await generateTripItinerary(
        park,
        parkActivities,
        tripPlan.month,
        tripPlan.days,
        tripPlan.preferences || "General hiking and sightseeing"
      );
      
      // Save the itinerary to the database atomically
      const savedDays = [];
      
      try {
        // Process each day in the itinerary
        for (const day of itinerary) {
          // Create the trip day
          const newTripDay = {
            trip_id: tripId,
            day_number: day.day_number,
            title: day.title,
            description: day.description
          };
          
          const validatedDayData = insertTripDaySchema.parse(newTripDay);
          const savedDay = await storage.createTripDay(validatedDayData);
          savedDays.push(savedDay);
          
          // Create the activities for this day
          for (const activity of day.activities) {
            const newTripActivity = {
              trip_day_id: savedDay.id,
              activity_id: activity.activity_id,
              order: activity.order,
              start_time: activity.start_time,
              end_time: activity.end_time,
              notes: activity.notes
            };
            
            const validatedActivityData = insertTripActivitySchema.parse(newTripActivity);
            await storage.createTripActivity(validatedActivityData);
          }
        }
      } catch (saveError) {
        // Rollback any partially created data
        console.error("Failed to save itinerary:", saveError);
        try {
          await storage.deleteTripDaysByTripId(tripId);
          // Throw specific error indicating clean rollback
          throw new Error("Failed to save itinerary. All changes have been rolled back.");
        } catch (rollbackError) {
          console.error("Rollback failed, data may be in inconsistent state:", rollbackError);
          // Throw error indicating both save and rollback failed
          throw new Error("Failed to save itinerary and rollback failed. Data may be incomplete.");
        }
      }
      
      // Return the saved itinerary
      const fullItinerary = await Promise.all(
        savedDays.map(async (day) => {
          const activities = await storage.getTripActivitiesByDayId(day.id);
          return {
            ...day,
            activities
          };
        })
      );
      
      res.json(fullItinerary);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      console.error("Failed to generate trip itinerary:", error);
      res.status(500).json({ message: "Failed to generate trip itinerary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
