import { Router } from 'express';
import { departmentController } from './department.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { upload } from '../../config/multer';
import { Role } from '@/generated/prisma/enums';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdParamSchema,
  departmentQuerySchema,
} from './department.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management endpoints
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/', validateRequest(departmentQuerySchema), departmentController.getAll);

/**
 * @swagger
 * /departments/active:
 *   get:
 *     summary: Get all active departments (public)
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of active departments
 */
router.get('/active', departmentController.getActive);

/**
 * @swagger
 * /departments/slug/{slug}:
 *   get:
 *     summary: Get department by slug
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Department data
 *       404:
 *         description: Not found
 */
router.get('/slug/:slug', departmentController.getBySlug);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Department data
 *       404:
 *         description: Not found
 */
router.get('/:id', validateRequest(departmentIdParamSchema), departmentController.getById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create department (Admin only)
 *     tags: [Departments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, duration]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: string
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               headTeacher:
 *                 type: string
 *               totalStudents:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               isActive:
 *                 type: boolean
 *               displayOrder:
 *                 type: integer
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 */
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('image'),
  validateRequest(createDepartmentSchema),
  departmentController.create,
);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department (Admin only)
 *     tags: [Departments]
 *     security:
 *       - cookieAuth: []
 */
router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  upload.single('image'),
  validateRequest(updateDepartmentSchema),
  departmentController.update,
);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete department (Admin only)
 *     tags: [Departments]
 *     security:
 *       - cookieAuth: []
 */
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validateRequest(departmentIdParamSchema),
  departmentController.delete,
);

export default router;
