import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const DB = {
  users: [],
  donations: [],
  ngos: [],
  deliveries: [],
  rewards: [],
  notifications: [],
  analytics: [],
};

function id() {
  return uuidv4().replace(/-/g, '').slice(0, 24);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function match(doc, filter) {
  if (!filter || !Object.keys(filter).length) return true;
  return Object.entries(filter).every(([key, val]) => {
    if (key === '$or') return val.some((c) => match(doc, c));
    if (key === '$and') return val.every((c) => match(doc, c));
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      if (val.$ne !== undefined) return doc[key] !== val.$ne;
      if (val.$gt !== undefined) return doc[key] > val.$gt;
      if (val.$gte !== undefined) return doc[key] >= val.$gte;
      if (val.$lt !== undefined) return doc[key] < val.$lt;
      if (val.$lte !== undefined) return doc[key] <= val.$lte;
      if (val.$in) return val.$in.some((v) => v?.toString() === doc[key]?.toString());
      if (val.$regex) return new RegExp(val.$regex, val.$options || '').test(doc[key]);
      if (val.$exists !== undefined) return val.$exists ? key in doc : !(key in doc);
      if (val.$near) {
        if (!doc.address?.coordinates) return false;
        const dist = haversine(doc.address.coordinates.lat, doc.address.coordinates.lng, val.$near.$geometry.coordinates[1], val.$near.$geometry.coordinates[0]);
        if (val.$near.$maxDistance && dist * 1000 > val.$near.$maxDistance) return false;
        return true;
      }
    }
    return doc[key]?.toString() === val?.toString();
  });
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function resolveRefs(arr, refField, refCol) {
  return arr.map((doc) => {
    const d = clone(doc);
    if (d[refField] && typeof d[refField] === 'string') {
      d[refField] = DB[refCol]?.find((r) => r._id === d[refField]) || d[refField];
    }
    return d;
  });
}

function makeUserDoc(data) {
  return {
    _id: data._id || id(),
    name: data.name || '',
    email: data.email || '',
    password: data.password || undefined,
    phone: data.phone || '',
    photoURL: data.photoURL || '',
    firebaseUid: data.firebaseUid || '',
    role: data.role || 'home_donor',
    address: data.address || {},
    isVerified: data.isVerified ?? false,
    isActive: data.isActive ?? true,
    ngoVerified: data.ngoVerified ?? false,
    rating: data.rating || 0,
    totalDonations: data.totalDonations || 0,
    points: data.points || 0,
    badges: data.badges || [],
    fcmToken: data.fcmToken || '',
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  };
}

export const store = {
  async init() {
    if (DB.users.length > 0) return;
    const hashedPw = await bcrypt.hash('demo123', 12);
    const demoUsers = [
      { _id: id(), name: 'Priya Sharma', email: 'priya@demo.com', password: hashedPw, role: 'restaurant', phone: '+91-9876543210', isVerified: true, address: { street: 'Connaught Place', city: 'New Delhi', state: 'DL', coordinates: { lat: 28.6139, lng: 77.209 } } },
      { _id: id(), name: 'Rahul Verma', email: 'rahul@demo.com', password: hashedPw, role: 'ngo', phone: '+91-9876543211', isVerified: true, ngoVerified: true, address: { street: 'Lajpat Nagar', city: 'New Delhi', state: 'DL', coordinates: { lat: 28.565, lng: 77.24 } } },
      { _id: id(), name: 'Admin User', email: 'admin@demo.com', password: hashedPw, role: 'admin', isVerified: true },
      { _id: id(), name: 'Ananya Patel', email: 'ananya@demo.com', password: hashedPw, role: 'student', phone: '+91-9876543212' },
      { _id: id(), name: 'Vikram Singh', email: 'vikram@demo.com', password: hashedPw, role: 'delivery_partner', phone: '+91-9876543213' },
      { _id: id(), name: 'Sita Devi', email: 'sita@demo.com', password: hashedPw, role: 'home_donor', phone: '+91-9876543214' },
    ];
    DB.users.push(...demoUsers.map(makeUserDoc));

    DB.donations.push(
      { _id: id(), donor: demoUsers[0]._id, foodName: 'Vegetable Biryani', description: 'Freshly cooked vegetable biryani, enough for 10 people', quantity: 5, unit: 'kg', foodType: 'veg', category: 'cooked', images: [], expiryTime: new Date(Date.now() + 6*3600000), freshnessHours: 6, spoilageRisk: 'low', isSafe: true, pickupLocation: { address: 'Connaught Place, New Delhi', lat: 28.6139, lng: 77.209 }, status: 'available', priorityScore: 85, createdAt: new Date(), updatedAt: new Date() },
      { _id: id(), donor: demoUsers[0]._id, foodName: 'Butter Chicken', description: 'Bone butter chicken with naan bread, 8 servings', quantity: 3, unit: 'kg', foodType: 'non-veg', category: 'cooked', images: [], expiryTime: new Date(Date.now() + 4*3600000), freshnessHours: 4, spoilageRisk: 'low', isSafe: true, pickupLocation: { address: 'Connaught Place, New Delhi', lat: 28.6139, lng: 77.209 }, status: 'available', priorityScore: 72, createdAt: new Date(), updatedAt: new Date() },
      { _id: id(), donor: demoUsers[5]._id, foodName: 'Fresh Fruits Basket', description: 'Assorted fresh fruits - apples, bananas, oranges', quantity: 2, unit: 'kg', foodType: 'veg', category: 'raw', images: [], expiryTime: new Date(Date.now() + 24*3600000), freshnessHours: 24, spoilageRisk: 'low', isSafe: true, pickupLocation: { address: 'Dwarka, New Delhi', lat: 28.592, lng: 77.046 }, status: 'available', priorityScore: 90, createdAt: new Date(), updatedAt: new Date() },
      { _id: id(), donor: demoUsers[5]._id, foodName: 'Leftover Dal Rice', description: 'Home-cooked dal and rice, 4 servings', quantity: 1.5, unit: 'kg', foodType: 'veg', category: 'cooked', images: [], expiryTime: new Date(Date.now() + 3*3600000), freshnessHours: 3, spoilageRisk: 'medium', isSafe: true, pickupLocation: { address: 'Dwarka, New Delhi', lat: 28.592, lng: 77.046 }, status: 'available', priorityScore: 65, createdAt: new Date(), updatedAt: new Date() },
    );

    DB.rewards.push(
      { user: demoUsers[0]._id, points: 450, badges: [{ name: 'First Donation', icon: '🌟', description: 'First donation', earnedAt: new Date() }, { name: 'Helping Hand', icon: '🤝', description: '5 donations', earnedAt: new Date() }], level: 3, totalDonations: 8, totalMealsProvided: 45, streakDays: 4, lastDonationDate: new Date(), rank: 1 },
      { user: demoUsers[5]._id, points: 200, badges: [{ name: 'First Donation', icon: '🌟', description: 'First donation', earnedAt: new Date() }], level: 2, totalDonations: 3, totalMealsProvided: 12, streakDays: 1, lastDonationDate: new Date(), rank: 2 },
    );

    console.log('In-memory DB seeded with demo data');
  },

  getDbStats() {
    return {
      totalDonations: DB.donations.filter(d => d.status !== 'cancelled').length,
      totalDelivered: DB.donations.filter(d => d.status === 'delivered').length,
      totalFoodKg: DB.donations.filter(d => d.status !== 'cancelled').reduce((s, d) => s + d.quantity, 0),
      totalMealsServed: DB.donations.filter(d => d.status === 'delivered' || d.status === 'available').reduce((s, d) => s + Math.round(d.quantity * 3), 0),
      activeUsers: DB.users.filter(u => u.isActive).length,
      activeNGOs: DB.users.filter(u => u.role === 'ngo' && u.isActive).length,
      todayDonations: DB.donations.filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString()).length,
      carbonFootprintSaved: Math.round(DB.donations.filter(d => d.status !== 'cancelled').reduce((s, d) => s + d.quantity, 0) * 2.5),
    };
  },

  getTopDonors() {
    return DB.users.filter(u => u.totalDonations > 0).sort((a, b) => b.totalDonations - a.totalDonations).slice(0, 10).map(u => ({ _id: u._id, name: u.name, photoURL: u.photoURL, totalDonations: u.totalDonations, points: u.points }));
  },

  // User operations
  async createUser(data) {
    const doc = makeUserDoc(data);
    if (data.password) doc.password = await bcrypt.hash(data.password, 12);
    DB.users.push(doc);
    return clone(doc);
  },

  async findUser(filter) {
    const doc = DB.users.find((u) => match(u, filter));
    return doc ? makeUserDoc(doc) : null;
  },

  async findUsers(filter = {}) {
    return DB.users.filter((u) => match(u, filter)).map(makeUserDoc);
  },

  async updateUser(filter, update) {
    const idx = DB.users.findIndex((u) => match(u, filter));
    if (idx < 0) return null;
    if (update.$set) Object.assign(DB.users[idx], update.$set);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) DB.users[idx][k] = (DB.users[idx][k] || 0) + v;
    }
    DB.users[idx].updatedAt = new Date();
    return clone(DB.users[idx]);
  },

  async countUsers(filter = {}) {
    return DB.users.filter((u) => match(u, filter)).length;
  },

  // Donation operations
  async createDonation(data) {
    const doc = { _id: id(), ...data, createdAt: new Date(), updatedAt: new Date() };
    DB.donations.push(doc);
    return clone(doc);
  },

  async findDonations(filter = {}, opts = {}) {
    let results = DB.donations.filter((d) => match(d, filter));
    if (opts.sort) {
      const [key, order] = Object.entries(opts.sort)[0];
      results.sort((a, b) => ((a[key] || 0) > (b[key] || 0) ? 1 : -1) * order);
    }
    if (opts.skip) results = results.slice(opts.skip);
    if (opts.limit) results = results.slice(0, opts.limit);
    results = resolveRefs(results, 'donor', 'users');
    results = resolveRefs(results, 'claimedBy', 'users');
    results = resolveRefs(results, 'deliveryPartner', 'users');
    return results;
  },

  async findDonation(filter) {
    const doc = DB.donations.find((d) => match(d, filter));
    if (!doc) return null;
    let result = clone(doc);
    result.donor = DB.users.find((u) => u._id === result.donor) || result.donor;
    result.claimedBy = DB.users.find((u) => u._id === result.claimedBy) || result.claimedBy;
    result.deliveryPartner = DB.users.find((u) => u._id === result.deliveryPartner) || result.deliveryPartner;
    return result;
  },

  async updateDonation(filter, update) {
    const idx = DB.donations.findIndex((d) => match(d, filter));
    if (idx < 0) return null;
    if (update.$set) Object.assign(DB.donations[idx], update.$set);
    DB.donations[idx].updatedAt = new Date();
    return clone(DB.donations[idx]);
  },

  async countDonations(filter = {}) {
    return DB.donations.filter((d) => match(d, filter)).length;
  },

  // Reward operations
  async findReward(filter) {
    const doc = DB.rewards.find((r) => match(r, filter));
    return doc ? clone(doc) : null;
  },

  async createReward(data) {
    const doc = { _id: id(), ...data, createdAt: new Date(), updatedAt: new Date() };
    DB.rewards.push(doc);
    return clone(doc);
  },

  async updateReward(filter, update) {
    const idx = DB.rewards.findIndex((r) => match(r, filter));
    if (idx < 0) return null;
    if (update.$set) Object.assign(DB.rewards[idx], update.$set);
    if (update.$inc) {
      for (const [k, v] of Object.entries(update.$inc)) DB.rewards[idx][k] = (DB.rewards[idx][k] || 0) + v;
    }
    DB.rewards[idx].updatedAt = new Date();
    return clone(DB.rewards[idx]);
  },

  async findRewards(filter = {}, opts = {}) {
    let results = DB.rewards.filter((r) => match(r, filter));
    if (opts.sort) {
      const [key, order] = Object.entries(opts.sort)[0];
      results.sort((a, b) => ((a[key] || 0) > (b[key] || 0) ? 1 : -1) * order);
    }
    if (opts.limit) results = results.slice(0, opts.limit);
    results = resolveRefs(results, 'user', 'users');
    return results;
  },

  // Notification operations
  async createNotification(data) {
    const doc = { _id: id(), ...data, isRead: false, createdAt: new Date() };
    DB.notifications.push(doc);
    if (DB.notifications.length > 100) DB.notifications = DB.notifications.slice(-100);
    return clone(doc);
  },

  async findNotifications(filter = {}, opts = {}) {
    let results = DB.notifications.filter((n) => match(n, filter)).sort((a, b) => b.createdAt - a.createdAt);
    if (opts.limit) results = results.slice(0, opts.limit);
    return results;
  },

  async markNotificationsRead(userId, ids) {
    DB.notifications.forEach((n) => {
      if (n.user === userId && (!ids || ids.includes(n._id))) n.isRead = true;
    });
  },

  async countNotifications(filter = {}) {
    return DB.notifications.filter((n) => match(n, filter)).length;
  },
};

export default store;
