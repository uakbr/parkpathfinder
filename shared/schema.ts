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

// Park Activity schema (specific locations within a park)
export const parkActivities = pgTable("park_activities", {
  id: serial("id").primaryKey(),
  park_id: integer("park_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // hiking, viewpoint, visitor center, etc.
  duration_minutes: integer("duration_minutes").notNull(),
  difficulty: text("difficulty").default("moderate"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  image_url: text("image_url"),
  best_time_of_day: text("best_time_of_day"), // morning, afternoon, evening
  best_months: jsonb("best_months"), // array of months when this activity is best
  tips: text("tips"),
});

export const insertParkActivitySchema = createInsertSchema(parkActivities).omit({
  id: true,
});

export type InsertParkActivity = z.infer<typeof insertParkActivitySchema>;
export type ParkActivity = typeof parkActivities.$inferSelect;

// Trip Plan schema
export const tripPlans = pgTable("trip_plans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id"), // nullable for anonymous users
  park_id: integer("park_id").notNull(),
  month: text("month").notNull(),
  days: integer("days").notNull(),
  created_at: text("created_at").notNull(),
  preferences: text("preferences"),
  name: text("name").default("My Trip"),
});

export const insertTripPlanSchema = createInsertSchema(tripPlans).omit({
  id: true,
});

export type InsertTripPlan = z.infer<typeof insertTripPlanSchema>;
export type TripPlan = typeof tripPlans.$inferSelect;

// Trip Day schema (for each day in a trip)
export const tripDays = pgTable("trip_days", {
  id: serial("id").primaryKey(),
  trip_id: integer("trip_id").notNull(),
  day_number: integer("day_number").notNull(), // 1, 2, 3, etc.
  title: text("title").notNull(), // e.g., "Explore the South Rim"
  description: text("description"),
});

export const insertTripDaySchema = createInsertSchema(tripDays).omit({
  id: true,
});

export type InsertTripDay = z.infer<typeof insertTripDaySchema>;
export type TripDay = typeof tripDays.$inferSelect;

// Trip Activity schema (activities for each day)
export const tripActivities = pgTable("trip_activities", {
  id: serial("id").primaryKey(),
  trip_day_id: integer("trip_day_id").notNull(),
  activity_id: integer("activity_id").notNull(), // reference to park_activities
  start_time: text("start_time"), // e.g., "09:00"
  end_time: text("end_time"), // e.g., "11:30"
  order: integer("order").notNull(), // sequence in the day
  notes: text("notes"),
});

export const insertTripActivitySchema = createInsertSchema(tripActivities).omit({
  id: true,
});

export type InsertTripActivity = z.infer<typeof insertTripActivitySchema>;
export type TripActivity = typeof tripActivities.$inferSelect;
