const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', businessController.getAllBusinesses);
router.get('/top', businessController.getTopRated);
router.get('/search', businessController.searchBusinesses);
router.get('/:id', businessController.getBusinessById);

// Protected routes (require authentication)
router.post('/', auth, businessController.createBusiness);
router.put('/:id', auth, businessController.updateBusiness);
router.delete('/:id', auth, businessController.deleteBusiness);

module.exports = router;
