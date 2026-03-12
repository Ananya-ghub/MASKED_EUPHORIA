import mongoose from 'mongoose';

const SingleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regno: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  wantsPair: { type: Boolean, default: false },
  
  // New Matching Enhancements
  gender: { type: String },
  preferredMatch: { type: String },

  // Event Attendance Check-In
  checkedIn: { type: Boolean, default: false },

  // Questionnaire fields (only populated if wantsPair is true)
  promVibe: { type: String },
  personalityType: { type: String },
  energyLevel: { type: String },
  musicPreference: { type: String },
  conversationStyle: { type: String },
  photoPreference: { type: String },
  danceComfort: { type: String },
  humorStyle: { type: String },
  partnerExpectation: { type: String },
  interactionStyle: { type: String },
  height: { type: String },
  dealBreaker: { type: String },
}, { timestamps: true });

export default mongoose.models.Single || mongoose.model('Single', SingleSchema);
