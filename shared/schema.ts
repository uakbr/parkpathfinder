import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// National Parks schema
export const nationalParks = pgTable("national_parks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  description: text("description").notNull(),
  image_url: text("image_url").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  rating: text("rating").notNull(),
  review_count: integer("review_count").notNull(),
  activities: jsonb("activities").notNull(),
  weather: jsonb("weather").notNull(),
  highlights: jsonb("highlights").notNull(),
  best_months: jsonb("best_months").notNull(),
  monthly_notes: jsonb("monthly_notes").notNull(),
});

export const insertNationalParkSchema = createInsertSchema(nationalParks).omit({
  id: true,
});

export type InsertNationalPark = z.infer<typeof insertNationalParkSchema>;
export type NationalPark = typeof nationalParks.$inferSelect;

// AI Recommendation schema
export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  park_id: integer("park_id").notNull(),
  month: text("month").notNull(),
  user_preferences: text("user_preferences").notNull(),
  recommendation: text("recommendation").notNull(),
  created_at: text("created_at").notNull(),
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
});

export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
