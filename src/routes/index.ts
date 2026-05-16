import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import galleryRoutes from '../modules/gallery/gallery.routes';
import noticeRoutes from '../modules/notice/notice.routes';
import homeRoutes from '../modules/home/home.routes';
import departmentRoutes from '../modules/department/department.routes';
import { settingsRoutes } from '../modules/settings/settings.routes';
import { teacherRoutes } from '../modules/teacher/teacher.routes';
import { qaRoutes } from '../modules/qa/qa.routes';
import { donationRouter } from '../modules/donation/donation.routes';
import { contactRouter } from '../modules/contact/contact.routes';
import { aboutRoutes } from '../modules/about/about.routes';

// ================================
// MAIN ROUTER
// Combines all module routers into one.
// Adding a new module = one line here.
// ================================

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/gallery', galleryRoutes);
router.use('/notices', noticeRoutes);
router.use('/home', homeRoutes);
router.use('/departments', departmentRoutes);
router.use('/settings', settingsRoutes);
router.use('/teachers', teacherRoutes);
router.use('/qa', qaRoutes);
router.use('/donation', donationRouter);
router.use('/contact', contactRouter);
router.use('/about', aboutRoutes);

export default router;
