import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { journeyService } from '../services/content.service';

export const getMyJourneys = asyncHandler(async (req: Request, res: Response) => {
  const journeys = await journeyService.getUserJourneys(req.user!.id);
  sendSuccess(res, journeys);
});

export const getJourneyById = asyncHandler(async (req: Request, res: Response) => {
  const journey = await journeyService.getJourneyById(req.params.id, req.user!.id);
  sendSuccess(res, journey);
});

export const getSharedJourney = asyncHandler(async (req: Request, res: Response) => {
  const journey = await journeyService.getByShareToken(req.params.token);
  sendSuccess(res, journey);
});

export const saveJourney = asyncHandler(async (req: Request, res: Response) => {
  const journey = await journeyService.saveJourney(req.user!.id, req.body);
  sendSuccess(res, journey, 'Journey saved.', 201);
});

export const updateJourney = asyncHandler(async (req: Request, res: Response) => {
  const journey = await journeyService.updateJourney(req.params.id, req.user!.id, req.body);
  sendSuccess(res, journey, 'Journey updated.');
});

export const shareJourney = asyncHandler(async (req: Request, res: Response) => {
  const journey = await journeyService.shareJourney(req.params.id, req.user!.id);
  sendSuccess(res, journey, 'Journey is now shareable.');
});

export const deleteJourney = asyncHandler(async (req: Request, res: Response) => {
  await journeyService.deleteJourney(req.params.id, req.user!.id);
  sendSuccess(res, null, 'Journey deleted.');
});