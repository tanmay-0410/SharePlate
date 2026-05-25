import * as db from '../db.js';
import { analyzeFood } from '../config/gemini.js';

export const createDonation = async (req, res) => {
  try {
    const { foodName, description, quantity, unit, foodType, category, expiryTime, pickupLocation, images } = req.body;

    let aiData = {};
    if (images && images.length > 0) {
      const base64Image = images[0].replace(/^data:image\/\w+;base64,/, '');
      const analysis = await analyzeFood(base64Image);
      if (analysis) {
        aiData = {
          aiAnalysis: {
            foodName: analysis.foodName || foodName,
            freshnessHours: analysis.freshnessHours,
            isSafe: analysis.isSafe,
            spoilageRisk: analysis.spoilageRisk,
          },
          freshnessHours: analysis.freshnessHours || 0,
          spoilageRisk: analysis.spoilageRisk || 'low',
          isSafe: analysis.isSafe !== undefined ? analysis.isSafe : true,
        };
      }
    }

    const donation = await db.createDonation({
      donor: req.userId,
      foodName,
      description,
      quantity,
      unit,
      foodType,
      category,
      images,
      expiryTime: expiryTime || new Date(Date.now() + 24 * 60 * 60 * 1000),
      pickupLocation,
      ...aiData,
      status: 'available',
    });

    const io = req.app.get('io');
    if (io) io.emit('newDonation', { donationId: donation._id, foodName, quantity, pickupLocation });

    await db.updateUser({ _id: req.userId }, { $inc: { totalDonations: 1 } });
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonations = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.foodType = type;
    if (req.userRole !== 'admin') filter.status = { $ne: 'cancelled' };

    const donations = await db.findDonations(filter, {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit),
    });
    const total = await db.countDonations(filter);

    res.json({ donations, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDonations = async (req, res) => {
  try {
    const donations = await db.findDonations({ donor: req.userId }, { sort: { createdAt: -1 } });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await db.findDonationById(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const claimDonation = async (req, res) => {
  try {
    const donation = await db.findDonation({ _id: req.params.id });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    if (donation.status !== 'available') return res.status(400).json({ message: 'Already claimed' });

    await db.updateDonation({ _id: req.params.id }, { $set: { status: 'claimed', claimedBy: req.userId, updatedAt: new Date() } });

    await db.createNotification({
      user: donation.donor?._id || donation.donor,
      type: 'pickup_accepted',
      title: 'Donation Claimed',
      message: `Your ${donation.foodName} donation has been claimed.`,
      data: { donationId: donation._id },
    });

    const updated = await db.findDonationById(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.updateDonation({ _id: req.params.id }, { $set: { status, updatedAt: new Date() } });

    if (status === 'delivered') {
      const donation = await db.findDonation({ _id: req.params.id });
      const donorId = donation.donor?._id || donation.donor;
      const reward = await db.findReward({ user: donorId });
      if (reward) {
        await db.updateReward(
          { user: donorId },
          { $inc: { points: Math.round((donation.quantity || 1) * 10), totalDonations: 1, totalMealsProvided: Math.round((donation.quantity || 1) * 3) }, $set: { lastDonationDate: new Date() } }
        );
      }

      await db.createNotification({
        user: donorId,
        type: 'donation_completed',
        title: 'Donation Completed!',
        message: `Your ${donation.foodName} donation was successfully delivered.`,
        data: { donationId: donation._id },
      });
    }

    const io = req.app.get('io');
    if (io) io.emit('donationUpdate', { donationId: req.params.id, status });

    const updated = await db.findDonationById(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    await db.updateDonation({ _id: req.params.id }, { $set: { status: 'cancelled', updatedAt: new Date() } });
    res.json({ message: 'Donation cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeDonationImage = async (req, res) => {
  try {
    const { image } = req.body;
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const analysis = await analyzeFood(base64Image);
    if (!analysis) {
      return res.status(400).json({ message: 'Could not analyze image' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
