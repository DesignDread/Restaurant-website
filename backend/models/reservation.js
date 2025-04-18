import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  date:     { type: Date,   required: true },
  time:     { type: String, required: true },
  status:   { type: String, default: 'pending', enum: ['pending','approved','rejected'] }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
