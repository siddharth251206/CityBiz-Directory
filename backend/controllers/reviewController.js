// controllers/reviewController.js
const Review = require('../models/reviewModel');

/**
 * Handles all review endpoints.
 * PostgreSQL + Supabase compatible.
 */

// Add Review
exports.addReview = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const { business_id, rating, comment } = req.body;

    if (!business_id || !rating) {
      return res.status(400).json({ message: 'business_id and rating required' });
    }

    const review = await Review.addReview(userId, business_id, rating, comment);
    return res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// Update Review
exports.updateReview = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const reviewId = parseInt(req.params.id, 10);
    if (Number.isNaN(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const { rating, comment } = req.body;

    const updated = await Review.updateReview(reviewId, userId, rating, comment);
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete Review
exports.deleteReview = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const reviewId = parseInt(req.params.id, 10);
    if (Number.isNaN(reviewId)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const deleted = await Review.deleteReview(reviewId, userId);
    return res.json(deleted);
  } catch (error) {
    next(error);
  }
};

// Get all reviews for a business
exports.getReviewsByBusiness = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id, 10);
    if (Number.isNaN(businessId)) {
      return res.status(400).json({ message: 'Invalid business id' });
    }

    const reviews = await Review.getAllByBusinessId(businessId);
    return res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Get all reviews by a user
exports.getReviewsByUser = async (req, res, next) => {
  try {
    // const userId = parseInt(req.params.id, 10);
    // if (Number.isNaN(userId)) {
    //   return res.status(400).json({ message: 'Invalid user id' });
    // }

    const reviews = await Review.getByUserId(req.user.user_id);
    return res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.getAllByBusinessId = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    const reviews = await Review.getAllByBusinessId(businessId);
    return res.json(reviews);
  } catch (err) {
    next(err);
  }
};
