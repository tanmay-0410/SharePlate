import { Router } from 'express';
import { createDelivery, getDeliveries, assignDelivery, updateDeliveryStatus } from '../controllers/deliveryController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createDelivery);
router.get('/', protect, getDeliveries);
router.put('/:id/assign', protect, assignDelivery);
router.put('/:id/status', protect, updateDeliveryStatus);

export default router;
