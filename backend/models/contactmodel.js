import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  subscribe: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contact', ContactSchema);
