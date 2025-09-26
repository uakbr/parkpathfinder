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
  },
  {
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
  }
];
