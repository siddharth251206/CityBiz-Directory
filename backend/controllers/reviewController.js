const Review = require('../models/reviewModel');

// Create review
exports.createReview = async (req, res, next) => {
  try {
    // Get user_id from the authenticated user
    const user_id = req.user.id;
    // Get review data from the form body
    const { business_id, rating, comment } = req.body;

    const reviewData = { user_id, business_id, rating, comment };
    
    const review = await Review.create(reviewData);
    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    next(error);
  }
};

// Get reviews by business ID
exports.getReviewsByBusiness = async (req, res, next) => {
  try {
    const reviews = await Review.getByBusinessId(req.params.businessId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// Delete review (SECURED)
exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId; // Use reviewId from route
    const review = await Review.getById(reviewId); // (You'll need to add getById to reviewModel)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // SECURITY CHECK: Ensure user owns this review
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this review' });
    }

    await Review.delete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};
// Get all reviews for the logged-in user
exports.getUserReviews = async (req, res, next) => {
  try {
    // req.user.id comes from the 'auth' middleware
    const reviews = await Review.getByUserId(req.user.id);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};