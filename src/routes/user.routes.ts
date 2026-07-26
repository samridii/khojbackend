import { Router } from 'express';
import {
  getMyCollections, getCollectionById, createCollection,
  updateCollection, deleteCollection, addItemToCollection, removeItemFromCollection,
} from '../controllers/collection.controller';
import {
  getMyJourneys, getJourneyById, saveJourney,
  updateJourney, shareJourney, deleteJourney, getSharedJourney,
} from '../controllers/journey.controller';
import {
  getMyJournals, getJournalById, createJournal,
  updateJournal, deleteJournal,
} from '../controllers/journal.controller';
import { protect } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import {
  createCollectionSchema, updateCollectionSchema, addCollectionItemSchema,
  saveJourneySchema, createJournalSchema, updateJournalSchema,
} from '../validations/schemas';

// ─── Collections ──────────────────────────────────────────────────────────

export const collectionRouter = Router();
collectionRouter.use(protect);

collectionRouter.route('/')
  .get(getMyCollections)
  .post(validate(createCollectionSchema), createCollection);

collectionRouter.route('/:id')
  .get(getCollectionById)
  .patch(validate(updateCollectionSchema), updateCollection)
  .delete(deleteCollection);

collectionRouter.post('/:id/items', validate(addCollectionItemSchema), addItemToCollection);
collectionRouter.delete('/:id/items/:itemType/:itemId', removeItemFromCollection);

// ─── Journeys ─────────────────────────────────────────────────────────────

export const journeyRouter = Router();

// Public: view a shared journey by token
journeyRouter.get('/shared/:token', getSharedJourney);

// Protected routes
journeyRouter.use(protect);

journeyRouter.route('/')
  .get(getMyJourneys)
  .post(validate(saveJourneySchema), saveJourney);

journeyRouter.route('/:id')
  .get(getJourneyById)
  .patch(updateJourney)
  .delete(deleteJourney);

journeyRouter.patch('/:id/share', shareJourney);

// ─── Journal ──────────────────────────────────────────────────────────────

export const journalRouter = Router();
journalRouter.use(protect);

journalRouter.route('/')
  .get(getMyJournals)
  .post(validate(createJournalSchema), createJournal);

journalRouter.route('/:id')
  .get(getJournalById)
  .patch(validate(updateJournalSchema), updateJournal)
  .delete(deleteJournal);