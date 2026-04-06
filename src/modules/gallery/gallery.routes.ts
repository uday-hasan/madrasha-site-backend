import { Router } from 'express';
import { galleryController } from './gallery.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { upload } from '../../config/multer';
import { Role } from '@/generated/prisma/enums';
import {
  createGallerySchema,
  updateGallerySchema,
  galleryIdParamSchema,
  galleryQuerySchema,
} from './gallery.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: Gallery management endpoints
 */

/**
 * @swagger
 * /gallery:
 *   get:
 *     summary: Get all gallery items
 *     tags: [Gallery]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: mediaType
 *         schema: { type: string, enum: [IMAGE, VIDEO] }
 *     responses:
 *       200:
 *         description: List of gallery items
 */
router.get('/', validateRequest(galleryQuerySchema), galleryController.getAll);

/**
 * @swagger
 * /gallery/{id}:
 *   get:
 *     summary: Get gallery item by ID
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Gallery item data
 *       404:
 *         description: Not found
 */
router.get('/:id', validateRequest(galleryIdParamSchema), galleryController.getById);

/**
 * @swagger
 * /gallery:
 *   post:
 *     summary: Create gallery item (Admin only)
 *     tags: [Gallery]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               mediaType:
 *                 type: string
 *                 enum: [IMAGE, VIDEO]
 *               category:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               file:
 *                 type: string
 *                 format: binary
 *               videoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gallery item created
 */
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('file'),
  validateRequest(createGallerySchema),
  galleryController.create,
);

/**
 * @swagger
 * /gallery/{id}:
 *   put:
 *     summary: Update gallery item (Admin only)
 *     tags: [Gallery]
 *     security:
 *       - cookieAuth: []
 */
router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('file'),
  validateRequest(updateGallerySchema),
  galleryController.update,
);

/**
 * @swagger
 * /gallery/{id}:
 *   delete:
 *     summary: Delete gallery item (Admin only)
 *     tags: [Gallery]
 *     security:
 *       - cookieAuth: []
 */
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(galleryIdParamSchema),
  galleryController.delete,
);

export default router;
