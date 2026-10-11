// Database Models (Package Diagram, Data Access Layer) - users + user_interests (ERD, Fig. 44)

export function toUser(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    touristCode: row.tourist_code,
    locationConsent: row.location_consent,
    interests: row.interests,
    createdAt: row.created_at,
  };
}
