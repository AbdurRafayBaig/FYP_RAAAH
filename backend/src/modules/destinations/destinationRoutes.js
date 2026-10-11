import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { TOURIST_ROLES } from '../../domain.js';
import { HttpError } from '../../middleware/errors.js';
import * as destinationService from './destinationService.js';
import * as crowdService from '../crowd/crowdService.js';

export const destinationRoutes = Router();

function parseId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Destination not found.');
  return id;
}

// UC-04 pre-condition: the user is logged in
destinationRoutes.use(authenticate);

// GET /api/destinations?search=hunza
destinationRoutes.get('/', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.slice(0, 100) : '';
  const destinations = await destinationService.listDestinations(search);
  res.json({
    destinations,
    // UC-04 alt 3a
    message: destinations.length === 0 ? 'No destinations found' : undefined,
  });
});

// GET /api/destinations/:id
destinationRoutes.get('/:id', async (req, res) => {
  res.json({ destination: await destinationService.getDestinationPage(parseId(req.params.id), req.auth.userId) });
});

// POST /api/destinations/:id/check-in   (UC-06)
destinationRoutes.post('/:id/check-in', authorize(...TOURIST_ROLES), async (req, res) => {
  const result = await crowdService.checkIn(req.auth.userId, parseId(req.params.id), req.body);
  res.status(201).json(result);
});
