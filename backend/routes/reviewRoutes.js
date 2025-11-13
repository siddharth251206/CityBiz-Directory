const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth'); // Import auth middleware
// GET /api/reviews/my-reviews
// Gets all reviews for the currently logged-in user
router.get('/my-reviews', auth, reviewController.getReviewsByUser);
// GET /api/reviews/business/:businessId
// Gets all reviews for a specific business
router.get('/business/:businessId', reviewController.getReviewsByBusiness);

// POST /api/reviews
// Creates a new review (requires user to be logged in)
router.post('/', auth, reviewController.addReview);

// DELETE /api/reviews/:reviewId
// Deletes a review (requires user to be logged in and be the owner)
router.delete('/:reviewId', auth, reviewController.deleteReview);
router.get('/:businessId', reviewController.getAllByBusinessId);

module.exports = router;