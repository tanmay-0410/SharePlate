import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    address: String,
    lat: Number,
    lng: Number,
  },
  dropLocation: {
    address: String,
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled'],
    default: 'pending',
  },
  estimatedDistance: { type: Number },
  estimatedDuration: { type: Number },
  actualDistance: { type: Number },
  pickupTime: { type: Date },
  dropTime: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Delivery', deliverySchema);
