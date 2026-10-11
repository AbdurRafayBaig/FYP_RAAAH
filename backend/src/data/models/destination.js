// Database Models (Package Diagram, Data Access Layer) - destinations, cultural_info and hazard_reports (ERD, Fig. 44)

export function toDestination(row) {
  return {
    destinationId: row.destination_id,
    name: row.name,
    description: row.description,
    region: row.region,
    location: { latitude: row.latitude, longitude: row.longitude },
    areaRadiusM: row.area_radius_m,
    capacityThreshold: row.capacity_threshold,
    crowdLevel: row.crowd_level,
    riskStatus: row.risk_status,
    accessInfo: { status: 'Open', ...row.access_info },
    attractions: row.attractions,
    activities: row.activities,
    accommodationAvailable: row.accommodation_available,
    imageUrl: row.image_url,
    interests: row.interests,
    updatedAt: row.updated_at,
  };
}

export function toCulturalInfo(row) {
  return { infoId: row.info_id, category: row.category, title: row.title, content: row.content };
}

export function toHazard(row) {
  return {
    reportId: row.report_id,
    hazardType: row.hazard_type,
    location: row.location,
    description: row.description,
    reportedAt: row.created_at,
  };
}
