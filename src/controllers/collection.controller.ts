import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response.util';
import { collectionService } from '../services/content.service';

export const getMyCollections = asyncHandler(async (req: Request, res: Response) => {
  const collections = await collectionService.getUserCollections(req.user!.id);
  sendSuccess(res, collections);
});

export const getCollectionById = asyncHandler(async (req: Request, res: Response) => {
  const collection = await collectionService.getCollectionById(req.params.id, req.user!.id);
  sendSuccess(res, collection);
});

export const createCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await collectionService.createCollection(req.user!.id, req.body);
  sendSuccess(res, collection, 'Collection created.', 201);
});

export const updateCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await collectionService.updateCollection(req.params.id, req.user!.id, req.body);
  sendSuccess(res, collection, 'Collection updated.');
});

export const deleteCollection = asyncHandler(async (req: Request, res: Response) => {
  await collectionService.deleteCollection(req.params.id, req.user!.id);
  sendSuccess(res, null, 'Collection deleted.');
});

export const addItemToCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await collectionService.addItem(req.params.id, req.user!.id, req.body);
  sendSuccess(res, collection, 'Item added to collection.');
});

export const removeItemFromCollection = asyncHandler(async (req: Request, res: Response) => {
  const { itemType, itemId } = req.params;
  const collection = await collectionService.removeItem(req.params.id, req.user!.id, itemType, itemId);
  sendSuccess(res, collection, 'Item removed from collection.');
});