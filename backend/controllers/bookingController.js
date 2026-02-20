const { validationResult, body } = require('express-validator');
const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// Validation rules for creating a booking
const bookingValidation = [
    body('expertId').notEmpty().withMessage('Expert ID is required'),
    body('userName').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[0-9+\-\s()]{7,15}$/)
        .withMessage('Invalid phone number format'),
    body('date').notEmpty().withMessage('Date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('notes').optional().trim(),
];

// POST /api/bookings — create a new booking (with atomic double-booking prevention)
const createBooking = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
            });
        }

        const { expertId, userName, email, phone, date, timeSlot, notes } = req.body;

        // Atomic update: only updates if the slot exists AND is not yet booked
        // This prevents race conditions / double booking
        const updatedExpert = await Expert.findOneAndUpdate(
            {
                _id: expertId,
                availableSlots: {
                    $elemMatch: { date, time: timeSlot, isBooked: false },
                },
            },
            {
                $set: { 'availableSlots.$.isBooked': true },
            },
            { new: true }
        );

        if (!updatedExpert) {
            // Either expert doesn't exist or slot is already booked
            const expertExists = await Expert.findById(expertId);
            if (!expertExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Expert not found',
                });
            }
            return res.status(409).json({
                success: false,
                message: 'This time slot is no longer available. It may have been booked by someone else.',
            });
        }

        // Create the booking record
        const booking = await Booking.create({
            expertId,
            expertName: updatedExpert.name,
            userName,
            email: email.toLowerCase(),
            phone,
            date,
            timeSlot,
            notes: notes || '',
            status: 'pending',
        });

        // Emit real-time event to all clients viewing this expert
        const io = req.app.get('io');
        io.to(`expert_${expertId}`).emit('slotBooked', {
            expertId,
            date,
            timeSlot,
            booking: {
                id: booking._id,
                userName: booking.userName,
                date: booking.date,
                timeSlot: booking.timeSlot,
                status: booking.status,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully!',
            data: booking,
        });
    } catch (error) {
        console.error('Error creating booking:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid expert ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message,
        });
    }
};

// PATCH /api/bookings/:id/status — update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'confirmed', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: pending, confirmed, completed',
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        res.json({
            success: true,
            message: `Booking status updated to ${status}`,
            data: booking,
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message,
        });
    }
};

// GET /api/bookings?email= — get bookings by email
const getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Email query parameter is required',
            });
        }

        const bookings = await Booking.find({ email: email.toLowerCase().trim() })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: bookings,
            total: bookings.length,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message,
        });
    }
};

module.exports = {
    bookingValidation,
    createBooking,
    updateBookingStatus,
    getBookingsByEmail,
};
