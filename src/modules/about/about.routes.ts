import { Router } from 'express';
import { aboutController } from './about.controller';
import { authenticate } from '../../middlewares/authenticate';
import { uploadImage } from '../../config/multer';

const router = Router();

// ============ ABOUT SECTIONS ============
// Public routes
router.get('/sections/public', aboutController.getAboutSections);

// Admin routes
router.get('/sections/admin', authenticate, aboutController.getAllAboutSections);
router.get('/sections/:id', authenticate, aboutController.getAboutSectionById);
router.post('/sections', authenticate, aboutController.createAboutSection);
router.put('/sections/:id', authenticate, aboutController.updateAboutSection);
router.delete('/sections/:id', authenticate, aboutController.deleteAboutSection);

// ============ ABOUT VALUES ============
// Public routes
router.get('/values/public', aboutController.getAboutValues);

// Admin routes
router.get('/values/admin', authenticate, aboutController.getAllAboutValues);
router.post('/values', authenticate, aboutController.createAboutValue);
router.put('/values/:id', authenticate, aboutController.updateAboutValue);
router.delete('/values/:id', authenticate, aboutController.deleteAboutValue);

// ============ ACHIEVEMENTS ============
// Public routes
router.get('/achievements/public', aboutController.getAchievements);

// Admin routes
router.get('/achievements/admin', authenticate, aboutController.getAllAchievements);
router.post('/achievements', authenticate, aboutController.createAchievement);
router.put('/achievements/:id', authenticate, aboutController.updateAchievement);
router.delete('/achievements/:id', authenticate, aboutController.deleteAchievement);

// ============ PROPOSED BUILDINGS ============
// Public routes
router.get('/buildings/public', aboutController.getProposedBuildings);

// Admin routes
router.get('/buildings/admin', authenticate, aboutController.getAllProposedBuildings);
router.post(
  '/buildings',
  authenticate,
  uploadImage.single('file'),
  aboutController.createProposedBuilding,
);
router.put(
  '/buildings/:id',
  authenticate,
  uploadImage.single('file'),
  aboutController.updateProposedBuilding,
);
router.delete('/buildings/:id', authenticate, aboutController.deleteProposedBuilding);

// ============ LEADERSHIP ============
// Public routes
router.get('/leadership/public', aboutController.getLeadership);

// Admin routes
router.get('/leadership/admin', authenticate, aboutController.getAllLeadership);
router.post('/leadership', authenticate, aboutController.createLeadershipMember);
router.put('/leadership/:id', authenticate, aboutController.updateLeadershipMember);
router.delete('/leadership/:id', authenticate, aboutController.deleteLeadershipMember);

// ============ ABOUT QUOTES ============
// Public routes
router.get('/quotes/public', aboutController.getAboutQuotes);

// Admin routes
router.get('/quotes/admin', authenticate, aboutController.getAllAboutQuotes);
router.post('/quotes', authenticate, aboutController.createAboutQuote);
router.put('/quotes/:id', authenticate, aboutController.updateAboutQuote);
router.delete('/quotes/:id', authenticate, aboutController.deleteAboutQuote);

export const aboutRoutes = router;
