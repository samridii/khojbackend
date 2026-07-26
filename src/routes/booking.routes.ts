import { Router } from 'express';
import {
  createBooking, getMyBookings, getBookingById,
  updateBooking, cancelBooking,
} from '../controllers/booking.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { createBookingSchema, updateBookingSchema } from '../validations/schemas';

const router = Router();

// All booking routes require login
router.use(protect);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get my bookings
 *     tags: [Bookings]
 *   post:
 *     summary: Create a booking request
 *     tags: [Bookings]
 */
router.route('/')
  .get(getMyBookings)
  .post(restrictTo('user'), validate(createBookingSchema), createBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *   patch:
 *     summary: Update a pending booking
 *     tags: [Bookings]
 */
router.route('/:id')
  .get(getBookingById)
  .patch(restrictTo('user'), validate(updateBookingSchema), updateBooking);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 */
router.patch('/:id/cancel', cancelBooking);

export default router;