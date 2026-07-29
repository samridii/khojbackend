import Workshop, { IWorkshop } from '../models/Workshop.model';
import Booking, { IBooking } from '../models/Booking.model';
import Collection, { ICollection } from '../models/Collection.model';
import Journey, { IJourney } from '../models/Journey.model';
import Journal, { IJournal } from '../models/Journal.model';
import Artisan, { IArtisan } from '../models/Artisan.model';
import AIMatch, { IAIMatch } from '../models/AIMatch.model';

// Workshop
export const workshopRepository = {
  findAll: (filter = {}) =>
    Workshop.find(filter).populate('artisanId', 'craft location district'),

  findById: (id: string) =>
    Workshop.findById(id).populate('artisanId'),

  findByArtisan: (artisanId: string) =>
    Workshop.find({ artisanId }),

  create: (data: Partial<IWorkshop>) =>
    Workshop.create(data),

  updateById: (id: string, data: Partial<IWorkshop>) =>
    Workshop.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    Workshop.findByIdAndDelete(id),
};

// Booking
export const bookingRepository = {
  findByUser: (userId: string) =>
    Booking.find({ userId })
      .populate('workshopId', 'title location craft duration price images')
      .sort({ createdAt: -1 }),

  findByWorkshop: (workshopId: string) =>
    Booking.find({ workshopId })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 }),

  findById: (id: string) =>
    Booking.findById(id)
      .populate('workshopId')
      .populate('userId', 'name email avatar'),

  create: (data: Partial<IBooking>) =>
    Booking.create(data),

  updateById: (id: string, data: Partial<IBooking>) =>
    Booking.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    Booking.findByIdAndDelete(id),
};

// Collection
export const collectionRepository = {
  findByUser: (userId: string) =>
    Collection.find({ userId }).sort({ createdAt: -1 }),

  findById: (id: string) =>
    Collection.findById(id),

  create: (data: Partial<ICollection>) =>
    Collection.create(data),

  updateById: (id: string, data: Partial<ICollection>) =>
    Collection.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    Collection.findByIdAndDelete(id),
};

// Journey
export const journeyRepository = {
  findByUser: (userId: string) =>
    Journey.find({ userId }).sort({ createdAt: -1 }),

  findById: (id: string) =>
    Journey.findById(id),

  findByShareToken: (token: string) =>
    Journey.findOne({ shareToken: token, isShared: true }),

  create: (data: Partial<IJourney>) =>
    Journey.create(data),

  updateById: (id: string, data: Partial<IJourney>) =>
    Journey.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    Journey.findByIdAndDelete(id),
};

// Journal
export const journalRepository = {
  findByUser: (userId: string, filter: Record<string, unknown> = {}) =>
    Journal.find({ userId, ...filter }).sort({ visitDate: -1 }),

  findById: (id: string) =>
    Journal.findById(id),

  create: (data: Partial<IJournal>) =>
    Journal.create(data),

  updateById: (id: string, data: Partial<IJournal>) =>
    Journal.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    Journal.findByIdAndDelete(id),
};

// Artisan
export const artisanRepository = {
  findAll: (filter = {}) =>
    Artisan.find(filter).populate('userId', 'name email avatar'),

  findById: (id: string) =>
    Artisan.findById(id).populate('userId', 'name email avatar'),

  findByUserId: (userId: string) =>
    Artisan.findOne({ userId }),

  create: (data: Partial<IArtisan>) =>
    Artisan.create(data),

  updateById: (id: string, data: Partial<IArtisan>) =>
    Artisan.findByIdAndUpdate(id, data, { new: true }),

  deleteById: (id: string) =>
    Artisan.findByIdAndDelete(id),
};

// AI Match
export const aiMatchRepository = {
  findByUser: (userId: string) =>
    AIMatch.find({ userId }).sort({ createdAt: -1 }),

  findById: (id: string) =>
    AIMatch.findById(id),

  create: (data: Partial<IAIMatch>) =>
    AIMatch.create(data),

  deleteById: (id: string) =>
    AIMatch.findByIdAndDelete(id),
};