import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'shareplate',
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    // Fallback: return the base64 data as a data URL
    if (req.body.image) {
      return res.json({ url: req.body.image });
    }
    res.status(500).json({ message: error.message });
  }
};

export const uploadBase64 = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: 'No image data' });

    const result = await cloudinary.uploader.upload(image, {
      folder: 'shareplate',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.json({ url: req.body.image });
  }
};

export const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'shareplate/certificates',
      resource_type: 'auto',
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      certificateType: req.body.certificateType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
