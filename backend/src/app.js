import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { getCacheKind } from './data/cache.js';
import { hasPostgis, query } from './data/db.js';
import { health as aiEngineHealth } from './integrations/aiEngineClient.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { requestLog, securityHeaders } from './middleware/http.js';
import { authRoutes } from './modules/auth/authRoutes.js';
import { profileRoutes } from './modules/profile/profileRoutes.js';
import { destinationRoutes } from './modules/destinations/destinationRoutes.js';
import { checkinRoutes } from './modules/crowd/checkinRoutes.js';
import { recommendationRoutes } from './modules/recommendations/recommendationRoutes.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  // Deployed behind the HTTPS reverse proxy (Deployment Diagram, Fig. 45)
  if (config.isProduction) app.set('trust proxy', 1);
  app.use(securityHeaders);
  if (!config.isTest) app.use(requestLog);
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json({ limit: '100kb' }));

  // Used by the container health check and for monitoring (docs/MAINTENANCE.md)
  // The API stays "ok" while the AI engine is down: only recommendations depend on it (SRS 3.3.5).
  app.get('/api/health', async (req, res) => {
    const aiEngine = aiEngineHealth();
    try {
      await query('SELECT 1');
      res.json({ status: 'ok', database: 'up', cache: getCacheKind(), postgis: await hasPostgis(), aiEngine: await aiEngine });
    } catch {
      res.status(503).json({ status: 'unavailable', database: 'down', cache: getCacheKind(), aiEngine: await aiEngine });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api', profileRoutes);
  app.use('/api/destinations', destinationRoutes);
  app.use('/api/check-ins', checkinRoutes);
  app.use('/api/recommendations', recommendationRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
