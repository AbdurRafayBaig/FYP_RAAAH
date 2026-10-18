import { config } from '../config.js';
import { HttpError } from '../middleware/errors.js';

// Used by /api/health (docs/MAINTENANCE.md). On Vercel the call also starts an idle AI engine, so the
// web client asks for it when a page opens and the first recommendation does not wait (SRS 3.3.2).
export async function health() {
  try {
    const res = await fetch(`${config.aiEngineUrl}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok ? 'up' : 'down';
  } catch {
    return 'down';
  }
}

// DestinationScoring interface to the AI Recommendation Engine (Component Diagram, Fig. 37).
export async function scoreDestinations(payload) {
  let res;
  try {
    res = await fetch(`${config.aiEngineUrl}/recommendations/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error('[ai-engine] Unreachable:', err.message);
    throw new HttpError(503, 'The recommendation engine is currently unavailable. Please try again shortly.');
  }
  if (!res.ok) {
    console.error('[ai-engine] Error response:', res.status, await res.text());
    throw new HttpError(502, 'The recommendation engine could not process the request.');
  }
  return res.json();
}
