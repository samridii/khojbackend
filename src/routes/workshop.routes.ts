import { Router } from 'express';
import {
  getAllWorkshops, getWorkshopById, createWorkshop, updateWorkshop, deleteWorkshop,
  getAllArtisans, getArtisanById, getMyArtisanProfile, updateArtisanProfile,
} from '../controllers/workshop.controller';
import { getWorkshopBookings, updateBookingStatus } from '../controllers/booking.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { updateArtisanSchema, updateBookingStatusSchema } from '../validations/schemas';

// Workshop Router
export const workshopRouter = Router();

/**
 * @swagger
 * /workshops:
 *   get:
 *     summary: Get all active workshops
 *     tags: [Workshops]
 *     security: []
 */
workshopRouter.get('/', getAllWorkshops);
workshopRouter.get('/:id', getWorkshopById);

// Artisan-only workshop management
workshopRouter.post('/', protect, restrictTo('artisan'), createWorkshop);
workshopRouter.patch('/:id', protect, restrictTo('artisan'), updateWorkshop);
workshopRouter.delete('/:id', protect, restrictTo('artisan'), deleteWorkshop);

// Artisan Router 

export const artisanRouter = Router();

/**
 * @swagger
 * /artisans:
 *   get:
 *     summary: Get all artisans
 *     tags: [Artisans]
 *     security: []
 */
artisanRouter.get('/', getAllArtisans);
artisanRouter.get('/:id', getArtisanById);

// Artisan dashboard routes
artisanRouter.get('/dashboard/profile', protect, restrictTo('artisan'), getMyArtisanProfile);
artisanRouter.patch('/dashboard/profile', protect, restrictTo('artisan'), validate(updateArtisanSchema), updateArtisanProfile);
artisanRouter.get('/dashboard/workshops/:workshopId/bookings', protect, restrictTo('artisan'), getWorkshopBookings);
artisanRouter.patch('/dashboard/bookings/:id/status', protect, restrictTo('artisan'), validate(updateBookingStatusSchema), updateBookingStatus);