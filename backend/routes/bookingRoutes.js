const express = require('express');
const router = express.Router();
const {
    bookingValidation,
    createBooking,
    updateBookingStatus,
    getBookingsByEmail,
} = require('../controllers/bookingController');

// GET /api/bookings?email=
router.get('/', getBookingsByEmail);

// POST /api/bookings
router.post('/', bookingValidation, createBooking);

// PATCH /api/bookings/:id/status
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
