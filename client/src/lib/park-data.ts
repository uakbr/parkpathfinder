import { Park } from "./types";

// This file is for local development and will be replaced by the server API in production
export const parkData: Park[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
