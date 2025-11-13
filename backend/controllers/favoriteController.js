// controllers/favoriteController.js
const Favorite = require('../models/favoriteModel');

/**
 * Controller for Favorite operations
 * PostgreSQL-safe + consistent return structures
 */

// Add to favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const userId = req.user?.user_id; // From auth middleware
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const { business_id } = req.body;
    if (!business_id) {
      return res.status(400).json({ message: 'business_id is required' });
    }

    const favorite = await Favorite.addFavorite(userId, business_id);
    return res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

// Remove favorite
exports.removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const businessId = parseInt(req.params.id, 10);
    if (Number.isNaN(businessId)) {
      return res.status(400).json({ message: 'Invalid business id' });
    }

    const removed = await Favorite.removeFavorite(userId, businessId);
    return res.json(removed);
  } catch (error) {
    next(error);
  }
};

// Get all favorites of logged-in user
exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const favorites = await Favorite.getFavoritesByUser(userId);
    return res.json(favorites);
  } catch (error) {
    next(error);
  }
};
