import { Router } from 'express';
import { noticeController } from './notice.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { Role } from '@/generated/prisma/enums';
import {
  createNoticeSchema,
  updateNoticeSchema,
  noticeIdParamSchema,
  noticeQuerySchema,
} from './notice.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notices
 *   description: Notice management endpoints
 */

/**
 * @swagger
 * /notices:
 *   get:
 *     summary: Get all notices
 *     tags: [Notices]
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
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of notices
 */
router.get('/', validateRequest(noticeQuerySchema), noticeController.getAll);

/**
 * @swagger
 * /notices/featured:
 *   get:
 *     summary: Get featured notices (for home marquee)
 *     tags: [Notices]
 *     responses:
 *       200:
 *         description: List of featured notices
 */
router.get('/featured', noticeController.getFeatured);

/**
 * @swagger
 * /notices/important:
 *   get:
 *     summary: Get important notices (for marquee)
 *     tags: [Notices]
 *     responses:
 *       200:
 *         description: List of important notices
 */
router.get('/important', noticeController.getImportant);

/**
 * @swagger
 * /notices/active:
 *   get:
 *     summary: Get active notices (public)
 *     tags: [Notices]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of active notices
 */
router.get('/active', noticeController.getActive);

/**
 * @swagger
 * /notices/slug/{slug}:
 *   get:
 *     summary: Get notice by slug
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Notice data
 *       404:
 *         description: Not found
 */
router.get('/slug/:slug', noticeController.getBySlug);

/**
 * @swagger
 * /notices/{id}:
 *   get:
 *     summary: Get notice by ID
 *     tags: [Notices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Notice data
 *       404:
 *         description: Not found
 */
router.get('/:id', validateRequest(noticeIdParamSchema), noticeController.getById);

/**
 * @swagger
 * /notices:
 *   post:
 *     summary: Create notice (Admin only)
 *     tags: [Notices]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               category:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               isImportant:
 *                 type: boolean
 *               attachmentUrl:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notice created
 */
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(createNoticeSchema),
  noticeController.create,
);

/**
 * @swagger
 * /notices/{id}:
 *   put:
 *     summary: Update notice (Admin only)
 *     tags: [Notices]
 *     security:
 *       - cookieAuth: []
 */
router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(updateNoticeSchema),
  noticeController.update,
);

/**
 * @swagger
 * /notices/{id}:
 *   delete:
 *     summary: Delete notice (Admin only)
 *     tags: [Notices]
 *     security:
 *       - cookieAuth: []
 */
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(noticeIdParamSchema),
  noticeController.delete,
);

export default router;
