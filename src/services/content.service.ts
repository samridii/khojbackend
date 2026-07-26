import { collectionRepository, journeyRepository, journalRepository } from '../repositories/index.repository';
import crypto from 'crypto';

//  Collection Service 
export const collectionService = {
  getUserCollections: (userId: string) =>
    collectionRepository.findByUser(userId),

  getCollectionById: async (id: string, userId: string) => {
    const col = await collectionRepository.findById(id);
    if (!col) throw new Error('Collection not found.');
    if (!col.isPublic && col.userId.toString() !== userId) throw new Error('Access denied.');
    return col;
  },

  createCollection: (userId: string, data: { title: string; description?: string; isPublic?: boolean }) =>
    collectionRepository.create({ userId: userId as any, ...data }),

  updateCollection: async (id: string, userId: string, data: Partial<{ title: string; description: string; isPublic: boolean; coverImage: string }>) => {
    const col = await collectionRepository.findById(id);
    if (!col) throw new Error('Collection not found.');
    if (col.userId.toString() !== userId) throw new Error('Access denied.');
    return collectionRepository.updateById(id, data as any);
  },

  deleteCollection: async (id: string, userId: string) => {
    const col = await collectionRepository.findById(id);
    if (!col) throw new Error('Collection not found.');
    if (col.userId.toString() !== userId) throw new Error('Access denied.');
    return collectionRepository.deleteById(id);
  },

  addItem: async (id: string, userId: string, item: { itemType: string; itemId: string; note?: string }) => {
    const col = await collectionRepository.findById(id);
    if (!col) throw new Error('Collection not found.');
    if (col.userId.toString() !== userId) throw new Error('Access denied.');

    // Prevent duplicates
    const alreadyExists = col.items.some(
      (i) => i.itemType === item.itemType && i.itemId.toString() === item.itemId
    );
    if (alreadyExists) throw new Error('Item already in this collection.');

    col.items.push({ itemType: item.itemType as any, itemId: item.itemId as any, note: item.note, savedAt: new Date() });
    return col.save();
  },

  removeItem: async (collectionId: string, userId: string, itemType: string, itemId: string) => {
    const col = await collectionRepository.findById(collectionId);
    if (!col) throw new Error('Collection not found.');
    if (col.userId.toString() !== userId) throw new Error('Access denied.');

    col.items = col.items.filter(
      (i) => !(i.itemType === itemType && i.itemId.toString() === itemId)
    );
    return col.save();
  },
};

// Journey Service 

export const journeyService = {
  getUserJourneys: (userId: string) =>
    journeyRepository.findByUser(userId),

  getJourneyById: async (id: string, userId: string) => {
    const journey = await journeyRepository.findById(id);
    if (!journey) throw new Error('Journey not found.');
    if (!journey.isShared && journey.userId.toString() !== userId) throw new Error('Access denied.');
    return journey;
  },

  getByShareToken: async (token: string) => {
    const journey = await journeyRepository.findByShareToken(token);
    if (!journey) throw new Error('Shared journey not found.');
    return journey;
  },

  saveJourney: (userId: string, data: object) =>
    journeyRepository.create({ userId: userId as any, ...data }),

  updateJourney: async (id: string, userId: string, data: Partial<{ title: string; isShared: boolean }>) => {
    const journey = await journeyRepository.findById(id);
    if (!journey) throw new Error('Journey not found.');
    if (journey.userId.toString() !== userId) throw new Error('Access denied.');
    return journeyRepository.updateById(id, data as any);
  },

  shareJourney: async (id: string, userId: string) => {
    const journey = await journeyRepository.findById(id);
    if (!journey) throw new Error('Journey not found.');
    if (journey.userId.toString() !== userId) throw new Error('Access denied.');

    const shareToken = crypto.randomBytes(16).toString('hex');
    return journeyRepository.updateById(id, { isShared: true, shareToken } as any);
  },

  deleteJourney: async (id: string, userId: string) => {
    const journey = await journeyRepository.findById(id);
    if (!journey) throw new Error('Journey not found.');
    if (journey.userId.toString() !== userId) throw new Error('Access denied.');
    return journeyRepository.deleteById(id);
  },
};

// Journal Service 

export const journalService = {
  getUserJournals: (userId: string, mood?: string, district?: string) => {
    const filter: Record<string, unknown> = {};
    if (mood) filter.mood = mood;
    if (district) filter.district = district;
    return journalRepository.findByUser(userId, filter);
  },

  getJournalById: async (id: string, userId: string) => {
    const entry = await journalRepository.findById(id);
    if (!entry) throw new Error('Journal entry not found.');
    if (entry.userId.toString() !== userId) throw new Error('Access denied.');
    return entry;
  },

  createEntry: (userId: string, data: object) =>
    journalRepository.create({ userId: userId as any, ...data }),

  updateEntry: async (id: string, userId: string, data: object) => {
    const entry = await journalRepository.findById(id);
    if (!entry) throw new Error('Journal entry not found.');
    if (entry.userId.toString() !== userId) throw new Error('Access denied.');
    return journalRepository.updateById(id, data as any);
  },

  deleteEntry: async (id: string, userId: string) => {
    const entry = await journalRepository.findById(id);
    if (!entry) throw new Error('Journal entry not found.');
    if (entry.userId.toString() !== userId) throw new Error('Access denied.');
    return journalRepository.deleteById(id);
  },
};