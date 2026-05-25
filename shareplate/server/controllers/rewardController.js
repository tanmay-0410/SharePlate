import * as db from '../db.js';

const BADGE_DEFINITIONS = [
  { name: 'First Donation', icon: '🌟', threshold: 1 },
  { name: 'Helping Hand', icon: '🤝', threshold: 5 },
  { name: 'Food Hero', icon: '🦸', threshold: 10 },
  { name: 'Community Champion', icon: '🏆', threshold: 25 },
  { name: 'Life Saver', icon: '❤️', threshold: 50 },
  { name: 'Legend', icon: '👑', threshold: 100 },
];

export const getMyRewards = async (req, res) => {
  try {
    let reward = await db.findReward({ user: req.userId });
    if (!reward) {
      reward = await db.createReward({ user: req.userId });
    }

    const allRewards = await db.findRewards({}, { sort: { points: -1 }, limit: 50 });
    const myIndex = allRewards.findIndex((r) => {
      const uid = typeof r.user === 'object' ? r.user?._id : r.user;
      return uid?.toString() === req.userId;
    });
    reward.rank = myIndex + 1;

    const nextBadge = BADGE_DEFINITIONS.find((b) => b.threshold > (reward.totalDonations || 0));

    res.json({ ...reward, nextBadge, totalUsers: 50 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const rewards = await db.findRewards({}, { sort: { points: -1 }, limit: 50 });
    const leaderboard = rewards.map((r, index) => {
      const userObj = typeof r.user === 'object' ? r.user : null;
      return {
        rank: index + 1,
        name: userObj?.name || 'Unknown',
        photoURL: userObj?.photoURL || '',
        points: r.points || 0,
        totalDonations: r.totalDonations || 0,
        badges: r.badges || [],
        level: r.level || 1,
      };
    });
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBadges = async (req, res) => {
  try {
    const reward = await db.findReward({ user: req.userId });
    const earned = reward?.badges?.map((b) => b.name) || [];
    const allBadges = BADGE_DEFINITIONS.map((b) => ({
      ...b,
      earned: earned.includes(b.name),
      progress: Math.min((reward?.totalDonations || 0) / b.threshold, 1),
    }));
    res.json(allBadges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
