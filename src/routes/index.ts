import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import galleryRoutes from '../modules/gallery/gallery.routes';
import noticeRoutes from '../modules/notice/notice.routes';
import homeRoutes from '../modules/home/home.routes';
import departmentRoutes from '../modules/department/department.routes';

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

export default router;
