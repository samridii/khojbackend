import { Router } from 'express';
import { craftController, foodController, communityController, festivalController, musicController } from '../controllers/content.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const makeContentRouter = (controller: ReturnType<typeof import('../controllers/content.controller').craftController extends infer T ? () => T : never>) => {
  const router = Router();
  router.get('/', controller.getAll);
  router.get('/slug/:slug', controller.getBySlug);
  router.get('/:id', controller.getById);
  // Admin only for write operations
  router.post('/', protect, restrictTo('admin'), controller.create);
  router.patch('/:id', protect, restrictTo('admin'), controller.update);
  router.delete('/:id', protect, restrictTo('admin'), controller.delete);
  return router;
};

// We build each router manually to avoid complex TypeScript generics
const makeRouter = (controller: any) => {
  const router = Router();
  router.get('/',          controller.getAll);
  router.get('/slug/:slug', controller.getBySlug);
  router.get('/:id',       controller.getById);
  router.post('/',         protect, restrictTo('admin'), controller.create);
  router.patch('/:id',     protect, restrictTo('admin'), controller.update);
  router.delete('/:id',    protect, restrictTo('admin'), controller.delete);
  return router;
};

export const craftRouter     = makeRouter(craftController);
export const foodRouter      = makeRouter(foodController);
export const communityRouter = makeRouter(communityController);
export const festivalRouter  = makeRouter(festivalController);
export const musicRouter     = makeRouter(musicController);