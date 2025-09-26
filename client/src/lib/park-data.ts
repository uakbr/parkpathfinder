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
  },
  {
    id: 21,
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
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
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
    id: 26,
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
    id: 27,
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
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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
    id: 34,
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
    id: 35,
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
    id: 36,
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
    id: 37,
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
    id: 38,
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
    id: 39,
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
    id: 40,
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
    id: 41,
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
    id: 42,
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
    id: 43,
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
    id: 44,
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
    id: 45,
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
    id: 46,
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
    id: 47,
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
    id: 48,
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
