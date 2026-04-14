import { Router } from 'express';
import { settingsController } from './settings.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// Public routes
router.get('/public', settingsController.getPublic);
router.get('/public/:category', settingsController.getByCategory);
router.get('/public/key/:key', settingsController.getByKey);

// Admin only routes
router.get('/', authenticate, settingsController.getAll);
router.post('/', authenticate, settingsController.create);
router.put('/:id', authenticate, settingsController.update);
router.delete('/:id', authenticate, settingsController.delete);

export const settingsRoutes = router;
