import { Router } from 'express';
import { Role } from '@/generated/prisma/enums';
import { z } from 'zod';
import { userController } from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { updateProfileSchema, userIdParamSchema, getUsersQuerySchema } from './user.validation';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  authorize(Role.ADMIN),
  validateRequest(getUsersQuerySchema),
  userController.getAllUsers,
);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update own profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/profile', validateRequest(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  authorize(Role.ADMIN),
  validateRequest(userIdParamSchema),
  userController.getUserById,
);

/**
 * @swagger
 * /users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
router.patch(
  '/:id/toggle-status',
  authorize(Role.ADMIN),
  validateRequest(userIdParamSchema),
  userController.toggleUserStatus,
);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Change user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 */
router.patch(
  '/:id/role',
  authorize(Role.ADMIN),
  validateRequest({
    params: userIdParamSchema.params,
    body: z.object({ role: z.enum(['ADMIN', 'USER']) }),
  }),
  userController.changeUserRole,
);

export default router;
