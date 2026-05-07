import { Router } from 'express';
import { qaController } from './qa.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// Public routes
router.get('/published', qaController.getAllPublished);
router.get('/:id', qaController.getById);
router.post('/create', qaController.createQuestion); // Public - anyone can ask
router.post('/:answerId/replies', qaController.addReply); // Public - anyone can reply

// Admin routes
router.get('/', authenticate, qaController.getAll);
router.put('/:id', authenticate, qaController.updateQuestion);
router.put('/:id/publish', authenticate, qaController.publishQuestion);
router.put('/:id/unpublish', authenticate, qaController.unpublishQuestion);
router.delete('/:id', authenticate, qaController.deleteQuestion);

// Admin answer routes
router.post('/:questionId/answers', authenticate, qaController.addAnswer);
router.put('/:answerId/answers', authenticate, qaController.updateAnswer);
router.delete('/:answerId/answers', authenticate, qaController.deleteAnswer);

// Admin reply routes
router.delete('/:replyId/replies', authenticate, qaController.deleteReply);

export const qaRoutes = router;
