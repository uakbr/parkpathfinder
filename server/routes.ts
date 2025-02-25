import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIRecommendation } from "./ai";
import { insertAiRecommendationSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
