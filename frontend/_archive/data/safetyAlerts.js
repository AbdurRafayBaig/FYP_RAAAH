// ==========================================
// RAAAH SAFETY ALERTS & HAZARDS DATA
// Real-time disaster management & travel safety
// ==========================================

export const SAFETY_ALERTS = [
  {
    id: "alert-001",
    title: "Landslide Blockage on Karakoram Highway (KKH)",
    category: "Landslide",
    severity: "High Risk", // High Risk, Elevated Risk, Low Risk
    severityColor: "red",
    region: "Hunza / Nagar District (KM 412)",
    timestamp: "10 minutes ago",
    status: "Active - Road Clearance in Progress",
    affectedRoutes: ["N-35 Karakoram Highway", "Aliabad to Passu Bypass"],
    recommendedAction: "Use Babusar Pass route if travelling from Islamabad, or wait at Gilgit Transit Hub until clearance confirmation at 3:00 PM.",
    authority: "National Highway Authority & GB Disaster Management",
    contactNumber: "+92 5811 920888",
    coordinates: { lat: 36.2150, lng: 74.6210 },
    icon: "warning"
  },
  {
    id: "alert-002",
    title: "Severe Traffic Gridlock at Babu Sar Top Pass",
    category: "Traffic Gridlock",
    severity: "Elevated Risk",
    severityColor: "amber",
    region: "Naran - Chilas Connection",
    timestamp: "25 minutes ago",
    status: "Congested - 2 Hour Delay Expected",
    affectedRoutes: ["Naran-Babusar Highway (N-15)"],
    recommendedAction: "Stagger departure times. Heavy tourist coaches restricted between 12:00 PM and 4:00 PM.",
    authority: "KP Tourist Police",
    contactNumber: "1422",
    coordinates: { lat: 35.1481, lng: 74.0489 },
    icon: "traffic"
  },
  {
    id: "alert-003",
    title: "Glacial Melt & Flash Flood Warning in Shimshal Valley",
    category: "Flash Flood",
    severity: "High Risk",
    severityColor: "red",
    region: "Upper Hunza / Shimshal",
    timestamp: "1 hour ago",
    status: "Active Watch",
    affectedRoutes: ["Shimshal Jeep Track"],
    recommendedAction: "Trekking and riverbank camping strictly suspended until official clearance.",
    authority: "Gilgit-Baltistan Emergency Services (Rescue 1122)",
    contactNumber: "1122",
    coordinates: { lat: 36.4333, lng: 75.3167 },
    icon: "water_drop"
  },
  {
    id: "alert-004",
    title: "Heavy Fog and Sub-Zero Freeze at Murree Expressway",
    category: "Weather",
    severity: "Low Risk",
    severityColor: "blue",
    region: "Murree Expressway (N-75)",
    timestamp: "3 hours ago",
    status: "Cautionary Notice",
    affectedRoutes: ["N-75 Expressway", "Lower Topa Curve"],
    recommendedAction: "Drive with fog lights. Chains required on tyres if travelling above Jhika Gali after 8:00 PM.",
    authority: "Punjab Traffic Police",
    contactNumber: "051-9269200",
    coordinates: { lat: 33.9070, lng: 73.3943 },
    icon: "cloud"
  }
];

export const EMERGENCY_CONTACTS = [
  { name: "Rescue 1122 Emergency", phone: "1122", service: "Medical & Disaster Rescue", region: "Nationwide" },
  { name: "KP Tourist Police Helpline", phone: "1422", service: "Tourist Guidance & Safety", region: "Khyber Pakhtunkhwa" },
  { name: "GB Disaster Management (GBDMA)", phone: "05811-920888", service: "Landslide & Road Status", region: "Gilgit-Baltistan" },
  { name: "National Highway Authority (NHA)", phone: "130", service: "Highway Road Status", region: "National Highways" },
  { name: "RAAAH Live Operations Center", phone: "0800-RAAAH (72224)", service: "24/7 Smart Tourism Support", region: "All Northern Regions" }
];
