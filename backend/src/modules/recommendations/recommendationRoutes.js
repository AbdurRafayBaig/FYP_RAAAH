import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { TOURIST_ROLES } from '../../domain.js';
import * as recommendationService from './recommendationService.js';

export const recommendationRoutes = Router();

// POST /api/recommendations  { sourceDestinationId?, latitude?, longitude? }
recommendationRoutes.post('/', authenticate, authorize(...TOURIST_ROLES), async (req, res) => {
  res.json(await recommendationService.recommend(req.auth.userId, req.body));
});
