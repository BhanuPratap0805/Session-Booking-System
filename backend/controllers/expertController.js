const Expert = require('../models/Expert');

// GET /api/experts — paginated, searchable, filterable
const getExperts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 6,
            search = '',
            category = '',
        } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

        // Build filter
        const filter = {};

        if (search.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        if (category.trim()) {
            filter.category = category.trim();
        }

        const total = await Expert.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        const experts = await Expert.find(filter)
            .select('name category experience rating bio avatar specializations availableSlots')
            .sort({ rating: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        // Compute available slots count server-side to avoid sending huge slot arrays
        const expertsWithCount = experts.map(({ availableSlots, ...rest }) => ({
            ...rest,
            availableSlotsCount: (availableSlots || []).filter(s => !s.isBooked).length,
        }));

        res.json({
            success: true,
            data: expertsWithCount,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalExperts: total,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching experts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch experts',
            error: error.message,
        });
    }
};

// GET /api/experts/:id — single expert with all slots
const getExpertById = async (req, res) => {
    try {
        const { id } = req.params;

        const expert = await Expert.findById(id).lean();

        if (!expert) {
            return res.status(404).json({
                success: false,
                message: 'Expert not found',
            });
        }

        res.json({
            success: true,
            data: expert,
        });
    } catch (error) {
        console.error('Error fetching expert:', error);

        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid expert ID format',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch expert',
            error: error.message,
        });
    }
};

// GET /api/experts/categories/list — get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Expert.distinct('category');
        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
        });
    }
};

module.exports = { getExperts, getExpertById, getCategories };
