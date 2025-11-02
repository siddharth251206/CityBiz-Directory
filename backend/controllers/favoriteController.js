const Favorite = require('../models/favoriteModel');

// Get all favorites for the logged-in user
exports.getUserFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.getByUserId(req.user.id);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

// Add a new favorite
exports.addFavorite = async (req, res, next) => {
  try {
    const favoriteData = {
      user_id: req.user.id,
      business_id: req.body.business_id 
    };
    const favorite = await Favorite.create(favoriteData);
    res.status(201).json({ message: 'Favorite added', favorite });
  } catch (error) {
    next(error);
  }
};

// Remove a favorite
exports.removeFavorite = async (req, res, next) => {
  try {
    const favoriteId = req.params.favoriteId;
    // (You should add a security check here to ensure req.user.id owns this favorite)
    await Favorite.delete(favoriteId);
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    next(error);
  }
};