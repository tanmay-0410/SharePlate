import { Router } from 'express';
import { uploadImage, uploadBase64, uploadCertificate } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/image', protect, upload.single('file'), uploadImage);
router.post('/base64', protect, uploadBase64);
router.post('/certificate', protect, upload.single('file'), uploadCertificate);

export default router;
