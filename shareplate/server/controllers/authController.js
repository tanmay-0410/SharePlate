import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as db from '../db.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, certificates } = req.body;
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const userData = { name, email, password, phone, role, address };
    
    // Add certificates if provided (for restaurants)
    if (role === 'restaurant' && certificates?.fssai) {
      userData.certificates = {
        fssai: { url: certificates.fssai.url, uploadedAt: new Date() },
      };
    }
    
    const user = await db.registerUser(userData);
    await db.createReward({ user: user._id });
    const token = generateToken(user);
    res.status(201).json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const firebaseAuth = async (req, res) => {
  try {
    const { firebaseUid, name, email, photoURL, role } = req.body;
    let user = await db.findUser({ $or: [{ firebaseUid }, { email }] });
    if (user && Array.isArray(user)) user = user[0];

    if (!user) {
      user = await db.registerUser({ firebaseUid, name, email, photoURL, role: role || 'home_donor' });
      await db.createReward({ user: user._id });
    }
    const token = generateToken(user);
    res.json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    ['name', 'phone', 'address', 'photoURL'].forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    updates.updatedAt = new Date();
    const user = await db.updateUser({ _id: req.userId }, { $set: updates });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
