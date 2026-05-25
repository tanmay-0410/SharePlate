import { Router } from 'express';
import { getDashboardStats, getChartData, getTopDonors } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/chart', getChartData);
router.get('/top-donors', getTopDonors);

export default router;
