import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0.1 },
  unit: { type: String, enum: ['kg', 'g', 'liters', 'pieces', 'servings'], default: 'kg' },
  foodType: { type: String, enum: ['veg', 'non-veg', 'both'], required: true },
  category: { type: String, enum: ['cooked', 'raw', 'packaged', 'beverage', 'other'], default: 'cooked' },
  images: [{ type: String }],
  expiryTime: { type: Date, required: true },
  freshnessHours: { type: Number, default: 0 },
  spoilageRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  isSafe: { type: Boolean, default: true },
  pickupLocation: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'picked_up', 'delivered', 'expired', 'cancelled'],
    default: 'available',
  },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiAnalysis: {
    foodName: String,
    freshnessHours: Number,
    isSafe: Boolean,
    spoilageRisk: String,
  },
  priorityScore: { type: Number, default: 0, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

donationSchema.index({ 'pickupLocation': '2dsphere' });
donationSchema.index({ status: 1, expiryTime: 1 });
donationSchema.index({ donor: 1, createdAt: -1 });

export default mongoose.model('Donation', donationSchema);
