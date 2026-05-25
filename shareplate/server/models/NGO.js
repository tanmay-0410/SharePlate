import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, trim: true },
  certificateUrl: { type: String },
  description: { type: String, trim: true },
  website: { type: String },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    coordinates: { lat: Number, lng: Number },
  },
  serviceAreas: [{ type: String }],
  capacity: { type: Number, default: 0 },
  currentOccupancy: { type: Number, default: 0 },
  foodTypesAccepted: [{ type: String, enum: ['veg', 'non-veg', 'both'] }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  isVerified: { type: Boolean, default: false },
  verificationDocuments: [{ type: String }],
  totalMealsServed: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ngoSchema.index({ 'address.coordinates': '2dsphere' });

export default mongoose.model('NGO', ngoSchema);
