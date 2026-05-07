import { Router } from 'express';
import { donationController } from './donation.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { Role } from '@/generated/prisma/enums';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Donation
 *   description: Donation page endpoints
 */

/**
 * @swagger
 * /donation:
 *   get:
 *     summary: Get donation page data
 *     tags: [Donation]
 *     responses:
 *       200:
 *         description: Donation page data
 */
router.get('/', donationController.getDonationData);

/**
 * @swagger
 * /donation:
 *   put:
 *     summary: Update donation page data (Admin only)
 *     tags: [Donation]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageTitle:
 *                 type: string
 *               pageDescription:
 *                 type: string
 *               bannerText:
 *                 type: string
 *               quranicVerse:
 *                 type: object
 *               categories:
 *                 type: array
 *               methods:
 *                 type: array
 *               contactForDonation:
 *                 type: object
 *     responses:
 *       200:
 *         description: Donation data updated successfully
 */
router.put('/', authenticate, authorize(Role.ADMIN), donationController.updateDonationData);

export const donationRouter = router;
