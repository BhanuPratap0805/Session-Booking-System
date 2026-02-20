const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        expertId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expert',
            required: [true, 'Expert ID is required'],
            index: true,
        },
        expertName: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            index: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Time slot is required'],
        },
        notes: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to help with queries
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
