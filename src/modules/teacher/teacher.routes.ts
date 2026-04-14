import { Router } from 'express';
import { teacherController } from './teacher.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// Public routes - only active teachers
router.get('/active', teacherController.getAllActive);
router.get('/:id', teacherController.getById);

// Admin routes
router.get('/', authenticate, teacherController.getAll);
router.post('/', authenticate, teacherController.create);
router.put('/:id', authenticate, teacherController.update);
router.delete('/:id', authenticate, teacherController.delete);

export const teacherRoutes = router;
