import { Router } from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/message', protect, sendMessage);

export default router;
