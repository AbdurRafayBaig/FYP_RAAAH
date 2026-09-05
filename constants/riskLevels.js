// ================================
// RISK / SAFETY LEVEL CONSTANTS
// Exactly 3 risk levels as per RAAAH documentation
// ================================

export const RISK_LEVELS = {
  LOW: 'Low Risk',
  ELEVATED: 'Elevated Risk',
  HIGH: 'High Risk',
};

export const RISK_COLORS = {
  [RISK_LEVELS.LOW]: {
    bg: '#EBF5F0',
    border: '#B6E0CF',
    text: '#2E7D5B',
  },
  [RISK_LEVELS.ELEVATED]: {
    bg: '#FEF8EC',
    border: '#F4DFB4',
    text: '#C68A19',
  },
  [RISK_LEVELS.HIGH]: {
    bg: '#FDF2F0',
    border: '#F6C4BD',
    text: '#D65A4A',
  },
};


// ================================
// HAZARD CATEGORIES
// From RAAAH documentation section 1.4.6
// ================================

export const HAZARD_TYPES = [
  'Flash Flood',
  'Landslide',
  'Rockfall',
  'Glacier-related Hazard',
  'Road Blockage',
  'Extreme Weather',
];

// ================================
// HAZARD VALIDATION STATES
// From RAAAH documentation section 1.4.7
// ================================

export const HAZARD_STATUS = {
  UNVERIFIED: 'Unverified',
  UNDER_REVIEW: 'Under Review',
  VERIFIED: 'Verified',
  RESOLVED: 'Resolved',
};

export const HAZARD_STATUS_COLORS = {
  [HAZARD_STATUS.UNVERIFIED]: {
    bg: '#F3F4F6',
    text: '#6B7280',
  },
  [HAZARD_STATUS.UNDER_REVIEW]: {
    bg: '#FFF7ED',
    text: '#EA580C',
  },
  [HAZARD_STATUS.VERIFIED]: {
    bg: '#FEF2F2',
    text: '#DC2626',
  },
  [HAZARD_STATUS.RESOLVED]: {
    bg: '#ECFDF5',
    text: '#059669',
  },
};
