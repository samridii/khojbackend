import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { Craft, Food, Community, Festival, Music } from '../models/Content.model';

// Generic factory to avoid repeating identical CRUD for each content type
const makeContentController = (Model: any) => ({
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const { region, tags } = req.query;
    const filter: Record<string, unknown> = { isActive: true };
    if (region) filter.region = region;
    if (tags) filter.tags = { $in: (tags as string).split(',') };
    const items = await Model.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, items);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.findOne({ slug: req.params.slug, isActive: true });
    if (!item) { sendSuccess(res, null, 'Not found.'); return; }
    sendSuccess(res, item);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.findById(req.params.id);
    if (!item) { sendSuccess(res, null, 'Not found.'); return; }
    sendSuccess(res, item);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.create(req.body);
    sendSuccess(res, item, 'Created.', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendSuccess(res, item, 'Updated.');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await Model.findByIdAndUpdate(req.params.id, { isActive: false });
    sendSuccess(res, null, 'Deleted.');
  }),
});

export const craftController   = makeContentController(Craft);
export const foodController    = makeContentController(Food);
export const communityController = makeContentController(Community);
export const festivalController  = makeContentController(Festival);
export const musicController   = makeContentController(Music);