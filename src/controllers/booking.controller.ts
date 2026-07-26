import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { bookingService } from '../services/booking.service';

/**
 * @route   POST /api/bookings
 * @access  Protected (user)
 */
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { workshopId, scheduledDate, participants, note } = req.body;
  const booking = await bookingService.createBooking(
    req.user!.id, workshopId, scheduledDate, participants, note
  );
  sendSuccess(res, booking, 'Booking request submitted.', 201);
});

/**
 * @route   GET /api/bookings
 * @access  Protected (user)
 */
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getUserBookings(req.user!.id);
  sendSuccess(res, bookings);
});

/**
 * @route   GET /api/bookings/:id
 * @access  Protected
 */
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(req.params.id, req.user!.id, req.user!.role);
  sendSuccess(res, booking);
});

/**
 * @route   PATCH /api/bookings/:id
 * @access  Protected (user — only pending bookings)
 */
export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.updateBooking(req.params.id, req.user!.id, req.body);
  sendSuccess(res, booking, 'Booking updated.');
});

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Protected (user or artisan)
 */
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user!.id, req.user!.role);
  sendSuccess(res, booking, 'Booking cancelled.');
});

// ─── Artisan booking management ───────────────────────────────────────────

/**
 * @route   GET /api/artisan/workshops/:workshopId/bookings
 * @access  Protected (artisan)
 */
export const getWorkshopBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getWorkshopBookings(
    req.params.workshopId, req.user!.id
  );
  sendSuccess(res, bookings);
});

/**
 * @route   PATCH /api/artisan/bookings/:id/status
 * @access  Protected (artisan)
 */
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, artisanNote } = req.body;
  const booking = await bookingService.updateBookingStatus(
    req.params.id, req.user!.id, status, artisanNote
  );
  sendSuccess(res, booking, `Booking ${status}.`);
});