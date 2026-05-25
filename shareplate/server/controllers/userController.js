import * as db from '../db.js';

export const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await db.findUsers(filter, { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit: parseInt(limit) });
    const total = await db.countUsers(filter);
    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await db.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role, isActive, isVerified } = req.body;
    const user = await db.updateUser({ _id: req.params.id }, { $set: { role, isActive, isVerified, updatedAt: new Date() } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await db.updateUser({ _id: req.params.id }, { $set: { isActive: false } });
    res.json({ message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadCertificate = async (req, res) => {
  try {
    const { certificateType, url } = req.body;
    if (!certificateType || !url) {
      return res.status(400).json({ message: 'Certificate type and URL required' });
    }

    const certData = {
      [certificateType]: {
        url,
        uploadedAt: new Date(),
      },
    };

    const user = await db.updateUser(
      { _id: req.user._id },
      { $set: { [`certificates.${certificateType}`]: certData[certificateType], updatedAt: new Date() } }
    );

    res.json({ message: `${certificateType.toUpperCase()} certificate uploaded successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
