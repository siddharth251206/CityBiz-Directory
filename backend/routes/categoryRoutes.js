const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories
// Gets all categories (e.g., for the "Add Business" dropdown)
router.get('/', categoryController.getAllCategories);

// POST /api/categories
// (Optional: For an admin to create a new category)
// router.post('/', auth, categoryController.createCategory);

module.exports = router;