import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { aiService } from '../services/ai.service';

/**
 * @route   POST /api/ai/compass
 * @access  Protected
 */
export const runCompass = asyncHandler(async (req: Request, res: Response) => {
  const { inputText, moodTags } = req.body;
  const result = await aiService.runCompass(req.user!.id, inputText, moodTags);
  sendSuccess(res, result, 'Cultural match generated.');
});

/**
 * @route   POST /api/ai/journey
 * @access  Protected
 */
export const buildJourney = asyncHandler(async (req: Request, res: Response) => {
  const result = await aiService.buildJourney({ userId: req.user!.id, ...req.body });
  sendSuccess(res, result, 'Journey itinerary generated.');
});

/**
 * @route   GET /api/ai/matches
 * @access  Protected
 */
export const getMyMatches = asyncHandler(async (req: Request, res: Response) => {
  const matches = await aiService.getUserMatches(req.user!.id);
  sendSuccess(res, matches);
});

/**
 * @route   DELETE /api/ai/matches/:id
 * @access  Protected
 */
export const deleteMatch = asyncHandler(async (req: Request, res: Response) => {
  await aiService.deleteMatch(req.params.id, req.user!.id);
  sendSuccess(res, null, 'Match deleted.');
});