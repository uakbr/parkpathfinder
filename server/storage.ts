import { 
  users, 
  type User, 
  type InsertUser, 
  nationalParks, 
  type NationalPark, 
  type InsertNationalPark,
  aiRecommendations,
  type AiRecommendation,
  type InsertAiRecommendation,
  parkActivities,
  type ParkActivity,
  type InsertParkActivity,
  tripPlans,
  type TripPlan,
  type InsertTripPlan,
  tripDays,
  type TripDay,
  type InsertTripDay,
  tripActivities,
  type TripActivity,
  type InsertTripActivity
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export class MemStorage {
  // Memory limits to prevent resource exhaustion
  private static readonly MAX_CACHE_SIZE = 1000;
  private static readonly MAX_TRIP_PLANS = 10000;
  
  private users: Map<number, User>;
  private parks: Map<number, NationalPark>;
  private aiRecommendations: Map<string, AiRecommendation>;
  private parkActivities: Map<number, ParkActivity>;
  private tripPlans: Map<number, TripPlan>;
  private tripDays: Map<number, TripDay>;
  private tripActivities: Map<number, TripActivity>;
  
  private currentUserId: number;
  private currentParkId: number;
  private currentAiRecommendationId: number;
  private currentParkActivityId: number;
  private currentTripPlanId: number;
  private currentTripDayId: number;
  private currentTripActivityId: number;

  constructor() {
    this.users = new Map();
    this.parks = new Map();
    this.aiRecommendations = new Map();
    this.parkActivities = new Map();
    this.tripPlans = new Map();
    this.tripDays = new Map();
    this.tripActivities = new Map();
    
    this.currentUserId = 1;
    this.currentParkId = 1;
    this.currentAiRecommendationId = 1;
    this.currentParkActivityId = 1;
    this.currentTripPlanId = 1;
    this.currentTripDayId = 1;
    this.currentTripActivityId = 1;
    
    // Initialize with sample park data
    this.initializeParkData();
    
    // Initialize with sample park activities
    this.initializeParkActivities();
  }

  // Generate a safe cache key for AI recommendations
  private generateCacheKey(parkId: number, month: string, preferences: string): string {
    // Use a deterministic approach that handles special characters and length
    const sanitized = preferences.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').substring(0, 50);
    return `${parkId}:${month}:${sanitized}`;
  }

  // Atomic ID generation methods to prevent race conditions
  private getNextUserId(): number {
    return this.currentUserId++;
  }

  private getNextParkId(): number {
    return this.currentParkId++;
  }

  private getNextAiRecommendationId(): number {
    return this.currentAiRecommendationId++;
  }

  private getNextParkActivityId(): number {
    return this.currentParkActivityId++;
  }

  private getNextTripPlanId(): number {
    return this.currentTripPlanId++;
  }

  private getNextTripDayId(): number {
    return this.currentTripDayId++;
  }

  private getNextTripActivityId(): number {
    return this.currentTripActivityId++;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.getNextUserId();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // National Parks methods
  async getAllParks(): Promise<NationalPark[]> {
    return Array.from(this.parks.values());
  }
  
  async getParkById(id: number): Promise<NationalPark | undefined> {
    return this.parks.get(id);
  }
  
  async getParksByMonth(month: string): Promise<NationalPark[]> {
    return Array.from(this.parks.values()).filter(park => {
      const bestMonths = park.best_months as string[];
      return bestMonths.includes(month);
    });
  }
  
  // AI Recommendations methods  
  async getAiRecommendation(parkId: number, month: string, preferences: string): Promise<AiRecommendation | undefined> {
    const key = this.generateCacheKey(parkId, month, preferences);
    return this.aiRecommendations.get(key);
  }
  
  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    // Prevent memory exhaustion by limiting cache size
    if (this.aiRecommendations.size >= MemStorage.MAX_CACHE_SIZE) {
      // Remove oldest entries (simple FIFO eviction)
      const keysToDelete = Array.from(this.aiRecommendations.keys()).slice(0, Math.floor(MemStorage.MAX_CACHE_SIZE * 0.1));
      keysToDelete.forEach(key => this.aiRecommendations.delete(key));
    }
    
    const id = this.getNextAiRecommendationId();
    const recommendation: AiRecommendation = { ...insertRecommendation, id };
    
    const key = this.generateCacheKey(recommendation.park_id, recommendation.month, recommendation.user_preferences);
    this.aiRecommendations.set(key, recommendation);
    
    return recommendation;
  }
  
  // Park Activities methods
  async getParkActivities(parkId: number): Promise<ParkActivity[]> {
    return Array.from(this.parkActivities.values()).filter(
      activity => activity.park_id === parkId
    );
  }
  
  async getParkActivityById(id: number): Promise<ParkActivity | undefined> {
    return this.parkActivities.get(id);
  }
  
  async createParkActivity(insertActivity: InsertParkActivity): Promise<ParkActivity> {
    const id = this.getNextParkActivityId();
    // Ensure all required fields have non-null/undefined values
    const activity: ParkActivity = {
      ...insertActivity,
      id,
      image_url: insertActivity.image_url || null,
      best_time_of_day: insertActivity.best_time_of_day || null,
      difficulty: insertActivity.difficulty || "moderate",
      tips: insertActivity.tips || null,
      best_months: insertActivity.best_months || []
    };
    this.parkActivities.set(id, activity);
    return activity;
  }
  
  // Trip Planning methods
  async createTripPlan(insertPlan: InsertTripPlan): Promise<TripPlan> {
    // Prevent memory exhaustion by limiting trip plans
    if (this.tripPlans.size >= MemStorage.MAX_TRIP_PLANS) {
      throw new Error("Maximum number of trip plans reached. Please try again later.");
    }
    
    const id = this.getNextTripPlanId();
    // Ensure all required fields have non-null/undefined values
    const plan: TripPlan = {
      ...insertPlan,
      id,
      name: insertPlan.name || "My Trip Plan",
      user_id: insertPlan.user_id || null,
      preferences: insertPlan.preferences || null
    };
    this.tripPlans.set(id, plan);
    return plan;
  }
  
  async getTripPlanById(id: number): Promise<TripPlan | undefined> {
    return this.tripPlans.get(id);
  }
  
  async getTripDaysByTripId(tripId: number): Promise<TripDay[]> {
    return Array.from(this.tripDays.values()).filter(
      day => day.trip_id === tripId
    ).sort((a, b) => a.day_number - b.day_number);
  }
  
  async getTripActivitiesByDayId(dayId: number): Promise<(TripActivity & ParkActivity)[]> {
    const activities = Array.from(this.tripActivities.values())
      .filter(activity => activity.trip_day_id === dayId)
      .sort((a, b) => a.order - b.order);
    
    // Join with park activities to get full details
    return activities.map(activity => {
      const parkActivity = this.parkActivities.get(activity.activity_id);
      if (!parkActivity) {
        throw new Error(`Park activity ${activity.activity_id} not found`);
      }
      return { ...activity, ...parkActivity };
    });
  }
  
  async createTripDay(insertDay: InsertTripDay): Promise<TripDay> {
    const id = this.getNextTripDayId();
    // Ensure all required fields have non-null/undefined values
    const day: TripDay = {
      ...insertDay,
      id,
      description: insertDay.description || null
    };
    this.tripDays.set(id, day);
    return day;
  }
  
  async createTripActivity(insertActivity: InsertTripActivity): Promise<TripActivity> {
    const id = this.getNextTripActivityId();
    // Ensure all required fields have non-null/undefined values
    const activity: TripActivity = {
      ...insertActivity,
      id,
      start_time: insertActivity.start_time || null,
      end_time: insertActivity.end_time || null,
      notes: insertActivity.notes || null
    };
    this.tripActivities.set(id, activity);
    return activity;
  }
  
  // Cleanup methods for rollback support
  async deleteTripDaysByTripId(tripId: number): Promise<void> {
    // Get all trip days for this trip
    const tripDays = Array.from(this.tripDays.values()).filter(day => day.trip_id === tripId);
    
    // Delete all associated activities first
    for (const day of tripDays) {
      const activities = Array.from(this.tripActivities.values()).filter(activity => activity.trip_day_id === day.id);
      for (const activity of activities) {
        this.tripActivities.delete(activity.id);
      }
    }
    
    // Delete the trip days
    for (const day of tripDays) {
      this.tripDays.delete(day.id);
    }
  }
  
  private initializeParkData() {
    const parkData: InsertNationalPark[] = [
      {
        name: "Yosemite National Park",
        state: "California",
        description: "Yosemite National Park is in California's Sierra Nevada mountains. It's famed for its giant, ancient sequoia trees, and for Tunnel View, the iconic vista of towering Bridalveil Fall and the granite cliffs of El Capitan and Half Dome.",
        image_url: "https://images.unsplash.com/photo-1576181256399-834e3b3a49bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.8651",
        longitude: "-119.5383",
        rating: "4.9",
        review_count: 2341,
        activities: ["Hiking", "Photography", "Waterfalls", "Biking", "Camping", "Scenic Views"],
        weather: {
          may: {
            high: "71°F",
            low: "42°F",
            precipitation: "1.3\""
          }
        },
        highlights: ["Waterfalls at Peak Flow", "Wildflower Blooms", "Mild Temperatures", "Wildlife Viewing", "Fewer Crowds (Weekdays)"],
        best_months: ["May", "June", "September"],
        monthly_notes: {
          may: "May offers ideal conditions with peak waterfall flow and blooming wildflowers."
        }
      },
      {
        name: "Grand Canyon National Park",
        state: "Arizona",
        description: "The Grand Canyon is a steep-sided canyon carved by the Colorado River in Arizona. For thousands of years, the Grand Canyon and its surrounding areas have been continuously inhabited by Native Americans.",
        image_url: "https://images.unsplash.com/photo-1527833172401-482728b8a56c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "36.0544",
        longitude: "-112.2583",
        rating: "4.8",
        review_count: 3256,
        activities: ["Hiking", "Photography", "Scenic Views", "Rafting", "Camping", "Wildlife Viewing"],
        weather: {
          may: {
            high: "75°F",
            low: "43°F",
            precipitation: "0.5\""
          }
        },
        highlights: ["Scenic Vistas", "Moderate Temperatures", "South Rim Accessibility", "Sunset Photography", "Hiking Trails"],
        best_months: ["April", "May", "September", "October"],
        monthly_notes: {
          may: "May is a perfect time to visit as temperatures are moderate and the crowds are smaller than summer months."
        }
      },
      {
        name: "Arches National Park",
        state: "Utah",
        description: "Arches National Park is a national park in eastern Utah. The park is known for preserving over 2,000 natural sandstone arches, including the world-famous Delicate Arch, as well as a variety of unique geological resources and formations.",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "38.7331",
        longitude: "-109.5925",
        rating: "4.7",
        review_count: 1892,
        activities: ["Rock Formations", "Photography", "Hiking", "Stargazing", "Scenic Drives", "Rock Climbing"],
        weather: {
          may: {
            high: "82°F",
            low: "50°F",
            precipitation: "0.7\""
          }
        },
        highlights: ["Delicate Arch", "Balanced Rock", "Landscape Arch", "Devils Garden", "Fiery Furnace"],
        best_months: ["April", "May", "September", "October"],
        monthly_notes: {
          may: "May offers pleasant temperatures for hiking and ideal lighting conditions for photography."
        }
      },
      {
        name: "Zion National Park",
        state: "Utah",
        description: "Zion National Park is a southwest Utah nature preserve distinguished by Zion Canyon's steep red cliffs. Zion Canyon Scenic Drive cuts through its main section, leading to forest trails along the Virgin River.",
        image_url: "https://images.unsplash.com/photo-1554482687-7cea9088cb0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.2982",
        longitude: "-113.0263",
        rating: "4.8",
        review_count: 2735,
        activities: ["Hiking", "Canyoneering", "Rock Climbing", "Photography", "Bird Watching", "Wildflowers"],
        weather: {
          may: {
            high: "78°F",
            low: "47°F",
            precipitation: "0.8\""
          }
        },
        highlights: ["Canyons", "Wildflowers", "Angels Landing", "The Narrows", "Emerald Pools"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May is perfect for wildflower viewing and hiking with moderate temperatures."
        }
      },
      {
        name: "Great Smoky Mountains National Park",
        state: "Tennessee/North Carolina",
        description: "Great Smoky Mountains National Park straddles the border of North Carolina and Tennessee. The sprawling landscape encompasses lush forests and an abundance of wildflowers that bloom year-round.",
        image_url: "https://images.unsplash.com/photo-1609867002727-5d6b89c736e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "35.6131",
        longitude: "-83.5532",
        rating: "4.7",
        review_count: 3421,
        activities: ["Hiking", "Wildlife Viewing", "Fishing", "Camping", "Scenic Drives", "Photography"],
        weather: {
          may: {
            high: "70°F",
            low: "50°F",
            precipitation: "4.5\""
          }
        },
        highlights: ["Spring Foliage", "Wildlife", "Cades Cove", "Waterfall Trails", "Wildflowers"],
        best_months: ["May", "June", "October"],
        monthly_notes: {
          may: "May showcases beautiful spring foliage and active wildlife throughout the park."
        }
      },
      {
        name: "Yellowstone National Park",
        state: "Wyoming/Montana/Idaho",
        description: "Yellowstone National Park is a nearly 3,500-sq.-mile wilderness recreation area atop a volcanic hotspot. Mostly in Wyoming, the park spreads into parts of Montana and Idaho too. Yellowstone features dramatic canyons, alpine rivers, lush forests, hot springs and gushing geysers – including its most famous, Old Faithful.",
        image_url: "https://images.unsplash.com/photo-1586228550252-b1b1e7e8b0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "44.4280",
        longitude: "-110.5885",
        rating: "4.8",
        review_count: 4521,
        activities: ["Hiking", "Wildlife Viewing", "Photography", "Camping", "Fishing", "Scenic Drives"],
        weather: {
          may: {
            high: "60°F",
            low: "30°F",
            precipitation: "2.1\""
          }
        },
        highlights: ["Old Faithful Geyser", "Grand Prismatic Spring", "Yellowstone Lake", "Grand Canyon of Yellowstone", "Wildlife Watching"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May is an excellent time to visit with spring wildlife activity and fewer crowds, though some higher elevation areas may still have snow."
        }
      },
      {
        name: "Glacier National Park",
        state: "Montana",
        description: "Glacier National Park is a 1,583-sq.-mile wilderness area in Montana's Rocky Mountains, with glacier-carved peaks and valleys running to the Canadian border. It's crossed by the mountainous Going-to-the-Sun Road. Among more than 700 miles of trails are routes to alpine meadows, crystal-clear lakes and glacier viewpoints.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "48.7596",
        longitude: "-113.7870",
        rating: "4.9",
        review_count: 2134,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Scenic Drives", "Camping", "Fishing"],
        weather: {
          may: {
            high: "55°F",
            low: "32°F",
            precipitation: "2.8\""
          }
        },
        highlights: ["Going-to-the-Sun Road", "Logan Pass", "Lake McDonald", "Glacier Views", "Alpine Lakes"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May can still have snow at higher elevations, but lower valleys offer beautiful spring hiking opportunities."
        }
      },
      {
        name: "Bryce Canyon National Park",
        state: "Utah",
        description: "Bryce Canyon National Park is a sprawling reserve in southern Utah, known for crimson-colored hoodoos, which are spire-shaped rock formations. The park's main area is Bryce Canyon, which despite its name, is not a canyon, but a collection of natural amphitheaters along the eastern side of the Paunsaugunt Plateau.",
        image_url: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.5930",
        longitude: "-112.1871",
        rating: "4.7",
        review_count: 1876,
        activities: ["Hiking", "Photography", "Stargazing", "Scenic Views", "Rock Formations", "Camping"],
        weather: {
          may: {
            high: "65°F",
            low: "35°F",
            precipitation: "1.2\""
          }
        },
        highlights: ["Bryce Amphitheater", "Hoodoo Formations", "Sunrise Point", "Sunset Point", "Thor's Hammer"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May offers pleasant daytime temperatures and excellent conditions for hiking among the hoodoos."
        }
      },
      {
        name: "Joshua Tree National Park",
        state: "California",
        description: "Joshua Tree National Park is a vast protected area in southern California. It's characterized by rugged rock formations and stark desert landscapes. Named for the region's twisted, bristled Joshua trees, the park straddles the cactus-dotted Colorado Desert and the Mojave Desert, which is higher and cooler.",
        image_url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "33.8734",
        longitude: "-115.9010",
        rating: "4.6",
        review_count: 2198,
        activities: ["Rock Climbing", "Hiking", "Photography", "Stargazing", "Rock Formations", "Camping"],
        weather: {
          may: {
            high: "85°F",
            low: "60°F",
            precipitation: "0.2\""
          }
        },
        highlights: ["Joshua Trees", "Skull Rock", "Arch Rock", "Keys View", "Cholla Cactus Garden"],
        best_months: ["March", "April", "May", "October", "November"],
        monthly_notes: {
          may: "May features warm but not extreme temperatures, perfect for desert hiking and rock climbing."
        }
      },
      {
        name: "Acadia National Park",
        state: "Maine",
        description: "Acadia National Park is a 47,000-acre Atlantic coast recreation area primarily on Maine's Mount Desert Island. Its landscape is marked by woodland, rocky beaches and glacier-scoured granite peaks such as Cadillac Mountain, the highest point on the United States' East Coast.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "44.3386",
        longitude: "-68.2733",
        rating: "4.8",
        review_count: 3012,
        activities: ["Hiking", "Photography", "Scenic Drives", "Wildlife Viewing", "Biking", "Fishing"],
        weather: {
          may: {
            high: "65°F",
            low: "45°F",
            precipitation: "3.1\""
          }
        },
        highlights: ["Cadillac Mountain", "Jordan Pond", "Thunder Hole", "Bar Harbor", "Carriage Roads"],
        best_months: ["May", "June", "July", "August", "September", "October"],
        monthly_notes: {
          may: "May brings spring blooms and comfortable hiking weather, with fewer crowds than peak summer months."
        }
      },
      {
        name: "Grand Teton National Park",
        state: "Wyoming",
        description: "Grand Teton National Park is located in northwestern Wyoming, south of Yellowstone. The park's dramatic mountain range rises abruptly from the valley floor, creating one of the most iconic skylines in America.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "43.7904",
        longitude: "-110.6818",
        rating: "4.8",
        review_count: 2987,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Camping", "Fishing", "Rock Climbing"],
        weather: {
          may: {
            high: "65°F",
            low: "35°F",
            precipitation: "2.0\""
          }
        },
        highlights: ["Teton Range", "Jackson Lake", "Jenny Lake", "Snake River", "Wildlife Viewing"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May still has snow at higher elevations, but valley floors offer excellent wildlife viewing as animals emerge from winter."
        }
      },
      {
        name: "Rocky Mountain National Park",
        state: "Colorado",
        description: "Rocky Mountain National Park is located in north-central Colorado. The park is known for its spectacular mountain scenery, abundant wildlife, varied climates and environments—from wooded forests to mountain tundra.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "40.3428",
        longitude: "-105.6836",
        rating: "4.7",
        review_count: 3421,
        activities: ["Hiking", "Wildlife Viewing", "Photography", "Camping", "Scenic Drives", "Stargazing"],
        weather: {
          may: {
            high: "60°F",
            low: "30°F",
            precipitation: "2.5\""
          }
        },
        highlights: ["Trail Ridge Road", "Bear Lake", "Alberta Falls", "Sprague Lake", "Elk Viewing"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers good wildlife viewing but Trail Ridge Road may still be closed at higher elevations due to snow."
        }
      },
      {
        name: "Sequoia National Park",
        state: "California",
        description: "Sequoia National Park is located in the southern Sierra Nevada mountains of California. The park is famous for its giant sequoia trees, including General Sherman, the largest tree on Earth by volume.",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "36.4864",
        longitude: "-118.5658",
        rating: "4.6",
        review_count: 2156,
        activities: ["Hiking", "Photography", "Camping", "Wildlife Viewing", "Scenic Views", "Stargazing"],
        weather: {
          may: {
            high: "70°F",
            low: "45°F",
            precipitation: "1.8\""
          }
        },
        highlights: ["General Sherman Tree", "Giant Forest", "Moro Rock", "Crystal Cave", "High Sierra Camps"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May is excellent for visiting the giant sequoias with mild weather and fewer crowds than summer."
        }
      },
      {
        name: "Kings Canyon National Park",
        state: "California",
        description: "Kings Canyon National Park is located in the southern Sierra Nevada, in Fresno and Tulare Counties, California. The park is known for its massive canyons, towering waterfalls, and giant sequoia groves.",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "36.8879",
        longitude: "-118.5551",
        rating: "4.5",
        review_count: 1543,
        activities: ["Hiking", "Photography", "Camping", "Rock Climbing", "Scenic Views", "Stargazing"],
        weather: {
          may: {
            high: "68°F",
            low: "42°F",
            precipitation: "1.6\""
          }
        },
        highlights: ["Kings Canyon Scenic Byway", "General Grant Tree", "Zumwalt Meadow", "Roaring River Falls", "Cedar Grove"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers pleasant weather for exploring the sequoia groves and canyon views with spring wildflowers."
        }
      },
      {
        name: "Death Valley National Park",
        state: "California/Nevada",
        description: "Death Valley National Park straddles the California-Nevada border. It's known for its vast, otherworldly desert landscapes, extreme temperatures, and unique geological features.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "36.5323",
        longitude: "-117.0794",
        rating: "4.4",
        review_count: 1876,
        activities: ["Photography", "Stargazing", "Scenic Drives", "Hiking", "Rock Formations", "Camping"],
        weather: {
          may: {
            high: "90°F",
            low: "65°F",
            precipitation: "0.1\""
          }
        },
        highlights: ["Badwater Basin", "Artists Palette", "Zabriskie Point", "Mesquite Flat Sand Dunes", "Dante's View"],
        best_months: ["March", "April", "May", "October", "November"],
        monthly_notes: {
          may: "May offers warm but manageable temperatures for desert exploration before the extreme summer heat."
        }
      },
      {
        name: "Capitol Reef National Park",
        state: "Utah",
        description: "Capitol Reef National Park is located in south-central Utah. The park preserves a long wrinkle in the earth known as the Waterpocket Fold, along with colorful sandstone cliffs, canyons, domes, and bridges.",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "38.2972",
        longitude: "-111.2615",
        rating: "4.5",
        review_count: 1654,
        activities: ["Hiking", "Photography", "Scenic Drives", "Rock Formations", "Stargazing", "Camping"],
        weather: {
          may: {
            high: "75°F",
            low: "45°F",
            precipitation: "0.8\""
          }
        },
        highlights: ["Capitol Reef", "Petroglyphs Trail", "Scenic Drive", "Hickman Bridge", "Fruita Historic District"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May offers ideal weather for exploring the colorful rock formations and historic pioneer sites."
        }
      },
      {
        name: "Canyonlands National Park",
        state: "Utah",
        description: "Canyonlands National Park is located in southeastern Utah. The Colorado River and its tributary the Green River divide the park into four districts: Mesa Arch, Island in the Sky, The Needles, and The Maze.",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "38.3269",
        longitude: "-109.8783",
        rating: "4.6",
        review_count: 1987,
        activities: ["Hiking", "Photography", "Rock Climbing", "Scenic Views", "Stargazing", "Camping"],
        weather: {
          may: {
            high: "78°F",
            low: "52°F",
            precipitation: "0.6\""
          }
        },
        highlights: ["Mesa Arch", "Grand View Point", "Delicate Arch Viewpoint", "White Rim Road", "The Needles"],
        best_months: ["April", "May", "September", "October"],
        monthly_notes: {
          may: "May provides excellent weather for hiking and photography with comfortable temperatures."
        }
      },
      {
        name: "Mesa Verde National Park",
        state: "Colorado",
        description: "Mesa Verde National Park is located in southwestern Colorado. The park protects some of the best-preserved Ancestral Puebloan archaeological sites in the United States, including spectacular cliff dwellings.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.2308",
        longitude: "-108.4618",
        rating: "4.4",
        review_count: 1543,
        activities: ["Hiking", "Photography", "Cultural Sites", "Scenic Views", "Camping", "Wildlife Viewing"],
        weather: {
          may: {
            high: "70°F",
            low: "40°F",
            precipitation: "1.0\""
          }
        },
        highlights: ["Cliff Palace", "Balcony House", "Long House", "Mesa Top Loop Road", "Wetherill Mesa"],
        best_months: ["May", "June", "September", "October"],
        monthly_notes: {
          may: "May is ideal for touring the cliff dwellings with mild temperatures and spring wildflowers."
        }
      },
      {
        name: "Great Sand Dunes National Park",
        state: "Colorado",
        description: "Great Sand Dunes National Park is located in southern Colorado. The park contains the tallest sand dunes in North America, rising over 750 feet against the dramatic backdrop of the Sangre de Cristo Mountains.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.7916",
        longitude: "-105.5943",
        rating: "4.3",
        review_count: 1876,
        activities: ["Hiking", "Photography", "Sand Surfing", "Stargazing", "Camping", "Wildlife Viewing"],
        weather: {
          may: {
            high: "68°F",
            low: "38°F",
            precipitation: "1.5\""
          }
        },
        highlights: ["Tall Dunes", "Medano Creek", "Sangre de Cristo Mountains", "Star Dune", "Sand Surfing"],
        best_months: ["May", "June", "September", "October"],
        monthly_notes: {
          may: "May offers great conditions for exploring the dunes before summer heat, with possible creek flow for cooling off."
        }
      },
      {
        name: "Black Canyon of the Gunnison National Park",
        state: "Colorado",
        description: "Black Canyon of the Gunnison National Park is located in western Colorado. The park protects a section of the Gunnison River canyon, known for its dark walls and dramatic, narrow gorge.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "38.5753",
        longitude: "-107.7416",
        rating: "4.5",
        review_count: 987,
        activities: ["Photography", "Hiking", "Rock Climbing", "Scenic Views", "Stargazing", "Wildlife Viewing"],
        weather: {
          may: {
            high: "65°F",
            low: "35°F",
            precipitation: "1.8\""
          }
        },
        highlights: ["South Rim Drive", "Painted Wall", "Sunset View", "Gunnison Point", "Cedar Point"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May provides excellent viewing conditions with clear skies and comfortable temperatures for rim trail hiking."
        }
      },
      {
        name: "Petrified Forest National Park",
        state: "Arizona",
        description: "Petrified Forest National Park is located in northeastern Arizona. The park preserves one of the world's largest concentrations of petrified wood and features colorful badlands, archaeological sites, and fossils.",
        image_url: "https://images.unsplash.com/photo-1527833172401-482728b8a56c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "34.9099",
        longitude: "-109.8068",
        rating: "4.3",
        review_count: 1234,
        activities: ["Hiking", "Photography", "Cultural Sites", "Scenic Drives", "Stargazing", "Fossil Viewing"],
        weather: {
          may: {
            high: "78°F",
            low: "48°F",
            precipitation: "0.5\""
          }
        },
        highlights: ["Petrified Wood", "Painted Desert", "Pueblo Ruins", "Route 66", "Crystal Forest"],
        best_months: ["April", "May", "September", "October"],
        monthly_notes: {
          may: "May offers excellent weather for exploring the colorful badlands and ancient petrified logs."
        }
      },
      {
        name: "Saguaro National Park",
        state: "Arizona",
        description: "Saguaro National Park is located in southern Arizona. The park protects part of the Sonoran Desert, including forests of towering saguaro cacti, the universal symbol of the American Southwest.",
        image_url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "32.2967",
        longitude: "-110.5756",
        rating: "4.4",
        review_count: 1876,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Scenic Drives", "Stargazing", "Camping"],
        weather: {
          may: {
            high: "88°F",
            low: "65°F",
            precipitation: "0.3\""
          }
        },
        highlights: ["Giant Saguaros", "Desert Wildlife", "Scenic Loop Drive", "Desert Museum", "Hiking Trails"],
        best_months: ["March", "April", "May", "October", "November"],
        monthly_notes: {
          may: "May provides warm but comfortable temperatures for desert hiking and saguaro viewing."
        }
      },
      {
        name: "Carlsbad Caverns National Park",
        state: "New Mexico",
        description: "Carlsbad Caverns National Park is located in the Chihuahuan Desert of southeastern New Mexico. The park preserves Carlsbad Cavern and numerous other caves formed in Permian-age limestone.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "32.1479",
        longitude: "-104.5567",
        rating: "4.5",
        review_count: 2543,
        activities: ["Cave Tours", "Photography", "Wildlife Viewing", "Hiking", "Stargazing", "Bat Viewing"],
        weather: {
          may: {
            high: "82°F",
            low: "58°F",
            precipitation: "0.8\""
          }
        },
        highlights: ["Big Room", "Bat Flight Program", "King's Palace", "Natural Entrance", "Lechuguilla Cave"],
        best_months: ["April", "May", "September", "October"],
        monthly_notes: {
          may: "May is ideal for visiting the caves with comfortable surface temperatures and active bat flights beginning."
        }
      },
      {
        name: "Guadalupe Mountains National Park",
        state: "Texas",
        description: "Guadalupe Mountains National Park is located in far western Texas. The park contains Guadalupe Peak, the highest point in Texas, and features rugged mountain wilderness and diverse desert and mountain ecosystems.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "31.8955",
        longitude: "-104.8607",
        rating: "4.2",
        review_count: 987,
        activities: ["Hiking", "Photography", "Backpacking", "Wildlife Viewing", "Stargazing", "Rock Climbing"],
        weather: {
          may: {
            high: "79°F",
            low: "55°F",
            precipitation: "0.9\""
          }
        },
        highlights: ["Guadalupe Peak", "Devil's Hall Trail", "McKittrick Canyon", "El Capitan", "Pine Springs"],
        best_months: ["April", "May", "October", "November"],
        monthly_notes: {
          may: "May offers excellent hiking conditions with moderate temperatures and spring wildflowers in the canyons."
        }
      },
      {
        name: "Big Bend National Park",
        state: "Texas",
        description: "Big Bend National Park is located in southwest Texas along the Rio Grande. The park encompasses a large area of the Chihuahuan Desert and includes the entire Chisos mountain range.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "29.1275",
        longitude: "-103.2420",
        rating: "4.6",
        review_count: 2134,
        activities: ["Hiking", "Photography", "Rafting", "Wildlife Viewing", "Stargazing", "Hot Springs"],
        weather: {
          may: {
            high: "89°F",
            low: "65°F",
            precipitation: "0.7\""
          }
        },
        highlights: ["Santa Elena Canyon", "Chisos Mountains", "Rio Grande Village", "Lost Mine Trail", "Hot Springs"],
        best_months: ["March", "April", "May", "October", "November"],
        monthly_notes: {
          may: "May provides warm but manageable temperatures for exploring this vast desert park along the Rio Grande."
        }
      },
      {
        name: "Hot Springs National Park",
        state: "Arkansas",
        description: "Hot Springs National Park is located in central Arkansas. The park preserves the natural hot springs and the historic bathhouse row in the city of Hot Springs, offering a unique blend of nature and history.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "34.5117",
        longitude: "-93.0429",
        rating: "4.1",
        review_count: 1543,
        activities: ["Hiking", "Photography", "Cultural Sites", "Scenic Views", "Hot Springs", "Historic Tours"],
        weather: {
          may: {
            high: "78°F",
            low: "60°F",
            precipitation: "4.2\""
          }
        },
        highlights: ["Bathhouse Row", "Hot Springs", "Hiking Trails", "Historic District", "Gulpha Gorge"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May offers pleasant temperatures for exploring both the historic sites and natural hot springs."
        }
      },
      {
        name: "Mammoth Cave National Park",
        state: "Kentucky",
        description: "Mammoth Cave National Park is located in central Kentucky. The park preserves the world's longest known cave system, with more than 420 miles of surveyed passageways through limestone bedrock.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.1862",
        longitude: "-86.1038",
        rating: "4.3",
        review_count: 2876,
        activities: ["Cave Tours", "Hiking", "Photography", "Wildlife Viewing", "Camping", "Fishing"],
        weather: {
          may: {
            high: "75°F",
            low: "55°F",
            precipitation: "4.0\""
          }
        },
        highlights: ["Historic Tour", "Wild Cave Tour", "Green River", "Cedar Sink", "Sand Cave"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May provides comfortable surface temperatures and cave tours are in full operation."
        }
      },
      {
        name: "Great Basin National Park",
        state: "Nevada",
        description: "Great Basin National Park is located in eastern Nevada. The park preserves a representative portion of the Great Basin Desert and includes Wheeler Peak, ancient bristlecone pines, and Lehman Caves.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "39.0055",
        longitude: "-114.2579",
        rating: "4.4",
        review_count: 876,
        activities: ["Hiking", "Photography", "Cave Tours", "Stargazing", "Wildlife Viewing", "Camping"],
        weather: {
          may: {
            high: "65°F",
            low: "40°F",
            precipitation: "1.5\""
          }
        },
        highlights: ["Wheeler Peak", "Bristlecone Pine Grove", "Lehman Caves", "Teresa Lake", "Stella Lake"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May can still have snow at higher elevations, but lower areas offer good hiking conditions."
        }
      },
      {
        name: "Lassen Volcanic National Park",
        state: "California",
        description: "Lassen Volcanic National Park is located in northeastern California. The park showcases all four types of volcanoes and features hydrothermal areas, clear mountain lakes, and diverse forest communities.",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "40.4977",
        longitude: "-121.4207",
        rating: "4.2",
        review_count: 1234,
        activities: ["Hiking", "Photography", "Camping", "Wildlife Viewing", "Stargazing", "Hot Springs"],
        weather: {
          may: {
            high: "60°F",
            low: "35°F",
            precipitation: "3.2\""
          }
        },
        highlights: ["Lassen Peak", "Bumpass Hell", "Manzanita Lake", "Devastated Area", "Sulphur Works"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May still has snow at higher elevations, but lower elevation trails and lakes are accessible."
        }
      },
      {
        name: "Redwood National and State Parks",
        state: "California",
        description: "Redwood National and State Parks are located along the coast of northern California. The parks preserve nearly half of all remaining coast redwood trees, the tallest trees on Earth.",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "41.2132",
        longitude: "-124.0046",
        rating: "4.7",
        review_count: 3456,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Scenic Drives", "Camping", "Beach Activities"],
        weather: {
          may: {
            high: "65°F",
            low: "45°F",
            precipitation: "3.5\""
          }
        },
        highlights: ["Tall Trees Grove", "Fern Canyon", "Gold Bluffs Beach", "Lady Bird Johnson Grove", "Prairie Creek"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers mild temperatures and fewer crowds for exploring the magnificent redwood groves."
        }
      },
      {
        name: "Crater Lake National Park",
        state: "Oregon",
        description: "Crater Lake National Park is located in southern Oregon. The park preserves Crater Lake, a caldera lake formed by the collapse of Mount Mazama, renowned for its deep blue color and water clarity.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "42.8684",
        longitude: "-122.1685",
        rating: "4.8",
        review_count: 2987,
        activities: ["Photography", "Hiking", "Scenic Drives", "Wildlife Viewing", "Camping", "Stargazing"],
        weather: {
          may: {
            high: "50°F",
            low: "30°F",
            precipitation: "2.5\""
          }
        },
        highlights: ["Crater Lake", "Rim Drive", "Wizard Island", "Mount Scott", "Phantom Ship"],
        best_months: ["July", "August", "September"],
        monthly_notes: {
          may: "May often still has heavy snow. Most facilities and roads remain closed until late June or July."
        }
      },
      {
        name: "Mount Rainier National Park",
        state: "Washington",
        description: "Mount Rainier National Park is located in west-central Washington. The park preserves Mount Rainier, an active stratovolcano, along with glaciers, old-growth forests, and subalpine meadows.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "46.8523",
        longitude: "-121.7603",
        rating: "4.7",
        review_count: 3654,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Camping", "Mountain Climbing", "Wildflowers"],
        weather: {
          may: {
            high: "60°F",
            low: "40°F",
            precipitation: "4.0\""
          }
        },
        highlights: ["Mount Rainier", "Paradise", "Sunrise", "Reflection Lakes", "Grove of the Patriarchs"],
        best_months: ["July", "August", "September"],
        monthly_notes: {
          may: "May can have snow at higher elevations, but lower trails and visitor centers are typically accessible."
        }
      },
      {
        name: "Olympic National Park",
        state: "Washington",
        description: "Olympic National Park is located on the Olympic Peninsula in western Washington. The park preserves nearly one million acres of wilderness including temperate rainforests, rugged coastline, and glaciated mountains.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "47.8021",
        longitude: "-123.6044",
        rating: "4.8",
        review_count: 4321,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Camping", "Beach Activities", "Hot Springs"],
        weather: {
          may: {
            high: "65°F",
            low: "45°F",
            precipitation: "3.8\""
          }
        },
        highlights: ["Hoh Rainforest", "Hurricane Ridge", "Ruby Beach", "Sol Duc Hot Springs", "Lake Crescent"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers good access to coastal areas and rainforests, though high country may still have snow."
        }
      },
      {
        name: "North Cascades National Park",
        state: "Washington",
        description: "North Cascades National Park is located in northern Washington. The park preserves a portion of the Cascade Range, featuring rugged mountain peaks, pristine lakes, and extensive wilderness areas.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "48.7718",
        longitude: "-121.2985",
        rating: "4.6",
        review_count: 1876,
        activities: ["Hiking", "Photography", "Backpacking", "Wildlife Viewing", "Camping", "Mountain Climbing"],
        weather: {
          may: {
            high: "60°F",
            low: "40°F",
            precipitation: "3.5\""
          }
        },
        highlights: ["Diablo Lake", "Ross Lake", "Cascade Pass", "Blue Lake", "Thunder Creek"],
        best_months: ["July", "August", "September"],
        monthly_notes: {
          may: "May typically has snow at higher elevations, limiting access to many trails and backcountry areas."
        }
      },
      {
        name: "Everglades National Park",
        state: "Florida",
        description: "Everglades National Park is located in southern Florida. The park preserves the southern portion of the Everglades, a vast wetland ecosystem known as the 'River of Grass' and home to diverse wildlife.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "25.2866",
        longitude: "-80.8987",
        rating: "4.4",
        review_count: 3987,
        activities: ["Wildlife Viewing", "Photography", "Hiking", "Camping", "Fishing", "Bird Watching"],
        weather: {
          may: {
            high: "85°F",
            low: "70°F",
            precipitation: "6.5\""
          }
        },
        highlights: ["Anhinga Trail", "Flamingo", "Shark Valley", "Coe Visitor Center", "Ten Thousand Islands"],
        best_months: ["December", "January", "February", "March", "April"],
        monthly_notes: {
          may: "May begins the wet season with higher temperatures, humidity, and mosquito activity."
        }
      },
      {
        name: "Biscayne National Park",
        state: "Florida",
        description: "Biscayne National Park is located in southeastern Florida. The park preserves Biscayne Bay and its offshore barrier reefs, with 95% of the park underwater, protecting coral reefs and marine life.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "25.4900",
        longitude: "-80.2082",
        rating: "4.2",
        review_count: 1234,
        activities: ["Snorkeling", "Photography", "Boat Tours", "Fishing", "Wildlife Viewing", "Camping"],
        weather: {
          may: {
            high: "84°F",
            low: "73°F",
            precipitation: "6.8\""
          }
        },
        highlights: ["Coral Reefs", "Boca Chita Key", "Elliott Key", "Maritime Heritage Trail", "Stiltsville"],
        best_months: ["December", "January", "February", "March", "April"],
        monthly_notes: {
          may: "May marks the beginning of the wet season with increased humidity and afternoon thunderstorms."
        }
      },
      {
        name: "Dry Tortugas National Park",
        state: "Florida",
        description: "Dry Tortugas National Park is located about 70 miles west of Key West, Florida. The park preserves Fort Jefferson and seven small islands composed of sand and coral reefs.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "24.6286",
        longitude: "-82.8732",
        rating: "4.5",
        review_count: 987,
        activities: ["Snorkeling", "Photography", "Bird Watching", "Camping", "Fishing", "Historic Tours"],
        weather: {
          may: {
            high: "83°F",
            low: "76°F",
            precipitation: "3.2\""
          }
        },
        highlights: ["Fort Jefferson", "Coral Reefs", "Sea Turtles", "Bird Watching", "Crystal Clear Waters"],
        best_months: ["March", "April", "May", "October", "November"],
        monthly_notes: {
          may: "May offers excellent conditions before the peak summer heat and hurricane season."
        }
      },
      {
        name: "Congaree National Park",
        state: "South Carolina",
        description: "Congaree National Park is located in central South Carolina. The park preserves the largest intact expanse of old-growth bottomland hardwood forest in the southeastern United States.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "33.7948",
        longitude: "-80.7821",
        rating: "4.1",
        review_count: 1543,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Camping", "Canoeing", "Bird Watching"],
        weather: {
          may: {
            high: "82°F",
            low: "62°F",
            precipitation: "3.8\""
          }
        },
        highlights: ["Boardwalk Loop", "Fireflies", "Old-Growth Forest", "Congaree River", "Champion Trees"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May offers pleasant temperatures for hiking and is firefly season in the park."
        }
      },
      {
        name: "Indiana Dunes National Park",
        state: "Indiana",
        description: "Indiana Dunes National Park is located along the southern shore of Lake Michigan in northwestern Indiana. The park preserves sand dunes, wetlands, prairies, and forests along 15 miles of lakefront.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "41.6533",
        longitude: "-87.0934",
        rating: "4.0",
        review_count: 2134,
        activities: ["Hiking", "Photography", "Beach Activities", "Wildlife Viewing", "Bird Watching", "Stargazing"],
        weather: {
          may: {
            high: "68°F",
            low: "50°F",
            precipitation: "3.5\""
          }
        },
        highlights: ["Lake Michigan Beach", "Mount Baldy", "West Beach", "Dune Succession Trail", "Great Marsh"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers comfortable temperatures for beach activities and spring wildflower viewing."
        }
      },
      {
        name: "Cuyahoga Valley National Park",
        state: "Ohio",
        description: "Cuyahoga Valley National Park is located in northeastern Ohio between Cleveland and Akron. The park preserves rural landscapes along the Cuyahoga River, including waterfalls, hills, trails, and historic structures.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "41.2808",
        longitude: "-81.5678",
        rating: "4.2",
        review_count: 2876,
        activities: ["Hiking", "Photography", "Biking", "Wildlife Viewing", "Scenic Drives", "Historic Tours"],
        weather: {
          may: {
            high: "70°F",
            low: "50°F",
            precipitation: "3.8\""
          }
        },
        highlights: ["Brandywine Falls", "Ohio & Erie Canal Towpath", "Ledges Trail", "Scenic Railroad", "Historic Buildings"],
        best_months: ["May", "June", "July", "August", "September", "October"],
        monthly_notes: {
          may: "May offers perfect conditions for hiking and biking with spring foliage and comfortable temperatures."
        }
      },
      {
        name: "Gateway Arch National Park",
        state: "Missouri",
        description: "Gateway Arch National Park is located in St. Louis, Missouri. The park preserves the Gateway Arch, a 630-foot monument to the westward expansion of the United States and the centerpiece of downtown St. Louis.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "38.6247",
        longitude: "-90.1848",
        rating: "4.3",
        review_count: 4567,
        activities: ["Photography", "Cultural Sites", "Historic Tours", "Scenic Views", "Museums", "River Activities"],
        weather: {
          may: {
            high: "75°F",
            low: "58°F",
            precipitation: "4.2\""
          }
        },
        highlights: ["Gateway Arch", "Museum of Westward Expansion", "Mississippi River", "Old Courthouse", "Tram Ride"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May provides comfortable weather for visiting the arch and exploring the riverfront area."
        }
      },
      {
        name: "Theodore Roosevelt National Park",
        state: "North Dakota",
        description: "Theodore Roosevelt National Park is located in western North Dakota. The park preserves part of the badlands where President Theodore Roosevelt ranched and was inspired to pursue conservation efforts.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "47.1751",
        longitude: "-103.4544",
        rating: "4.4",
        review_count: 1234,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Scenic Drives", "Camping", "Stargazing"],
        weather: {
          may: {
            high: "68°F",
            low: "45°F",
            precipitation: "2.5\""
          }
        },
        highlights: ["Painted Canyon", "Scenic Loop Drive", "Petrified Forest", "Wildlife Prairie Dogs", "Roosevelt Cabin"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers excellent weather for exploring the badlands with comfortable temperatures and spring wildlife activity."
        }
      },
      {
        name: "Badlands National Park",
        state: "South Dakota",
        description: "Badlands National Park is located in southwestern South Dakota. The park preserves sharply eroded buttes and pinnacles, along with the largest undisturbed mixed grass prairie in the United States.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "43.8791",
        longitude: "-102.5002",
        rating: "4.5",
        review_count: 2543,
        activities: ["Hiking", "Photography", "Wildlife Viewing", "Fossil Hunting", "Stargazing", "Scenic Drives"],
        weather: {
          may: {
            high: "70°F",
            low: "48°F",
            precipitation: "2.8\""
          }
        },
        highlights: ["Badlands Loop Road", "Ben Reifel Visitor Center", "Fossil Exhibits", "Door Trail", "Notch Trail"],
        best_months: ["May", "June", "September", "October"],
        monthly_notes: {
          may: "May provides ideal conditions for exploring the badlands formations with comfortable temperatures."
        }
      },
      {
        name: "Wind Cave National Park",
        state: "South Dakota",
        description: "Wind Cave National Park is located in the Black Hills of South Dakota. The park preserves Wind Cave, one of the longest and most complex caves in the world, along with mixed-grass prairie ecosystem.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "43.5579",
        longitude: "-103.4962",
        rating: "4.2",
        review_count: 1876,
        activities: ["Cave Tours", "Hiking", "Wildlife Viewing", "Photography", "Camping", "Stargazing"],
        weather: {
          may: {
            high: "67°F",
            low: "43°F",
            precipitation: "3.2\""
          }
        },
        highlights: ["Wind Cave", "Prairie Dog Towns", "Bison Herds", "Elk Mountain Campground", "Rankin Ridge"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May offers excellent cave touring weather and good wildlife viewing on the prairie above."
        }
      },
      {
        name: "Voyageurs National Park",
        state: "Minnesota",
        description: "Voyageurs National Park is located in northern Minnesota along the Canadian border. The park preserves a portion of the historic route of French-Canadian fur traders and features pristine lakes and boreal forests.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "48.4839",
        longitude: "-92.8386",
        rating: "4.3",
        review_count: 1543,
        activities: ["Canoeing", "Fishing", "Photography", "Camping", "Wildlife Viewing", "Historic Tours"],
        weather: {
          may: {
            high: "65°F",
            low: "45°F",
            precipitation: "3.0\""
          }
        },
        highlights: ["Kabetogama Lake", "Rainy Lake", "Kettle Falls", "Ellsworth Rock Gardens", "Gold Mine"],
        best_months: ["May", "June", "July", "August", "September"],
        monthly_notes: {
          may: "May marks the beginning of the canoeing season with ice-out and comfortable temperatures for water activities."
        }
      },
      {
        name: "Isle Royale National Park",
        state: "Michigan",
        description: "Isle Royale National Park is located on a remote island in Lake Superior. The park preserves a wilderness archipelago with pristine forests, clear lakes, and a predator-prey relationship between wolves and moose.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "48.0063",
        longitude: "-88.5566",
        rating: "4.4",
        review_count: 987,
        activities: ["Hiking", "Backpacking", "Fishing", "Wildlife Viewing", "Canoeing", "Photography"],
        weather: {
          may: {
            high: "58°F",
            low: "38°F",
            precipitation: "2.8\""
          }
        },
        highlights: ["Greenstone Ridge Trail", "Rock Harbor", "Windigo", "Scoville Point", "Moose and Wolves"],
        best_months: ["June", "July", "August", "September"],
        monthly_notes: {
          may: "May can still be cool and park facilities may not be fully operational until June."
        }
      },
      {
        name: "New River Gorge National Park",
        state: "West Virginia",
        description: "New River Gorge National Park is located in southern West Virginia. The park preserves the New River Gorge, featuring some of the country's best whitewater rafting, rock climbing, and hiking.",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "37.9393",
        longitude: "-81.0676",
        rating: "4.6",
        review_count: 2134,
        activities: ["Rock Climbing", "Hiking", "Rafting", "Photography", "Wildlife Viewing", "Camping"],
        weather: {
          may: {
            high: "74°F",
            low: "52°F",
            precipitation: "4.1\""
          }
        },
        highlights: ["New River Gorge Bridge", "Endless Wall Trail", "Long Point", "Sandstone Falls", "Whitewater Rafting"],
        best_months: ["April", "May", "June", "September", "October"],
        monthly_notes: {
          may: "May provides excellent weather for all outdoor activities with spring foliage and comfortable temperatures."
        }
      },
      {
        name: "Pinnacles National Park",
        state: "California",
        description: "Pinnacles National Park is located in central California. The park preserves the remains of an extinct volcano, featuring towering rock spires, talus caves, and diverse wildlife including California condors.",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        latitude: "36.4906",
        longitude: "-121.1825",
        rating: "4.3",
        review_count: 1765,
        activities: ["Hiking", "Rock Climbing", "Photography", "Wildlife Viewing", "Cave Exploring", "Stargazing"],
        weather: {
          may: {
            high: "78°F",
            low: "50°F",
            precipitation: "0.8\""
          }
        },
        highlights: ["High Peaks", "Bear Gulch Cave", "Balconies Cave", "California Condors", "Rock Formations"],
        best_months: ["March", "April", "May", "October", "November"],
        monthly_notes: {
          may: "May offers ideal hiking weather with moderate temperatures and spring wildflower blooms."
        }
      }
    ];
    
    parkData.forEach((park) => {
      const id = this.getNextParkId();
      const newPark: NationalPark = { ...park, id };
      this.parks.set(id, newPark);
    });
  }
  
  private initializeParkActivities() {
    // Add sample activities for each park
    const activitiesData: InsertParkActivity[] = [
      // Yosemite Activities (Park ID 1)
      {
        park_id: 1,
        name: "Yosemite Valley Visitor Center",
        description: "Start your Yosemite adventure at the main visitor center to get maps, information, and plan your visit.",
        category: "visitor center",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "37.8651",
        longitude: "-119.5383",
        image_url: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d",
        best_time_of_day: "morning",
        best_months: ["April", "May", "June", "July", "August", "September", "October"],
        tips: "Visit early in the morning to avoid crowds and get the best information for your day."
      },
      {
        park_id: 1,
        name: "Mist Trail to Vernal Fall",
        description: "A scenic hike that takes you alongside the Merced River to the spectacular Vernal Fall.",
        category: "hiking",
        duration_minutes: 180,
        difficulty: "moderate",
        latitude: "37.7275",
        longitude: "-119.5582",
        image_url: "https://images.unsplash.com/photo-1564493486388-8cacdfdad4c0",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July"],
        tips: "Bring a waterproof jacket as you'll get wet from the mist, especially in spring."
      },
      {
        park_id: 1,
        name: "Glacier Point",
        description: "One of the most spectacular viewpoints in Yosemite, offering panoramic views of Yosemite Valley, Half Dome, and the High Sierra.",
        category: "viewpoint",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "37.7281",
        longitude: "-119.5731",
        image_url: "https://images.unsplash.com/photo-1551041777-575d3855ca71",
        best_time_of_day: "sunset",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Sunset here is magical, but bring layers as it can get cold quickly."
      },
      {
        park_id: 1,
        name: "Mariposa Grove of Giant Sequoias",
        description: "Home to over 500 mature giant sequoias, some of the largest trees in the world.",
        category: "nature walk",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "37.5138",
        longitude: "-119.6010",
        image_url: "https://images.unsplash.com/photo-1561448817-ca989eac5a0e",
        best_time_of_day: "afternoon",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Take the shuttle during peak season as parking is limited."
      },
      {
        park_id: 1,
        name: "Tuolumne Meadows",
        description: "A spectacular high-elevation meadow area with gentle hiking trails and stunning mountain views.",
        category: "hiking",
        duration_minutes: 150,
        difficulty: "easy",
        latitude: "37.8746",
        longitude: "-119.3588",
        image_url: "https://images.unsplash.com/photo-1535086151425-4d0ac15df962",
        best_time_of_day: "afternoon",
        best_months: ["July", "August", "September"],
        tips: "Check road conditions as Tioga Road is closed in winter."
      },
      
      // Grand Canyon Activities (Park ID 2)
      {
        park_id: 2,
        name: "South Rim Visitor Center",
        description: "The main visitor center provides essential information, exhibits, and ranger programs.",
        category: "visitor center",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "36.0544",
        longitude: "-112.2583",
        image_url: "https://images.unsplash.com/photo-1575326504884-d4ff54f05229",
        best_time_of_day: "morning",
        best_months: ["March", "April", "May", "September", "October", "November"],
        tips: "Start your visit here to get maps and current trail conditions."
      },
      {
        park_id: 2,
        name: "Bright Angel Trail",
        description: "A well-maintained trail that descends into the canyon with stunning views throughout.",
        category: "hiking",
        duration_minutes: 240,
        difficulty: "difficult",
        latitude: "36.0572",
        longitude: "-112.1458",
        image_url: "https://images.unsplash.com/photo-1589223847937-68e56ece814e",
        best_time_of_day: "early morning",
        best_months: ["March", "April", "May", "September", "October"],
        tips: "Carry plenty of water and remember it's twice as hard coming back up as going down."
      },
      {
        park_id: 2,
        name: "Desert View Watchtower",
        description: "A 70-foot tower offering some of the widest panoramas of the canyon and Colorado River.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "36.0458",
        longitude: "-111.8265",
        image_url: "https://images.unsplash.com/photo-1606431285042-347238999de9",
        best_time_of_day: "sunset",
        best_months: ["April", "May", "June", "September", "October"],
        tips: "The drive here from the main village area takes about 45 minutes."
      },
      {
        park_id: 2,
        name: "Rim Trail",
        description: "A mostly flat trail that follows the canyon rim with numerous viewpoints.",
        category: "hiking",
        duration_minutes: 180,
        difficulty: "easy",
        latitude: "36.0600",
        longitude: "-112.1430",
        image_url: "https://images.unsplash.com/photo-1545237505-718d3979a4ed",
        best_time_of_day: "afternoon",
        best_months: ["March", "April", "May", "September", "October", "November"],
        tips: "Perfect for casual walkers and families. Use the shuttle to return to your starting point."
      },
      {
        park_id: 2,
        name: "Colorado River Rafting",
        description: "Experience the Grand Canyon from the bottom up on a rafting adventure.",
        category: "water activity",
        duration_minutes: 480,
        difficulty: "moderate",
        latitude: "36.0986",
        longitude: "-112.0972",
        image_url: "https://images.unsplash.com/photo-1539187577537-e54cf54ae3b3",
        best_time_of_day: "full day",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Book well in advance as permits are limited and highly sought after."
      },
      
      // Arches Activities (Park ID 3)
      {
        park_id: 3,
        name: "Delicate Arch Trail",
        description: "A moderate hike to Utah's iconic natural arch, featured on state license plates.",
        category: "hiking",
        duration_minutes: 120,
        difficulty: "moderate",
        latitude: "38.7436",
        longitude: "-109.4993",
        image_url: "https://images.unsplash.com/photo-1577401239170-897942555fb3",
        best_time_of_day: "sunset",
        best_months: ["April", "May", "September", "October"],
        tips: "Go for sunset photography, but bring a headlamp for the return hike in the dark."
      },
      {
        park_id: 3,
        name: "Devils Garden Trail",
        description: "The longest maintained trail in the park, featuring several spectacular arches.",
        category: "hiking",
        duration_minutes: 180,
        difficulty: "moderate",
        latitude: "38.7831",
        longitude: "-109.5927",
        image_url: "https://images.unsplash.com/photo-1537155290481-e3ff2a59fd67",
        best_time_of_day: "morning",
        best_months: ["April", "May", "September", "October"],
        tips: "Start early to avoid crowds and midday heat. Bring plenty of water."
      },
      {
        park_id: 3,
        name: "Windows Section",
        description: "A high concentration of easy-to-access arches in close proximity.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "38.7878",
        longitude: "-109.5372",
        image_url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
        best_time_of_day: "sunrise",
        best_months: ["March", "April", "May", "September", "October", "November"],
        tips: "This is a photographer's paradise at sunrise or sunset."
      },
      {
        park_id: 3,
        name: "Balanced Rock",
        description: "A massive boulder perched atop a pedestal of rock, appearing to defy gravity.",
        category: "viewpoint",
        duration_minutes: 30,
        difficulty: "easy",
        latitude: "38.7011",
        longitude: "-109.5645",
        image_url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd",
        best_time_of_day: "afternoon",
        best_months: ["All year"],
        tips: "Perfect stop for those with limited time. Easily accessible from the main park road."
      },
      {
        park_id: 3,
        name: "Stargazing at Garden of Eden",
        description: "Experience the incredible dark skies of Arches National Park.",
        category: "astronomy",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "38.7653",
        longitude: "-109.5273",
        image_url: "https://images.unsplash.com/photo-1607977027972-421267f71a17",
        best_time_of_day: "night",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Bring a red flashlight to preserve night vision, and dress warmly as desert temperatures drop at night."
      },
      // Yellowstone Activities (Park ID 6)
      {
        park_id: 6,
        name: "Old Faithful Geyser",
        description: "Watch the world's most famous geyser erupt approximately every 90 minutes.",
        category: "viewpoint",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "44.4605",
        longitude: "-110.8281",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "any",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Check eruption predictions at the visitor center. Arrive early for the best viewing spots."
      },
      {
        park_id: 6,
        name: "Grand Prismatic Spring",
        description: "The largest hot spring in the United States, famous for its rainbow colors.",
        category: "viewpoint",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "44.5252",
        longitude: "-110.8385",
        image_url: "https://images.unsplash.com/photo-1586228550252-b1b1e7e8b0d7",
        best_time_of_day: "afternoon",
        best_months: ["June", "July", "August", "September"],
        tips: "The boardwalk can be slippery when wet. Best colors visible on sunny days."
      },
      // Glacier Activities (Park ID 7)
      {
        park_id: 7,
        name: "Going-to-the-Sun Road",
        description: "A spectacular 50-mile mountain road crossing the Continental Divide.",
        category: "scenic drive",
        duration_minutes: 180,
        difficulty: "easy",
        latitude: "48.7596",
        longitude: "-113.7870",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "morning",
        best_months: ["June", "July", "August", "September"],
        tips: "Road typically opens fully by late June. Start early to avoid crowds and afternoon thunderstorms."
      },
      {
        park_id: 7,
        name: "Hidden Lake Overlook",
        description: "A moderately easy hike to a stunning overlook with glacier and lake views.",
        category: "hiking",
        duration_minutes: 180,
        difficulty: "moderate",
        latitude: "48.6951",
        longitude: "-113.7184",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["July", "August", "September"],
        tips: "Trail can be snow-covered until mid-July. Watch for mountain goats and bears."
      },
      // Bryce Canyon Activities (Park ID 8)
      {
        park_id: 8,
        name: "Sunrise Point",
        description: "One of the most popular viewpoints for watching sunrise over the hoodoos.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "37.6261",
        longitude: "-112.1652",
        image_url: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4",
        best_time_of_day: "early morning",
        best_months: ["April", "May", "June", "September", "October"],
        tips: "Arrive 30 minutes before sunrise for the best spot. Bring warm clothes as it can be cold in early morning."
      },
      {
        park_id: 8,
        name: "Navajo Loop Trail",
        description: "Descend into Bryce Canyon among the famous hoodoo rock formations.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "moderate",
        latitude: "37.6209",
        longitude: "-112.1660",
        image_url: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "The trail can be icy in winter and early spring. Wear good hiking boots with traction."
      },
      // Joshua Tree Activities (Park ID 9)
      {
        park_id: 9,
        name: "Skull Rock",
        description: "A large boulder formation that resembles a skull, easily accessible from the road.",
        category: "viewpoint",
        duration_minutes: 30,
        difficulty: "easy",
        latitude: "33.9285",
        longitude: "-116.1092",
        image_url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c",
        best_time_of_day: "afternoon",
        best_months: ["March", "April", "May", "October", "November"],
        tips: "Great for families with children. Perfect spot for photos and a quick desert experience."
      },
      {
        park_id: 9,
        name: "Keys View",
        description: "Panoramic view of the Coachella Valley and San Andreas Fault from 5,185 feet.",
        category: "viewpoint",
        duration_minutes: 45,
        difficulty: "easy",
        latitude: "33.9418",
        longitude: "-116.1795",
        image_url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c",
        best_time_of_day: "sunrise",
        best_months: ["All year"],
        tips: "On clear days, you can see the Salton Sea. Best visibility in winter months."
      },
      // Acadia Activities (Park ID 10)
      {
        park_id: 10,
        name: "Cadillac Mountain Summit",
        description: "The highest point on the U.S. East Coast, offering 360-degree views.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "44.3533",
        longitude: "-68.2254",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "sunrise",
        best_months: ["May", "June", "July", "August", "September", "October"],
        tips: "First place to see sunrise in the U.S. from October to March. Make reservations during peak season."
      },
      {
        park_id: 10,
        name: "Jordan Pond Path",
        description: "A peaceful carriage road loop around crystal-clear Jordan Pond with mountain views.",
        category: "hiking",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "44.3227",
        longitude: "-68.2514",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September", "October"],
        tips: "Stop at Jordan Pond House for famous popovers. Path is suitable for all ages."
      },
      // Grand Teton Activities (Park ID 11)
      {
        park_id: 11,
        name: "Jenny Lake",
        description: "A pristine alpine lake surrounded by towering peaks, offering boat rides and hiking trails.",
        category: "viewpoint",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "43.7537",
        longitude: "-110.7285",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "morning",
        best_months: ["June", "July", "August", "September"],
        tips: "Take the boat shuttle across the lake to save time or enjoy the walk around the perimeter."
      },
      {
        park_id: 11,
        name: "Cascade Canyon Trail",
        description: "A popular hiking trail offering spectacular views of the Teton Range and alpine scenery.",
        category: "hiking",
        duration_minutes: 240,
        difficulty: "moderate",
        latitude: "43.7584",
        longitude: "-110.7423",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "morning",
        best_months: ["June", "July", "August", "September"],
        tips: "Start early to avoid crowds and afternoon thunderstorms. Trail can be busy during peak season."
      },
      // Rocky Mountain Activities (Park ID 12)
      {
        park_id: 12,
        name: "Bear Lake",
        description: "An iconic subalpine lake reflecting the surrounding peaks, accessible via an easy paved trail.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "40.3139",
        longitude: "-105.6450",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["June", "July", "August", "September"],
        tips: "Very popular spot - arrive early for parking. Perfect for families with young children."
      },
      {
        park_id: 12,
        name: "Trail Ridge Road",
        description: "One of the highest paved roads in North America, offering spectacular alpine views.",
        category: "scenic drive",
        duration_minutes: 180,
        difficulty: "easy",
        latitude: "40.4319",
        longitude: "-105.7594",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "afternoon",
        best_months: ["June", "July", "August", "September", "October"],
        tips: "Road typically closes in winter. Check conditions before visiting. Bring warm clothes for altitude."
      },
      // Sequoia Activities (Park ID 13)
      {
        park_id: 13,
        name: "General Sherman Tree",
        description: "Visit the largest tree on Earth by volume, a giant sequoia over 2,000 years old.",
        category: "viewpoint",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "36.5816",
        longitude: "-118.7516",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Paved trail makes this accessible to most visitors. Can be crowded during peak season."
      },
      {
        park_id: 13,
        name: "Moro Rock",
        description: "Climb this granite dome for panoramic views of the Great Western Divide and Central Valley.",
        category: "hiking",
        duration_minutes: 120,
        difficulty: "moderate",
        latitude: "36.5459",
        longitude: "-118.7681",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "afternoon",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Steep stairs and no railings in some sections. Not recommended for those afraid of heights."
      },
      // Kings Canyon Activities (Park ID 14)
      {
        park_id: 14,
        name: "General Grant Tree",
        description: "Known as the Nation's Christmas Tree, this giant sequoia is the second largest tree in the world.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "36.7325",
        longitude: "-118.9725",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Easy paved loop trail through the Grant Grove. Great for all ages."
      },
      {
        park_id: 14,
        name: "Zumwalt Meadow",
        description: "A peaceful boardwalk loop through a beautiful meadow surrounded by granite cliffs.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "36.7987",
        longitude: "-118.8421",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Boardwalk protects the delicate meadow ecosystem. Great for photography and wildlife viewing."
      },
      // Death Valley Activities (Park ID 15)
      {
        park_id: 15,
        name: "Badwater Basin",
        description: "The lowest point in North America at 282 feet below sea level, featuring vast salt flats.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "36.2297",
        longitude: "-116.7669",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["March", "April", "May", "October", "November"],
        tips: "Bring plenty of water and sun protection. Avoid midday visits in hot weather."
      },
      {
        park_id: 15,
        name: "Zabriskie Point",
        description: "Iconic overlook offering panoramic views of the colorful badlands and golden hills.",
        category: "viewpoint",
        duration_minutes: 45,
        difficulty: "easy",
        latitude: "36.4201",
        longitude: "-116.8120",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "sunrise",
        best_months: ["All year"],
        tips: "Famous sunrise spot. Arrive early for the best light and fewer crowds."
      },
      // Capitol Reef Activities (Park ID 16)
      {
        park_id: 16,
        name: "Petroglyphs Trail",
        description: "An easy walk along ancient rock art panels created by the Fremont people over 1,000 years ago.",
        category: "hiking",
        duration_minutes: 75,
        difficulty: "easy",
        latitude: "38.2844",
        longitude: "-111.2472",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399",
        best_time_of_day: "morning",
        best_months: ["April", "May", "June", "September", "October"],
        tips: "Interpretive signs help explain the petroglyphs. Bring water and sun protection."
      },
      {
        park_id: 16,
        name: "Hickman Bridge",
        description: "A natural stone bridge formed by water erosion, accessible via a moderate hiking trail.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "moderate",
        latitude: "38.2978",
        longitude: "-111.2206",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399",
        best_time_of_day: "afternoon",
        best_months: ["April", "May", "June", "September", "October"],
        tips: "Well-maintained trail with moderate elevation gain. Great for photography."
      },
      // Canyonlands Activities (Park ID 17)
      {
        park_id: 17,
        name: "Mesa Arch",
        description: "Famous natural stone arch offering spectacular sunrise views of the surrounding canyon country.",
        category: "viewpoint",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "38.3912",
        longitude: "-109.8665",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399",
        best_time_of_day: "sunrise",
        best_months: ["April", "May", "September", "October"],
        tips: "Very popular sunrise spot. Arrive at least 30 minutes before sunrise for best position."
      },
      {
        park_id: 17,
        name: "Grand View Point",
        description: "Sweeping overlook providing panoramic views of the Colorado River and surrounding canyonlands.",
        category: "viewpoint",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "38.2916",
        longitude: "-109.8850",
        image_url: "https://images.unsplash.com/photo-1583398561012-8645a7e5b399",
        best_time_of_day: "afternoon",
        best_months: ["April", "May", "September", "October"],
        tips: "Accessible by car with short walk to viewpoint. Best light in late afternoon."
      },
      // Mesa Verde Activities (Park ID 18)
      {
        park_id: 18,
        name: "Cliff Palace",
        description: "The largest cliff dwelling in North America, home to ancestral Puebloan people 700 years ago.",
        category: "cultural site",
        duration_minutes: 120,
        difficulty: "moderate",
        latitude: "37.1916",
        longitude: "-108.4731",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "September", "October"],
        tips: "Guided tours required. Purchase tickets in advance. Involves climbing ladders."
      },
      {
        park_id: 18,
        name: "Mesa Top Loop Road",
        description: "A scenic drive with multiple overlooks of cliff dwellings and archaeological sites.",
        category: "scenic drive",
        duration_minutes: 150,
        difficulty: "easy",
        latitude: "37.2308",
        longitude: "-108.4618",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "afternoon",
        best_months: ["May", "June", "September", "October"],
        tips: "Self-guided drive with multiple stops. Allow 2-3 hours for all viewpoints."
      },
      // Great Sand Dunes Activities (Park ID 19)
      {
        park_id: 19,
        name: "Dunes Hiking",
        description: "Climb North America's tallest sand dunes for incredible views of the surrounding mountains.",
        category: "hiking",
        duration_minutes: 180,
        difficulty: "difficult",
        latitude: "37.7916",
        longitude: "-105.5943",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "early morning",
        best_months: ["May", "June", "September", "October"],
        tips: "Sand can be very hot. Start early, bring lots of water, and consider sand shoes."
      },
      {
        park_id: 19,
        name: "Medano Creek",
        description: "Seasonal creek at the base of the dunes, popular for splashing and cooling off.",
        category: "viewpoint",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "37.7850",
        longitude: "-105.5889",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "afternoon",
        best_months: ["May", "June"],
        tips: "Creek flows best in late spring/early summer from snowmelt. Perfect for families."
      },
      // Black Canyon Activities (Park ID 20)
      {
        park_id: 20,
        name: "South Rim Drive",
        description: "Scenic drive along the canyon rim with multiple overlooks of the dramatic black walls.",
        category: "scenic drive",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "38.5753",
        longitude: "-107.7416",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "afternoon",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Multiple overlooks accessible by short walks from parking areas."
      },
      {
        park_id: 20,
        name: "Rim Rock Trail",
        description: "Easy trail along the canyon rim offering multiple viewpoints of the Gunnison River far below.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "38.5789",
        longitude: "-107.7435",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Paved trail suitable for all abilities. Stay back from cliff edges."
      },
      // Lassen Volcanic Activities (Park ID 29)
      {
        park_id: 29,
        name: "Bumpass Hell",
        description: "Largest hydrothermal area in the park with boiling mud pots, fumaroles, and hot springs.",
        category: "hiking",
        duration_minutes: 120,
        difficulty: "moderate",
        latitude: "40.4365",
        longitude: "-121.4544",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "morning",
        best_months: ["June", "July", "August", "September"],
        tips: "Stay on boardwalks and designated trails. Ground and water are dangerously hot."
      },
      {
        park_id: 29,
        name: "Manzanita Lake",
        description: "Peaceful lake offering reflections of Lassen Peak with an easy walking trail around the perimeter.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "40.5322",
        longitude: "-121.5698",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "sunrise",
        best_months: ["June", "July", "August", "September"],
        tips: "Best reflections in calm morning conditions. Great for photography and families."
      },
      // Redwood Activities (Park ID 30)
      {
        park_id: 30,
        name: "Lady Bird Johnson Grove",
        description: "Easy loop trail through magnificent old-growth redwoods dedicated to the former First Lady.",
        category: "hiking",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "41.2893",
        longitude: "-124.0046",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Paved trail accessible to most visitors. Beautiful light filters through the canopy."
      },
      {
        park_id: 30,
        name: "Fern Canyon",
        description: "Narrow canyon with 50-foot walls covered in ferns, featured in movies like Jurassic Park.",
        category: "hiking",
        duration_minutes: 75,
        difficulty: "easy",
        latitude: "41.3845",
        longitude: "-124.0654",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        best_time_of_day: "afternoon",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Creek crossings required. Wear waterproof shoes. Can be muddy after rain."
      },
      // Crater Lake Activities (Park ID 31)
      {
        park_id: 31,
        name: "Rim Drive",
        description: "33-mile scenic drive around the caldera offering spectacular viewpoints of Crater Lake.",
        category: "scenic drive",
        duration_minutes: 180,
        difficulty: "easy",
        latitude: "42.8684",
        longitude: "-122.1685",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "afternoon",
        best_months: ["July", "August", "September"],
        tips: "Road typically fully open July through October. Check conditions before visiting."
      },
      {
        park_id: 31,
        name: "Watchman Peak Trail",
        description: "Moderate hike to a historic fire lookout with panoramic views of Crater Lake.",
        category: "hiking",
        duration_minutes: 120,
        difficulty: "moderate",
        latitude: "42.8965",
        longitude: "-122.1854",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "sunset",
        best_months: ["July", "August", "September"],
        tips: "Popular sunset viewing spot. Bring warm clothes as temperatures drop quickly."
      },
      // Mount Rainier Activities (Park ID 32)
      {
        park_id: 32,
        name: "Paradise Meadows",
        description: "Subalpine meadows with wildflower displays and views of Mount Rainier's glaciers.",
        category: "hiking",
        duration_minutes: 120,
        difficulty: "moderate",
        latitude: "46.7859",
        longitude: "-121.7354",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "afternoon",
        best_months: ["July", "August", "September"],
        tips: "Peak wildflower season is late July to early August. Trails can be snowy until late July."
      },
      {
        park_id: 32,
        name: "Sunrise Visitor Area",
        description: "Highest point accessible by vehicle, offering close views of Mount Rainier and glaciers.",
        category: "viewpoint",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "46.9149",
        longitude: "-121.6406",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "sunrise",
        best_months: ["July", "August", "September"],
        tips: "Road typically opens late June. Arrive early for parking and best light."
      },
      // Olympic Activities (Park ID 33)
      {
        park_id: 33,
        name: "Hoh Rainforest",
        description: "One of the finest examples of temperate rainforest with massive trees and lush vegetation.",
        category: "hiking",
        duration_minutes: 90,
        difficulty: "easy",
        latitude: "47.8606",
        longitude: "-123.9348",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "morning",
        best_months: ["May", "June", "July", "August", "September"],
        tips: "Hall of Mosses Trail is most popular. Expect some rain gear needed year-round."
      },
      {
        park_id: 33,
        name: "Hurricane Ridge",
        description: "Mountain viewpoint offering panoramic views of the Olympic Mountains and Strait of Juan de Fuca.",
        category: "viewpoint",
        duration_minutes: 120,
        difficulty: "easy",
        latitude: "47.9692",
        longitude: "-123.4992",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "afternoon",
        best_months: ["June", "July", "August", "September"],
        tips: "Road can be closed due to snow. Check conditions. Popular area can be crowded."
      },
      // North Cascades Activities (Park ID 34)
      {
        park_id: 34,
        name: "Diablo Lake Overlook",
        description: "Stunning turquoise lake surrounded by dramatic mountain peaks, accessible via short hike.",
        category: "viewpoint",
        duration_minutes: 45,
        difficulty: "easy",
        latitude: "48.7172",
        longitude: "-121.1186",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "afternoon",
        best_months: ["June", "July", "August", "September"],
        tips: "Color is most vivid on sunny days. Easy walk from parking area."
      },
      {
        park_id: 34,
        name: "Blue Lake Trail",
        description: "Moderate hike to an alpine lake with dramatic mountain scenery and wildflowers.",
        category: "hiking",
        duration_minutes: 240,
        difficulty: "moderate",
        latitude: "48.5165",
        longitude: "-120.7406",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        best_time_of_day: "morning",
        best_months: ["July", "August", "September"],
        tips: "Trail can have snow until mid-July. Requires good hiking boots and preparation."
      },
      // Everglades Activities (Park ID 35)
      {
        park_id: 35,
        name: "Anhinga Trail",
        description: "Wheelchair accessible boardwalk through wetlands with excellent wildlife viewing opportunities.",
        category: "hiking",
        duration_minutes: 60,
        difficulty: "easy",
        latitude: "25.3895",
        longitude: "-80.6284",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "early morning",
        best_months: ["December", "January", "February", "March", "April"],
        tips: "Best wildlife viewing in dry season. Bring binoculars and insect repellent."
      },
      {
        park_id: 35,
        name: "Shark Valley Tram Road",
        description: "15-mile loop road through sawgrass prairie with observation tower at the halfway point.",
        category: "scenic drive",
        duration_minutes: 180,
        difficulty: "easy",
        latitude: "25.7598",
        longitude: "-80.7682",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e",
        best_time_of_day: "morning",
        best_months: ["December", "January", "February", "March", "April"],
        tips: "Can walk, bike, or take tram tour. Alligator sightings common during dry season."
      }
    ];
    
    activitiesData.forEach((activity) => {
      this.createParkActivity(activity);
    });
  }
}

export const storage = new MemStorage();
