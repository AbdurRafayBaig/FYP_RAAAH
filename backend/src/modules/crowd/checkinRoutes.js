import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { TOURIST_ROLES } from '../../domain.js';
import * as crowdService from './crowdService.js';

export const checkinRoutes = Router();

// GET /api/check-ins/active - the tourist's current check-in, if any
checkinRoutes.get('/active', authenticate, authorize(...TOURIST_ROLES), async (req, res) => {
  res.json({ checkIn: await crowdService.getActiveCheckIn(req.auth.userId) });
});
