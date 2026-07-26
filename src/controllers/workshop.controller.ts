import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { workshopRepository, artisanRepository } from '../repositories/index.repository';

// ─── Workshop Controller ──────────────────────────────────────────────────

export const getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const { craft, district } = req.query;
  const filter: Record<string, unknown> = { isActive: true };
  if (craft) filter.craft = craft;
  if (district) filter.district = district;
  const workshops = await workshopRepository.findAll(filter);
  sendSuccess(res, workshops);
});

export const getWorkshopById = asyncHandler(async (req: Request, res: Response) => {
  const workshop = await workshopRepository.findById(req.params.id);
  if (!workshop) {
    sendSuccess(res, null, 'Workshop not found.');
    return;
  }
  sendSuccess(res, workshop);
});

export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  // Artisan can only create workshops for their own artisan profile
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  if (!artisan) {
    sendSuccess(res, null, 'Artisan profile not found. Please complete your profile first.');
    return;
  }
  const workshop = await workshopRepository.create({ ...req.body, artisanId: artisan._id });
  sendSuccess(res, workshop, 'Workshop created.', 201);
});

export const updateWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  const workshop = await workshopRepository.findById(req.params.id);
  if (!workshop || workshop.artisanId.toString() !== artisan?._id.toString()) {
    sendSuccess(res, null, 'Workshop not found or access denied.');
    return;
  }
  const updated = await workshopRepository.updateById(req.params.id, req.body);
  sendSuccess(res, updated, 'Workshop updated.');
});

export const deleteWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  const workshop = await workshopRepository.findById(req.params.id);
  if (!workshop || workshop.artisanId.toString() !== artisan?._id.toString()) {
    sendSuccess(res, null, 'Workshop not found or access denied.');
    return;
  }
  await workshopRepository.deleteById(req.params.id);
  sendSuccess(res, null, 'Workshop deleted.');
});

// ─── Artisan Controller ───────────────────────────────────────────────────

export const getAllArtisans = asyncHandler(async (req: Request, res: Response) => {
  const { craft, district } = req.query;
  const filter: Record<string, unknown> = {};
  if (craft) filter.craft = craft;
  if (district) filter.district = district;
  const artisans = await artisanRepository.findAll(filter);
  sendSuccess(res, artisans);
});

export const getArtisanById = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanRepository.findById(req.params.id);
  if (!artisan) {
    sendSuccess(res, null, 'Artisan not found.');
    return;
  }
  sendSuccess(res, artisan);
});

export const getMyArtisanProfile = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  sendSuccess(res, artisan);
});

export const updateArtisanProfile = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  if (!artisan) {
    // Create profile if it doesn't exist yet
    const newArtisan = await artisanRepository.create({ userId: req.user!.id as any, ...req.body });
    sendSuccess(res, newArtisan, 'Artisan profile created.', 201);
    return;
  }
  const updated = await artisanRepository.updateById(artisan._id.toString(), req.body);
  sendSuccess(res, updated, 'Artisan profile updated.');
});