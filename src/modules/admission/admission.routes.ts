import { Router } from 'express';
import { admissionController } from './admission.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// ============ PUBLIC ROUTES ============
router.get('/', admissionController.getFullAdmissionInfo);

// ============ ADMIN ROUTES ============

// Settings
router.get('/admin/settings', authenticate, admissionController.getSettings);
router.put('/admin/settings', authenticate, admissionController.updateSettings);

// Processes
router.get('/admin/processes', authenticate, admissionController.getAdminProcesses);
router.post('/admin/processes', authenticate, admissionController.createProcess);
router.put('/admin/processes/:id', authenticate, admissionController.updateProcess);
router.delete('/admin/processes/:id', authenticate, admissionController.deleteProcess);

// Requirements
router.get('/admin/requirements', authenticate, admissionController.getAdminRequirements);
router.get('/admin/requirements/:id', authenticate, admissionController.getRequirementById);
router.post('/admin/requirements', authenticate, admissionController.createRequirement);
router.put('/admin/requirements/:id', authenticate, admissionController.updateRequirement);
router.delete('/admin/requirements/:id', authenticate, admissionController.deleteRequirement);

// Important Dates
router.get('/admin/important-dates', authenticate, admissionController.getAdminImportantDates);
router.get('/admin/important-dates/:id', authenticate, admissionController.getImportantDateById);
router.post('/admin/important-dates', authenticate, admissionController.createImportantDate);
router.put('/admin/important-dates/:id', authenticate, admissionController.updateImportantDate);
router.delete('/admin/important-dates/:id', authenticate, admissionController.deleteImportantDate);

export default router;
