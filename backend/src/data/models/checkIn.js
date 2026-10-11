// Database Models (Package Diagram, Data Access Layer) - check_ins (ERD, Fig. 44)

export function toCheckIn(row) {
  if (!row) return null;
  return {
    checkinId: row.checkin_id,
    destinationId: row.destination_id,
    destinationName: row.destination_name,
    checkinTime: row.checkin_time,
    checkoutTime: row.checkout_time,
    status: row.status,
  };
}
