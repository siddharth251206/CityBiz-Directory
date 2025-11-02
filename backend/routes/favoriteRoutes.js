const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth'); // Import auth middleware

// All favorite routes should be protected

// GET /api/favorites
// Gets all favorites for the currently logged-in user
router.get('/', auth, favoriteController.getUserFavorites);

// POST /api/favorites
// Adds a business to the user's favorites
router.post('/', auth, favoriteController.addFavorite);

// DELETE /api/favorites/:favoriteId
// Removes a business from the user's favorites
router.delete('/:favoriteId', auth, favoriteController.removeFavorite);

module.exports = router;