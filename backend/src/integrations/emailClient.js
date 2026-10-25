import { config } from '../config.js';

// Email Client (External Service Integrations) - sends mail through the Resend HTTP API.
// Without RESEND_API_KEY nothing is sent: during development the message is printed instead,
// in production only a warning is logged (a reset link must never end up in the logs).
const RESEND_URL = 'https://api.resend.com/emails';

let transport = null;

// The tests capture messages instead of sending them
export function setTransport(fn) {
  transport = fn;
}

export const isConfigured = () => Boolean(config.resendApiKey);

export async function sendEmail({ to, subject, text, html }) {
  if (transport) return transport({ to, subject, text, html });
  if (!isConfigured()) {
    if (config.isProduction) console.warn('[email] RESEND_API_KEY is not set; the email was not sent.');
    else console.log(`[email] Not sent (no RESEND_API_KEY). To: ${to}\nSubject: ${subject}\n${text}`);
    return false;
  }
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: config.emailFrom, to: [to], subject, text, html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend responded with ${res.status}`);
  return true;
}
