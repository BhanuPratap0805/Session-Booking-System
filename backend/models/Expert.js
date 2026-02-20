const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
});

const expertSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Expert name is required'],
            trim: true,
            index: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Technology', 'Business', 'Health', 'Design', 'Education'],
            index: true,
        },
        experience: {
            type: Number,
            required: [true, 'Experience is required'],
            min: 0,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
            default: 0,
        },
        bio: {
            type: String,
            trim: true,
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        specializations: {
            type: [String],
            default: [],
        },
        availableSlots: [slotSchema],
    },
    {
        timestamps: true,
    }
);

// Text index for search
expertSchema.index({ name: 'text' });

module.exports = mongoose.model('Expert', expertSchema);
