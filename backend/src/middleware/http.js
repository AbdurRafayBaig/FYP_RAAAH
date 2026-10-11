import { config } from '../config.js';

// SRS 3.3.3 - the API only returns JSON; these headers stop browsers from sniffing or framing it,
// and keep clients on HTTPS once the server is deployed behind the TLS proxy.
export function securityHeaders(req, res, next) {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('Cache-Control', 'no-store');
  if (config.isProduction) res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

// One line per request with its duration (SRS 3.3.2: typical requests complete within 3 seconds).
// Query strings and bodies are not logged, so no location or credentials reach the log (SRS 3.3.4).
export function requestLog(req, res, next) {
  const started = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    console.log(`[api] ${req.method} ${req.baseUrl}${req.path} ${res.statusCode} ${ms.toFixed(0)}ms`);
  });
  next();
}
