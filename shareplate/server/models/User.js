import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, minlength: 6 },
  phone: { type: String, trim: true },
  photoURL: { type: String, default: '' },
  firebaseUid: { type: String },
  role: {
    type: String,
    enum: ['restaurant', 'ngo', 'student', 'home_donor', 'delivery_partner', 'admin'],
    required: true,
    default: 'home_donor',
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    coordinates: { lat: Number, lng: Number },
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  ngoVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalDonations: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  fcmToken: { type: String },
  certificates: {
    fssai: { url: String, uploadedAt: Date },
    fci: { url: String, uploadedAt: Date },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
