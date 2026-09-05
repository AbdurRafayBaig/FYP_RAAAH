// ==========================================
// RAAAH DESTINATIONS DATA
// Northern Pakistan Destinations with real-time crowd metrics
// ==========================================

export const DESTINATIONS = [
  {
    id: "hunza-valley",
    name: "Hunza Valley",
    region: "Gilgit-Baltistan",
    tagline: "The Crown Jewel of Karakoram",
    crowdLevel: "High",
    crowdScore: 78, // % density capacity
    capacityStatus: "Near Capacity (78%)",
    peakHours: "11:00 AM - 4:00 PM",
    safetyStatus: "Low Risk",
    weather: { temp: "18°C", condition: "Sunny", icon: "wb_sunny" },
    image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Hunza Valley is a mountainous valley in the northern part of the Gilgit-Baltistan region of Pakistan. Known for its breathtaking mountain views, historic forts (Altit & Baltit), and warm hospitality.",
    highlights: [
      "Altit & Baltit Forts",
      "Eagle's Nest Sunset Point",
      "Attabad Lake Boating",
      "Passu Cones Viewpoint"
    ],
    bestTimeToVisit: "April to October",
    recommendedVisitTime: "Early Morning (6:00 AM - 9:30 AM)",
    accommodationsAvailable: 42,
    liveVisitors: 3420,
    maxCapacity: 4500,
    coordinates: { lat: 36.3167, lng: 74.6500 }
  },
  {
    id: "attabad-lake",
    name: "Attabad Lake",
    region: "Hunza, Gilgit-Baltistan",
    tagline: "Turquoise Waters Amidst High Peaks",
    crowdLevel: "Moderate",
    crowdScore: 54,
    capacityStatus: "Moderate Density (54%)",
    peakHours: "12:00 PM - 5:00 PM",
    safetyStatus: "Low Risk",
    weather: { temp: "16°C", condition: "Partly Cloudy", icon: "partly_cloudy_day" },
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Created by a massive landslide in 2010, Attabad Lake has transformed into one of Pakistan's most vibrant turquoise water boating and jet-skiing hubs.",
    highlights: ["Jet Skiing & Boating", "Luxury Lakeside Resorts", "Tunnel Viewpoint"],
    bestTimeToVisit: "May to September",
    recommendedVisitTime: "2:00 PM - 5:00 PM",
    accommodationsAvailable: 18,
    liveVisitors: 1080,
    maxCapacity: 2000,
    coordinates: { lat: 36.3389, lng: 74.8644 }
  },
  {
    id: "naran-kaghan",
    name: "Naran Valley & Saif-ul-Malook",
    region: "Khyber Pakhtunkhwa",
    tagline: "Lakes, Pine Forests, and Alpine Trails",
    crowdLevel: "Critical",
    crowdScore: 92,
    capacityStatus: "Overcrowded (92%)",
    peakHours: "10:00 AM - 6:00 PM",
    safetyStatus: "Elevated Risk",
    weather: { temp: "14°C", condition: "Light Rain", icon: "rainy" },
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Naran is a famous holiday town in Kaghan Valley. Lake Saif-ul-Malook, located at an elevation of 3,224 meters, is legendary for its fairy tales and scenic beauty.",
    highlights: ["Lake Saif-ul-Malook", "Babu Sar Top", "Lulusar Lake", "River Rafting"],
    bestTimeToVisit: "June to August",
    recommendedVisitTime: "Sunrise (5:30 AM)",
    accommodationsAvailable: 8,
    liveVisitors: 8900,
    maxCapacity: 9500,
    coordinates: { lat: 34.9082, lng: 73.6534 }
  },
  {
    id: "skardu-valley",
    name: "Skardu & Shangrila",
    region: "Gilgit-Baltistan",
    tagline: "Gateway to the Great 8000m Peaks",
    crowdLevel: "Low",
    crowdScore: 32,
    capacityStatus: "Spacious (32%)",
    peakHours: "2:00 PM - 5:00 PM",
    safetyStatus: "Low Risk",
    weather: { temp: "22°C", condition: "Clear Skies", icon: "wb_sunny" },
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Skardu is the center of wilderness tourism in Gilgit-Baltistan. Home to Shangrila Lake, Cold Desert of Katpana, and gateway to K2 basecamp.",
    highlights: ["Shangrila Resort Lake", "Katpana Cold Desert", "Deosai National Park", "Shigar Fort"],
    bestTimeToVisit: "May to October",
    recommendedVisitTime: "Anytime",
    accommodationsAvailable: 35,
    liveVisitors: 1600,
    maxCapacity: 5000,
    coordinates: { lat: 35.2971, lng: 75.6333 }
  },
  {
    id: "swat-valley",
    name: "Swat Valley (Kalam & Malam Jabba)",
    region: "Khyber Pakhtunkhwa",
    tagline: "The Switzerland of the East",
    crowdLevel: "Moderate",
    crowdScore: 61,
    capacityStatus: "Moderate Density (61%)",
    peakHours: "11:00 AM - 4:00 PM",
    safetyStatus: "Low Risk",
    weather: { temp: "20°C", condition: "Pleasant", icon: "sunny" },
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Swat Valley offers lush valleys, alpine forests, rushing rivers, and skiing at Malam Jabba, making it a premier tourist destination.",
    highlights: ["Malam Jabba Ski Resort", "Kalam Valley", "Mahodand Lake", "White Palace Marghazar"],
    bestTimeToVisit: "Year-Round",
    recommendedVisitTime: "Morning",
    accommodationsAvailable: 60,
    liveVisitors: 4100,
    maxCapacity: 6800,
    coordinates: { lat: 35.2227, lng: 72.4258 }
  },
  {
    id: "murree-hills",
    name: "Murree & Patriata Cable Car",
    region: "Punjab",
    tagline: "Colonial Hill Station Near Capital",
    crowdLevel: "High",
    crowdScore: 84,
    capacityStatus: "High Density (84%)",
    peakHours: "4:00 PM - 10:00 PM",
    safetyStatus: "High Risk",
    weather: { temp: "15°C", condition: "Foggy", icon: "cloud" },
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop"
    ],
    description: "Murree is Pakistan's most accessible hill station, popular for Mall Road shopping, Patriata chairlifts, and snowy winter getaways.",
    highlights: ["Mall Road", "Patriata Chairlift", "Changla Gali", "Bhurban"],
    bestTimeToVisit: "Year-Round",
    recommendedVisitTime: "Early Morning to avoid traffic gridlock",
    accommodationsAvailable: 95,
    liveVisitors: 12400,
    maxCapacity: 14800,
    coordinates: { lat: 33.9070, lng: 73.3943 }
  }
];
