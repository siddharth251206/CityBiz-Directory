const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { auth, isAdmin, isOwner } = require('../middleware/auth');
// Public routes
router.get('/', businessController.getAllBusinesses);
router.get('/top', businessController.getTopRated);
router.get('/search', businessController.searchBusinesses);
router.get('/mybusinesses', auth, businessController.getMyBusinesses);
router.get('/pending', auth, isAdmin, businessController.getPendingBusinesses);
router.get('/:id', businessController.getBusinessById);

// Protected routes (require authentication)
router.post('/', auth, isOwner, businessController.createBusiness);
router.put('/:id', auth, businessController.updateBusiness);
router.delete('/:id', auth, businessController.deleteBusiness);
router.get('/edit-data/:id', auth, businessController.getBusinessDataForEdit);

module.exports = router;
