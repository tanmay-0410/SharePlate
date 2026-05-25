import { Router } from 'express';
import { getUsers, getUserById, updateUserRole, deleteUser, uploadCertificate } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.post('/certificate/upload', protect, uploadCertificate);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
