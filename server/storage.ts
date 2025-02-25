import { 
  users, 
  type User, 
  type InsertUser, 
  nationalParks, 
  type NationalPark, 
  type InsertNationalPark,
  aiRecommendations,
  type AiRecommendation,
  type InsertAiRecommendation
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // National Parks
  getAllParks(): Promise<NationalPark[]>;
  getParkById(id: number): Promise<NationalPark | undefined>;
  getParksByMonth(month: string): Promise<NationalPark[]>;
  
  // AI Recommendations
  getAiRecommendation(parkId: number, month: string, preferences: string): Promise<AiRecommendation | undefined>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parks: Map<number, NationalPark>;
  private aiRecommendations: Map<string, AiRecommendation>;
  
  currentUserId: number;
  currentParkId: number;
  currentAiRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.parks = new Map();
    this.aiRecommendations = new Map();
    
    this.currentUserId = 1;
    this.currentParkId = 1;
    this.currentAiRecommendationId = 1;
    
    // Initialize with sample park data
    this.initializeParkData();
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
    const id = this.currentUserId++;
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
    const key = `${parkId}-${month}-${preferences}`;
    return this.aiRecommendations.get(key);
  }
  
  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentAiRecommendationId++;
    const recommendation: AiRecommendation = { ...insertRecommendation, id };
    
    const key = `${recommendation.park_id}-${recommendation.month}-${recommendation.user_preferences}`;
    this.aiRecommendations.set(key, recommendation);
    
    return recommendation;
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
      const id = this.currentParkId++;
      const newPark: NationalPark = { ...park, id };
      this.parks.set(id, newPark);
    });
  }
}

export const storage = new MemStorage();
