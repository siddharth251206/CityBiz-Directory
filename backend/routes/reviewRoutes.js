const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth'); // Import auth middleware

// GET /api/reviews/business/:businessId
// Gets all reviews for a specific business
router.get('/business/:businessId', reviewController.getReviewsByBusiness);

// POST /api/reviews
// Creates a new review (requires user to be logged in)
router.post('/', auth, reviewController.createReview);

// DELETE /api/reviews/:reviewId
// Deletes a review (requires user to be logged in and be the owner)
router.delete('/:reviewId', auth, reviewController.deleteReview);

module.exports = router;