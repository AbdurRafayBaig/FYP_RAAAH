// ================================
// CROWD LEVELS (SRS Table 11)
// ================================

export const CROWD_LEVELS = ['Low', 'Moderate', 'High', 'Critical'];

// Same values as the --color-low ... --color-critical tokens in globals.css
export const CROWD_COLORS = {
  Low: '#4f7a55',
  Moderate: '#b07d24',
  High: '#c05a2c',
  Critical: '#9e2f25',
};

export const CROWD_DESCRIPTIONS = {
  Low: 'Quiet. Well below capacity.',
  Moderate: 'Getting busy. Approaching capacity.',
  High: 'Busy. At the capacity threshold.',
  Critical: 'Over capacity.',
};
