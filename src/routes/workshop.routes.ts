import { Router } from 'express';
import {
  getAllWorkshops, getWorkshopById, createWorkshop, updateWorkshop, deleteWorkshop,
  getAllArtisans, getArtisanById, getMyArtisanProfile, updateArtisanProfile, deleteArtisan,
} from '../controllers/workshop.controller';
import { getWorkshopBookings, updateBookingStatus } from '../controllers/booking.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { updateArtisanSchema, updateBookingStatusSchema } from '../validations/schemas';

export const workshopRouter = Router();

workshopRouter.get('/', getAllWorkshops);
workshopRouter.get('/:id', getWorkshopById);

// Artisan OR admin can create/edit/delete workshops
workshopRouter.post('/',    protect, restrictTo('artisan', 'admin'), createWorkshop);
workshopRouter.patch('/:id', protect, restrictTo('artisan', 'admin'), updateWorkshop);
workshopRouter.delete('/:id', protect, restrictTo('artisan', 'admin'), deleteWorkshop);

export const artisanRouter = Router();

artisanRouter.get('/', getAllArtisans);
artisanRouter.get('/:id', getArtisanById);

// Admin CRUD on artisans
artisanRouter.post('/',    protect, restrictTo('admin'), updateArtisanProfile);
artisanRouter.patch('/:id', protect, restrictTo('admin'), updateArtisanProfile);
artisanRouter.delete('/:id', protect, restrictTo('admin'), deleteArtisan);

// Artisan dashboard routes
artisanRouter.get('/dashboard/profile',    protect, restrictTo('artisan'), getMyArtisanProfile);
artisanRouter.patch('/dashboard/profile',  protect, restrictTo('artisan'), validate(updateArtisanSchema), updateArtisanProfile);
artisanRouter.get('/dashboard/workshops/:workshopId/bookings',  protect, restrictTo('artisan'), getWorkshopBookings);
artisanRouter.patch('/dashboard/bookings/:id/status', protect, restrictTo('artisan'), validate(updateBookingStatusSchema), updateBookingStatus);