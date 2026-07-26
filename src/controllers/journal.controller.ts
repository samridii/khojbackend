import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { journalService } from '../services/content.service';

export const getMyJournals = asyncHandler(async (req: Request, res: Response) => {
  const { mood, district } = req.query;
  const journals = await journalService.getUserJournals(
    req.user!.id,
    mood as string | undefined,
    district as string | undefined
  );
  sendSuccess(res, journals);
});

export const getJournalById = asyncHandler(async (req: Request, res: Response) => {
  const journal = await journalService.getJournalById(req.params.id, req.user!.id);
  sendSuccess(res, journal);
});

export const createJournal = asyncHandler(async (req: Request, res: Response) => {
  const journal = await journalService.createEntry(req.user!.id, req.body);
  sendSuccess(res, journal, 'Journal entry created.', 201);
});

export const updateJournal = asyncHandler(async (req: Request, res: Response) => {
  const journal = await journalService.updateEntry(req.params.id, req.user!.id, req.body);
  sendSuccess(res, journal, 'Journal entry updated.');
});

export const deleteJournal = asyncHandler(async (req: Request, res: Response) => {
  await journalService.deleteEntry(req.params.id, req.user!.id);
  sendSuccess(res, null, 'Journal entry deleted.');
});