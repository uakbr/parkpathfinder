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
      }
    ];
    
    activitiesData.forEach((activity) => {
      this.createParkActivity(activity);
    });
  }
}

export const storage = new MemStorage();
