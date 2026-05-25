import { Router } from 'express';
import {
  createDonation, getDonations, getMyDonations, getDonationById,
  claimDonation, updateDonationStatus, deleteDonation, analyzeDonationImage,
} from '../controllers/donationController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createDonation);
router.get('/', optionalAuth, getDonations);
router.get('/mine', protect, getMyDonations);
router.post('/analyze', protect, analyzeDonationImage);
router.get('/:id', getDonationById);
router.post('/:id/claim', protect, claimDonation);
router.put('/:id/status', protect, updateDonationStatus);
router.delete('/:id', protect, deleteDonation);

export default router;
