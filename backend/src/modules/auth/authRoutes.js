import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as authService from './authService.js';

export const authRoutes = Router();

// POST /api/auth/login
authRoutes.post('/login', async (req, res) => {
  const { token, user } = await authService.login(req.body || {});
  res.json({ token, user });
});

// POST /api/auth/logout
authRoutes.post('/logout', authenticate, async (req, res) => {
  await authService.logout(req.auth);
  res.json({ message: 'You have been logged out.' });
});

// GET /api/auth/me
authRoutes.get('/me', authenticate, async (req, res) => {
  res.json({ user: await authService.currentUser(req.auth.userId) });
});
