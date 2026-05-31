import { Router } from 'express';
import { applicationController } from './application.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// ============ PUBLIC ROUTES ============
// Create application (no authentication required)
router.post('/create', applicationController.createApplication);

// ============ ADMIN ROUTES ============
// Get all applications
router.get('/', authenticate, applicationController.getApplications);

// Get applications statistics
router.get('/stats', authenticate, applicationController.getApplicationStats);

// Get single application
router.get('/:id', authenticate, applicationController.getApplicationById);

// Update application status
router.patch('/:id/status', authenticate, applicationController.updateApplicationStatus);

// Delete application
router.delete('/:id', authenticate, applicationController.deleteApplication);

export const applicationRoutes = router;
