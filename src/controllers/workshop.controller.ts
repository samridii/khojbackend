import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { workshopRepository, artisanRepository } from '../repositories/index.repository';

export const getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const { craft, district } = req.query;
  const filter: Record<string, unknown> = {};
  // Admin sees all; others see only active
  if (req.user?.role !== 'admin') filter.isActive = true;
  if (craft) filter.craft = craft;
  if (district) filter.district = district;
  const workshops = await workshopRepository.findAll(filter);
  sendSuccess(res, workshops);
});

export const getWorkshopById = asyncHandler(async (req: Request, res: Response) => {
  const workshop = await workshopRepository.findById(req.params.id);
  if (!workshop) { sendSuccess(res, null, 'Workshop not found.'); return; }
  sendSuccess(res, workshop);
});

export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  // Admin can create without artisan profile
  if (req.user?.role === 'admin') {
    const workshop = await workshopRepository.create({ ...req.body });
    sendSuccess(res, workshop, 'Workshop created.', 201);
    return;
  }
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  if (!artisan) {
    sendSuccess(res, null, 'Artisan profile not found.'); return;
  }
  const workshop = await workshopRepository.create({ ...req.body, artisanId: artisan._id });
  sendSuccess(res, workshop, 'Workshop created.', 201);
});

export const updateWorkshop = asyncHandler(async (req: Request, res: Response) => {
  // Admin can update any workshop
  if (req.user?.role === 'admin') {
    const updated = await workshopRepository.updateById(req.params.id, req.body);
    sendSuccess(res, updated, 'Workshop updated.');
    return;
  }
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  const workshop = await workshopRepository.findById(req.params.id);
  if (!workshop || workshop.artisanId.toString() !== artisan?._id.toString()) {
    sendSuccess(res, null, 'Workshop not found or access denied.'); return;
  }
  const updated = await workshopRepository.updateById(req.params.id, req.body);
  sendSuccess(res, updated, 'Workshop updated.');
});

export const deleteWorkshop = asyncHandler(async (req: Request, res: Response) => {
  // Admin can delete any workshop
  if (req.user?.role === 'admin') {
    await workshopRepository.deleteById(req.params.id);
    sendSuccess(res, null, 'Workshop deleted.');
    return;
  }
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  const workshop = await workshopRepository.findById(req.params.id);
  if (!workshop || workshop.artisanId.toString() !== artisan?._id.toString()) {
    sendSuccess(res, null, 'Workshop not found or access denied.'); return;
  }
  await workshopRepository.deleteById(req.params.id);
  sendSuccess(res, null, 'Workshop deleted.');
});

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
  if (!artisan) { sendSuccess(res, null, 'Artisan not found.'); return; }
  sendSuccess(res, artisan);
});

export const getMyArtisanProfile = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  sendSuccess(res, artisan);
});

export const updateArtisanProfile = asyncHandler(async (req: Request, res: Response) => {
  // Admin can update any artisan by id in params
  if (req.user?.role === 'admin' && req.params.id) {
    const updated = await artisanRepository.updateById(req.params.id, req.body);
    sendSuccess(res, updated, 'Artisan updated.');
    return;
  }
  const artisan = await artisanRepository.findByUserId(req.user!.id);
  if (!artisan) {
    const newArtisan = await artisanRepository.create({ userId: req.user!.id as any, ...req.body });
    sendSuccess(res, newArtisan, 'Artisan profile created.', 201);
    return;
  }
  const updated = await artisanRepository.updateById(artisan._id.toString(), req.body);
  sendSuccess(res, updated, 'Artisan profile updated.');
});

export const deleteArtisan = asyncHandler(async (req: Request, res: Response) => {
  await artisanRepository.deleteById(req.params.id);
  sendSuccess(res, null, 'Artisan deleted.');
});