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
 * /home/slides:
 *   get:
 *     summary: Get hero slides (Admin only)
 *     tags: [Home]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Hero slides data
 */
router.get('/slides', authenticate, authorize(Role.ADMIN), homeController.getSlides);

/**
 * @swagger
 * /home/slides:
 *   put:
 *     summary: Update hero slides (Admin only)
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
 *     responses:
 *       200:
 *         description: Hero slides updated
 */
router.put(
  '/slides',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(updateHomeSchema),
  homeController.updateSlides,
);

/**
 * @swagger
 * /home/stats:
 *   get:
 *     summary: Get statistics (Admin only)
 *     tags: [Home]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get('/stats', authenticate, authorize(Role.ADMIN), homeController.getStats);

/**
 * @swagger
 * /home/stats:
 *   put:
 *     summary: Update statistics (Admin only)
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
 *               stats:
 *                 type: array
 *     responses:
 *       200:
 *         description: Statistics updated
 */
router.put(
  '/stats',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(updateHomeSchema),
  homeController.updateStats,
);

/**
 * @swagger
 * /home/slide:
 *   put:
 *     summary: Create or update a hero slide (Admin only)
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
 *               id:
 *                 type: string
 *                 description: Slide ID (optional, required for update)
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Slide created or updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/slide',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('image'), // Use 'image' as the field name
  homeController.upsertSlide,
);

/**
 * @swagger
 * /home/slide/{id}:
 *   delete:
 *     summary: Delete a hero slide by ID (Admin only)
 *     tags: [Home]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slide ID
 *     responses:
 *       200:
 *         description: Slide deleted successfully
 *       404:
 *         description: Slide not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/slide/:id', authenticate, authorize(Role.ADMIN), homeController.deleteSlide);

/**
 * @swagger
 * /home/image:
 *   delete:
 *     summary: Delete an uploaded image (Admin only)
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
 *               imageUrl:
 *                 type: string
 *                 description: URL path to delete (e.g., /uploads/images/filename.jpg)
 *     responses:
 *       200:
 *         description: Image deleted successfully
 */
router.delete('/image', authenticate, authorize(Role.ADMIN), homeController.deleteImage);

export default router;
