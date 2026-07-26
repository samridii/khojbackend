import { Router } from 'express';
import { runCompass, buildJourney, getMyMatches, deleteMatch } from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import { aiCompassSchema, aiJourneySchema } from '../validations/schemas';

const router = Router();

// All AI routes require login
router.use(protect);

/**
 * @swagger
 * /ai/compass:
 *   post:
 *     summary: Run the AI Cultural Compass
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inputText, moodTags]
 *             properties:
 *               inputText: { type: string, example: "I want something peaceful and spiritual" }
 *               moodTags:  { type: array, items: { type: string }, example: ["peaceful", "spiritual"] }
 */
router.post('/compass', validate(aiCompassSchema), runCompass);

/**
 * @swagger
 * /ai/journey:
 *   post:
 *     summary: Generate an AI Journey itinerary
 *     tags: [AI]
 */
router.post('/journey', validate(aiJourneySchema), buildJourney);

/**
 * @swagger
 * /ai/matches:
 *   get:
 *     summary: Get my saved AI compass matches
 *     tags: [AI]
 */
router.get('/matches', getMyMatches);
router.delete('/matches/:id', deleteMatch);

export default router;