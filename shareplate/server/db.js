import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import store from './utils/store.js';
import UserModel from './models/User.js';
import DonationModel from './models/Donation.js';
import NGOModel from './models/NGO.js';
import DeliveryModel from './models/Delivery.js';
import RewardModel from './models/Reward.js';
import NotificationModel from './models/Notification.js';
import AnalyticsModel from './models/Analytics.js';

dotenv.config();

let useMemory = false;

export async function initDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shareplate', {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    console.log('✓ MongoDB connected');
    useMemory = false;
  } catch (err) {
    console.log('⚠ MongoDB not available — using in-memory database');
    useMemory = true;
    await store.init();
  }
}

function mem() {
  if (!useMemory) throw new Error('Not in memory mode');
  return store;
}

function mongo() {
  if (useMemory) throw new Error('Not in MongoDB mode');
  const m = {
    User: UserModel,
    Donation: DonationModel,
    NGO: NGOModel,
    Delivery: DeliveryModel,
    Reward: RewardModel,
    Notification: NotificationModel,
    Analytics: AnalyticsModel,
  };
  return m;
}

// ---- Auth ----

export async function registerUser(data) {
  if (useMemory) return mem().createUser(data);
  return mongo().User.create(data);
}

export async function findUserByEmail(email) {
  if (useMemory) return mem().findUser({ email });
  return mongo().User.findOne({ email });
}

export async function findUserById(id) {
  if (useMemory) return mem().findUser({ _id: id });
  return mongo().User.findById(id);
}

export async function findUser(filter) {
  if (useMemory) return mem().findUser(filter);
  return mongo().User.findOne(filter);
}

export async function updateUser(filter, update) {
  if (useMemory) return mem().updateUser(filter, update);
  if (update.$set || update.$inc) {
    const doc = await mongo().User.findOne(filter);
    if (!doc) return null;
    if (update.$set) Object.assign(doc, update.$set);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) doc[k] = (doc[k] || 0) + v;
    }
    doc.updatedAt = new Date();
    return doc.save();
  }
  return mongo().User.findByIdAndUpdate(filter._id || filter, update, { new: true });
}

export async function findUsers(filter = {}, opts = {}) {
  if (useMemory) return mem().findUsers(filter);
  let query = mongo().User.find(filter).sort(opts.sort || { createdAt: -1 });
  if (opts.skip) query = query.skip(opts.skip);
  if (opts.limit) query = query.limit(opts.limit);
  return query;
}

export async function countUsers(filter = {}) {
  if (useMemory) return mem().countUsers(filter);
  return mongo().User.countDocuments(filter);
}

// ---- Donations ----

export async function createDonation(data) {
  if (useMemory) return mem().createDonation(data);
  return mongo().Donation.create(data);
}

export async function findDonations(filter = {}, opts = {}) {
  if (useMemory) return mem().findDonations(filter, opts);
  let query = mongo().Donation.find(filter)
    .populate('donor', 'name phone email photoURL')
    .populate('claimedBy', 'name phone email');
  if (opts.sort) query = query.sort(opts.sort);
  else query = query.sort({ createdAt: -1 });
  if (opts.skip) query = query.skip(opts.skip);
  if (opts.limit) query = query.limit(opts.limit);
  return query;
}

export async function findDonationById(id) {
  if (useMemory) return mem().findDonation({ _id: id });
  return mongo().Donation.findById(id)
    .populate('donor', 'name phone email photoURL')
    .populate('claimedBy', 'name phone email')
    .populate('deliveryPartner', 'name phone');
}

export async function findDonation(filter) {
  if (useMemory) return mem().findDonation(filter);
  return mongo().Donation.findOne(filter);
}

export async function updateDonation(filter, update) {
  if (useMemory) return mem().updateDonation(filter, update);
  if (filter._id) return mongo().Donation.findByIdAndUpdate(filter._id, { ...update, updatedAt: new Date() }, { new: true });
  return mongo().Donation.findOneAndUpdate(filter, { ...update, updatedAt: new Date() }, { new: true });
}

export async function countDonations(filter = {}) {
  if (useMemory) return mem().countDonations(filter);
  return mongo().Donation.countDocuments(filter);
}

// ---- Rewards ----

export async function findReward(filter) {
  if (useMemory) return mem().findReward(filter);
  return mongo().Reward.findOne(filter);
}

export async function createReward(data) {
  if (useMemory) return mem().createReward(data);
  return mongo().Reward.create(data);
}

export async function updateReward(filter, update) {
  if (useMemory) return mem().updateReward(filter, update);
  const doc = await mongo().Reward.findOne(filter);
  if (!doc) return null;
  if (update.$set) Object.assign(doc, update.$set);
  if (update.$inc) {
    for (const [k, v] of Object.entries(update.$inc)) doc[k] = (doc[k] || 0) + v;
  }
  doc.updatedAt = new Date();
  return doc.save();
}

export async function findRewards(filter = {}, opts = {}) {
  if (useMemory) return mem().findRewards(filter, opts);
  let query = mongo().Reward.find(filter).populate('user', 'name photoURL');
  if (opts.sort) query = query.sort(opts.sort);
  else query = query.sort({ points: -1 });
  if (opts.limit) query = query.limit(opts.limit);
  return query;
}

// ---- Notifications ----

export async function createNotification(data) {
  if (useMemory) return mem().createNotification(data);
  return mongo().Notification.create(data);
}

export async function findNotifications(filter = {}, opts = {}) {
  if (useMemory) return mem().findNotifications(filter, opts);
  let query = mongo().Notification.find(filter).sort({ createdAt: -1 });
  if (opts.limit) query = query.limit(opts.limit);
  return query;
}

export async function markNotificationsRead(userId, ids) {
  if (useMemory) return mem().markNotificationsRead(userId, ids);
  const filter = { user: userId };
  if (ids && ids.length > 0) filter._id = { $in: ids };
  return mongo().Notification.updateMany(filter, { isRead: true });
}

export async function countNotifications(filter = {}) {
  if (useMemory) return mem().countNotifications(filter);
  return mongo().Notification.countDocuments(filter);
}

// ---- Analytics ----

export async function getDashboardStats() {
  if (useMemory) return mem().getDbStats();
  const [totalDonations, totalDelivered, foodKg, activeUsers, activeNGOs, todayDonations] = await Promise.all([
    mongo().Donation.countDocuments(),
    mongo().Donation.countDocuments({ status: 'delivered' }),
    mongo().Donation.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$quantity' } } }]),
    mongo().User.countDocuments({ isActive: true }),
    mongo().User.countDocuments({ role: 'ngo', isActive: true }),
    mongo().Donation.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) } }),
  ]);
  const total = foodKg[0]?.total || 0;
  return {
    totalDonations, totalDelivered, totalFoodKg: total, totalMealsServed: Math.round(total * 3),
    activeUsers, activeNGOs, todayDonations, carbonFootprintSaved: Math.round(total * 2.5),
  };
}

export async function getTopDonors() {
  if (useMemory) return mem().getTopDonors();
  return mongo().User.find({ totalDonations: { $gt: 0 } }).sort({ totalDonations: -1 }).limit(10).select('name photoURL totalDonations points');
}

// ---- NGOs ----

export async function findNGOs(filter = {}) {
  if (useMemory) return [];
  return mongo().NGO.find(filter).populate('user', 'name email phone photoURL');
}

export async function createNGO(data) {
  if (useMemory) return { _id: 'mem_ngo_1', ...data };
  return mongo().NGO.create(data);
}

export async function findNGO(filter) {
  if (useMemory) return null;
  return mongo().NGO.findOne(filter).populate('user', 'name email phone photoURL');
}

export async function updateNGO(filter, data) {
  if (useMemory) return { _id: 'mem_ngo_1', ...data };
  return mongo().NGO.findOneAndUpdate(filter, data, { new: true });
}

// ---- Deliveries ----

export async function createDelivery(data) {
  if (useMemory) return { _id: 'mem_del_1', ...data, createdAt: new Date(), updatedAt: new Date() };
  return mongo().Delivery.create(data);
}

export async function findDeliveries(filter = {}) {
  if (useMemory) return [];
  return mongo().Delivery.find(filter)
    .populate('donation', 'foodName quantity unit pickupLocation')
    .populate('donor', 'name phone')
    .populate('ngo', 'name phone')
    .populate('deliveryPartner', 'name phone')
    .sort({ createdAt: -1 });
}

export async function updateDelivery(filter, update) {
  if (useMemory) return null;
  return mongo().Delivery.findOneAndUpdate(filter, { ...update, updatedAt: new Date() }, { new: true });
}
