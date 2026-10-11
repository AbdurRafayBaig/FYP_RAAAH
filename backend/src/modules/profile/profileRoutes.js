import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { TOURIST_ROLES } from '../../domain.js';
import * as users from '../../data/repositories/userRepository.js';
import * as profileService from './profileService.js';

export const profileRoutes = Router();

// GET /api/interests - available travel preferences (FR-01.04)
profileRoutes.get('/interests', async (req, res) => {
  res.json({ interests: await users.listInterestOptions() });
});

// UC-03 actor: Tourist (a Community Safety Observer is also a tourist)
profileRoutes.use('/profile', authenticate, authorize(...TOURIST_ROLES));

// GET /api/profile
profileRoutes.get('/profile', async (req, res) => {
  res.json({ profile: await profileService.getProfile(req.auth.userId) });
});

// PUT /api/profile
profileRoutes.put('/profile', async (req, res) => {
  const profile = await profileService.updateProfile(req.auth.userId, req.body);
  res.json({ profile, message: 'Your profile and preferences have been saved.' });
});
