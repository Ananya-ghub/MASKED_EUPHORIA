import mongoose from 'mongoose';

const CoupleSchema = new mongoose.Schema({
  name1: { type: String, required: true },
  regno1: { type: String, required: true },
  email1: { type: String, required: true },
  phone1: { type: String, required: true },
  name2: { type: String, required: true },
  regno2: { type: String, required: true },
  email2: { type: String, required: true },
  phone2: { type: String, required: true },
  kingQueenParticipation: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Couple || mongoose.model('Couple', CoupleSchema);
