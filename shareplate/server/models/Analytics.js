import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalDonations: { type: Number, default: 0 },
  totalFoodKg: { type: Number, default: 0 },
  totalMealsServed: { type: Number, default: 0 },
  activeNGOs: { type: Number, default: 0 },
  activeDonors: { type: Number, default: 0 },
  deliveryPartners: { type: Number, default: 0 },
  carbonFootprintSaved: { type: Number, default: 0 },
  topDonors: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, count: Number }],
  topNGOs: [{ ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, count: Number }],
  donationsByType: { veg: Number, nonVeg: Number },
  donationsByStatus: {
    available: Number,
    claimed: Number,
    delivered: Number,
    expired: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Analytics', analyticsSchema);
