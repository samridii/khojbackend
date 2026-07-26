import { bookingRepository, workshopRepository } from '../repositories/index.repository';

export const bookingService = {
  createBooking: async (
    userId: string,
    workshopId: string,
    scheduledDate: Date,
    participants: number,
    note?: string
  ) => {
    const workshop = await workshopRepository.findById(workshopId);
    if (!workshop) throw new Error('Workshop not found.');
    if (!workshop.isActive) throw new Error('This workshop is not currently accepting bookings.');
    if (participants > workshop.capacity) {
      throw new Error(`Maximum capacity for this workshop is ${workshop.capacity} participants.`);
    }

    return bookingRepository.create({ userId: userId as any, workshopId: workshopId as any, scheduledDate, participants, note });
  },

  getUserBookings: (userId: string) =>
    bookingRepository.findByUser(userId),

  getBookingById: async (id: string, userId: string, role: string) => {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found.');

    // Users can only see their own bookings; artisans see bookings for their workshops
    if (role === 'user' && booking.userId.toString() !== userId) {
      throw new Error('Access denied.');
    }

    return booking;
  },

  updateBooking: async (id: string, userId: string, data: Partial<{ scheduledDate: Date; participants: number; note: string }>) => {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found.');
    if (booking.userId.toString() !== userId) throw new Error('Access denied.');
    if (booking.status !== 'pending') throw new Error('Only pending bookings can be edited.');

    return bookingRepository.updateById(id, data as any);
  },

  cancelBooking: async (id: string, userId: string, role: string) => {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found.');
    if (booking.status === 'cancelled') throw new Error('Booking is already cancelled.');
    if (booking.status === 'completed') throw new Error('Completed bookings cannot be cancelled.');

    const cancelledBy = role === 'artisan' ? 'artisan' : 'user';
    return bookingRepository.updateById(id, { status: 'cancelled', cancelledBy } as any);
  },

  // Artisan actions
  getWorkshopBookings: async (workshopId: string, artisanId: string) => {
    const workshop = await workshopRepository.findById(workshopId);
    if (!workshop) throw new Error('Workshop not found.');
    if (workshop.artisanId.toString() !== artisanId) throw new Error('Access denied.');

    return bookingRepository.findByWorkshop(workshopId);
  },

  updateBookingStatus: async (
    id: string,
    artisanUserId: string,
    status: 'confirmed' | 'completed' | 'cancelled',
    artisanNote?: string
  ) => {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new Error('Booking not found.');

    // Verify the artisan owns this workshop
    const workshop = await workshopRepository.findById(booking.workshopId.toString());
    if (!workshop) throw new Error('Workshop not found.');
    if (workshop.artisanId.toString() !== artisanUserId) throw new Error('Access denied.');

    return bookingRepository.updateById(id, { status, artisanNote } as any);
  },
};