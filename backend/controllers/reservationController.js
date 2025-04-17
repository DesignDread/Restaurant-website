// controllers/reservationController.js
import Reservation from "../models/Reservation.js";

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Public
 const createReservation = async (req, res) => {
  try {
    const { name, email, date, time } = req.body;
    const reservation = new Reservation({ name, email, date, time });
    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Public (or Admin)
 const getReservations = async (req, res) => {
  try {
    const list = await Reservation.find().sort({ date: 1, time: 1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Public (or Admin)
 const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export{updateReservationStatus, createReservation, getReservations}