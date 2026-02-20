const express = require('express');
const router = express.Router();
const {
    getExperts,
    getExpertById,
    getCategories,
} = require('../controllers/expertController');

// GET /api/experts/categories/list
router.get('/categories/list', getCategories);

// GET /api/experts
router.get('/', getExperts);

// GET /api/experts/:id
router.get('/:id', getExpertById);

module.exports = router;
