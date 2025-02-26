import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIRecommendation, generateTripItinerary } from "./ai";
import { 
  insertAiRecommendationSchema, 
  insertTripPlanSchema, 
  insertTripDaySchema, 
  insertTripActivitySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all parks
  app.get("/api/parks", async (req, res) => {
    try {
      const parks = await storage.getAllParks();
      res.json(parks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get park by id
  app.get("/api/parks/:id", async (req, res) => {
    try {
      const parkId = parseInt(req.params.id);
      if (isNaN(parkId)) {
        return res.status(400).json({ message: "Invalid park ID" });
      }
      
      const park = await storage.getParkById(parkId);
      if (!park) {
        return res.status(404).json({ message: "Park not found" });
      }
      
      res.json(park);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get parks by month
  app.get("/api/parks/month/:month", async (req, res) => {
    try {
      const month = req.params.month;
      const validMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      
      if (!validMonths.includes(month)) {
        return res.status(400).json({ message: "Invalid month" });
      }
      
      const parks = await storage.getParksByMonth(month);
      res.json(parks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get AI recommendation
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { parkId, month, preferences } = req.body;
      
      if (!parkId || !month || !preferences) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      console.log(`Received recommendation request for park ${parkId} in ${month}`);
      
      // Create a cache key from the parameters
      const preferencesKey = preferences.trim().toLowerCase().substring(0, 100);
      
      // Check if we have a cached recommendation with these exact preferences
      let recommendation = await storage.getAiRecommendation(parkId, month, preferencesKey);
      
      if (!recommendation) {
        console.log("No cached recommendation found, generating new one");
        // If not, generate a new recommendation
        const park = await storage.getParkById(parkId);
        if (!park) {
          return res.status(404).json({ message: "Park not found" });
        }
        
        const recommendationText = await generateAIRecommendation(park, month, preferences);
        
        const now = new Date().toISOString();
        
        const newRecommendation = {
          park_id: parkId,
          month: month,
          user_preferences: preferencesKey,
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
    } catch (error: any) {
      console.error("Error in /api/recommendations endpoint:", error);
      res.status(500).json({ 
        message: "Failed to generate recommendation",
        error: error.message 
      });
    }
  });

  // TRIP PLANNING API ROUTES
  
  // Get park activities
  app.get("/api/parks/:id/activities", async (req, res) => {
    try {
      const parkId = parseInt(req.params.id);
      if (isNaN(parkId)) {
        return res.status(400).json({ message: "Invalid park ID" });
      }
      
      const activities = await storage.getParkActivities(parkId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create a new trip plan
  app.post("/api/trips", async (req, res) => {
    try {
      const { parkId, month, days, preferences, userId, name } = req.body;
      
      if (!parkId || !month || !days) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Validate the data using the schema
      const newTripPlan = {
        park_id: parkId,
        month,
        days,
        user_id: userId || null,
        preferences: preferences || null,
        name: name || "My Trip Plan",
        created_at: new Date().toISOString()
      };
      
      const validatedData = insertTripPlanSchema.parse(newTripPlan);
      const tripPlan = await storage.createTripPlan(validatedData);
      
      res.status(201).json(tripPlan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
      
      // Save the itinerary to the database
      const savedDays = [];
      
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
    } catch (error: any) {
      console.error("Error generating trip itinerary:", error);
      res.status(500).json({ 
        message: "Failed to generate trip itinerary",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
