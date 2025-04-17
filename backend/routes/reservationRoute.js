// routes/reservationRoute.js
import express from 'express';
import { createReservation } from '../controllers/reservationController.js';
import { getReservations } from '../controllers/reservationController.js';
import { updateReservationStatus } from '../controllers/reservationController.js';

const router = express.Router();

// POST   /api/reservations       → createReservation
router.post('/', createReservation);

// GET    /api/reservations       → getReservations
router.get('/', getReservations);

// PUT    /api/reservations/:id   → updateReservationStatus
router.put('/:id', updateReservationStatus);

export default router;
