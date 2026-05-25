import * as db from '../db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await db.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopDonors = async (req, res) => {
  try {
    const donors = await db.getTopDonors();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
