import { Router } from 'express';
import { getMyRewards, getLeaderboard, getBadges } from '../controllers/rewardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, getMyRewards);
router.get('/leaderboard', getLeaderboard);
router.get('/badges', protect, getBadges);

export default router;
