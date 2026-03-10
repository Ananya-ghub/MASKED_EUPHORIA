import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  person1Name: { type: String, required: true },
  person1RegNo: { type: String, required: true },
  person2Name: { type: String, required: true },
  person2RegNo: { type: String, required: true },
  compatibilityScore: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model('Match', MatchSchema);
