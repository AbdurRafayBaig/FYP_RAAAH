import 'dotenv/config';

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && value !== '' && value !== undefined ? n : fallback;
};

const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  isProduction,
  isTest: process.env.NODE_ENV === 'test',
  // Vercel Functions: several short-lived instances that do not share memory (docs/DEPLOYMENT.md)
  isServerless: Boolean(process.env.VERCEL),
  port: num(process.env.PORT, 5000),
  // One or more web client addresses, separated by commas
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean),
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/raaah',
  // The Upstash integration on Vercel names it KV_URL in some setups
  redisUrl: process.env.REDIS_URL || process.env.KV_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'raaah-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:8000',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  // Password reset emails (Resend). The sender must be on a domain verified in Resend to reach any
  // address; Resend's test sender onboarding@resend.dev only delivers to the Resend account's own email.
  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'RAAAH <onboarding@resend.dev>',
  passwordResetMinutes: num(process.env.PASSWORD_RESET_MINUTES, 30),
  weatherRefreshMinutes: num(process.env.WEATHER_REFRESH_MINUTES, 10),
  checkinAutoCloseHours: num(process.env.CHECKIN_AUTO_CLOSE_HOURS, 6),
  crowdRefreshSeconds: num(process.env.CROWD_REFRESH_SECONDS, 60),
  // SRS 3.3.3 - sign-in is paused for an email and address after this many failed attempts
  loginMaxFailures: num(process.env.LOGIN_MAX_FAILURES, 5),
  loginLockMinutes: num(process.env.LOGIN_LOCK_MINUTES, 15),
};

// Address of the web client, used in links sent by email; the first allowed origin unless set
config.webUrl = (process.env.WEB_URL || config.corsOrigins[0] || 'http://localhost:3000').replace(/\/$/, '');

const PLACEHOLDER_SECRETS = ['change-this-to-a-long-random-string', 'raaah-dev-secret-change-me'];

if (!process.env.JWT_SECRET || PLACEHOLDER_SECRETS.includes(process.env.JWT_SECRET)) {
  // SRS 3.3.3 - a deployed server must never sign sessions with a known secret
  if (isProduction) {
    throw new Error('[config] JWT_SECRET must be set to a long random value when NODE_ENV=production.');
  }
  console.warn('[config] JWT_SECRET is missing or still the placeholder. Set a long random value in .env before deployment.');
}
