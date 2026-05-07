import { Router } from 'express';
import { contactController } from './contact.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { Role } from '@/generated/prisma/enums';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact page endpoints
 */

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get contact page data
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Contact page data
 */
router.get('/', contactController.getContactData);

/**
 * @swagger
 * /contact:
 *   put:
 *     summary: Update contact page data (Admin only)
 *     tags: [Contact]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               phone:
 *                 type: array
 *               email:
 *                 type: array
 *               officeHours:
 *                 type: string
 *               googleMapsUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact data updated successfully
 */
router.put('/', authenticate, authorize(Role.ADMIN), contactController.updateContactData);

/**
 * @swagger
 * /contact/submit:
 *   post:
 *     summary: Submit contact form (Public)
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 */
router.post('/submit', contactController.submitContactForm);

export const contactRouter = router;
