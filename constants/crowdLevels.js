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

// Human-friendly crowd status colors matching RAAAH design system (Section 42)
export const CROWD_COLORS = {
  [CROWD_LEVELS.LOW]: {
    bg: '#EBF5F0',
    border: '#B6E0CF',
    text: '#2E7D5B',
    label: 'Quiet right now. A good time to visit.',
  },
  [CROWD_LEVELS.MODERATE]: {
    bg: '#FEF8EC',
    border: '#F4DFB4',
    text: '#C68A19',
    label: 'Moderate visitor levels.',
  },
  [CROWD_LEVELS.HIGH]: {
    bg: '#FDF2F0',
    border: '#F6C4BD',
    text: '#D65A4A',
    label: 'Busy. Visitor levels reaching capacity.',
  },
  [CROWD_LEVELS.CRITICAL]: {
    bg: '#FBF0F0',
    border: '#F1B5B5',
    text: '#A83232',
    label: 'Visitor levels currently above capacity.',
  },
};

