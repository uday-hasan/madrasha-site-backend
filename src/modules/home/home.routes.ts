import { Router } from 'express';
import { homeController } from './home.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { Role } from '@/generated/prisma/enums';
import { updateHomeSchema } from './home.validation';
import { upload } from '../../config/multer';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: Home page content endpoints
 */

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Get home page data (heroSlides, stats, featuredNotices, featuredGallery)
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Home page data
 */
router.get('/', homeController.get);

/**
 * @swagger
 * /home/upload:
 *   post:
 *     summary: Upload hero slide image (Admin only)
 *     tags: [Home]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post(
  '/upload',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('image'),
  homeController.uploadImage,
);

/**
 * @swagger
 * /home:
 *   put:
 *     summary: Update home page content (Admin only)
 *     tags: [Home]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heroSlides:
 *                 type: array
 *               stats:
 *                 type: array
 *     responses:
 *       200:
 *         description: Home content updated
 */
router.put(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(updateHomeSchema),
  homeController.update,
);

export default router;
