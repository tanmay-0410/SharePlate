import * as db from '../db.js';

export const registerNGO = async (req, res) => {
  try {
    const ngo = await db.createNGO({ user: req.userId, ...req.body });
    await db.updateUser({ _id: req.userId }, { $set: { role: 'ngo' } });
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNGOs = async (req, res) => {
  try {
    const ngos = await db.findNGOs({ isVerified: true });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNGOById = async (req, res) => {
  try {
    const ngo = await db.findNGO({ _id: req.params.id });
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNGO = async (req, res) => {
  try {
    const ngo = await db.updateNGO({ user: req.userId }, req.body);
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyNGO = async (req, res) => {
  try {
    const ngo = await db.updateNGO({ _id: req.params.id }, { isVerified: true });
    if (ngo?.user) await db.updateUser({ _id: ngo.user }, { $set: { ngoVerified: true } });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
