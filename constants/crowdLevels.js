// ================================
// CROWD LEVEL CONSTANTS
// Exactly 4 levels as per RAAAH documentation
// ================================

export const CROWD_LEVELS = {
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Colors matching the Stitch "Alpine Editorial" design system
export const CROWD_COLORS = {
  [CROWD_LEVELS.LOW]: {
    bg: '#ECFDF5',
    text: '#059669',
    label: 'Normal visitor level',
  },
  [CROWD_LEVELS.MODERATE]: {
    bg: '#EFF6FF',
    text: '#2563EB',
    label: 'Visitor level approaching capacity',
  },
  [CROWD_LEVELS.HIGH]: {
    bg: '#FFF7ED',
    text: '#EA580C',
    label: 'Visitor level has reached configured threshold',
  },
  [CROWD_LEVELS.CRITICAL]: {
    bg: '#FEF2F2',
    text: '#DC2626',
    label: 'Visitor level exceeds capacity',
  },
};
