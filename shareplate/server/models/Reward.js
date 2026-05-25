import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  badges: [
    {
      name: String,
      icon: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
    },
  ],
  level: { type: Number, default: 1 },
  totalDonations: { type: Number, default: 0 },
  totalMealsProvided: { type: Number, default: 0 },
  streakDays: { type: Number, default: 0 },
  lastDonationDate: { type: Date },
  rank: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Reward', rewardSchema);
