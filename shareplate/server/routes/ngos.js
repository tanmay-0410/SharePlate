import { Router } from 'express';
import { registerNGO, getNGOs, getNGOById, updateNGO, verifyNGO } from '../controllers/ngoController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, registerNGO);
router.get('/', getNGOs);
router.get('/:id', getNGOById);
router.put('/', protect, updateNGO);
router.put('/:id/verify', protect, authorize('admin'), verifyNGO);

export default router;
