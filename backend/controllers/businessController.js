const Business = require('../models/businessModel');

// Get all businesses
exports.getAllBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.getAll();
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Get business by ID
exports.getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.getById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    next(error);
  }
};

// Get top rated businesses
exports.getTopRated = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const businesses = await Business.getTopRated(limit);
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Search businesses
exports.searchBusinesses = async (req, res, next) => {
  try {
    // Updated to use categoryId
    const { name, categoryId, minRating, maxRating } = req.query;
    
    let businesses;
    
    if (categoryId) {
      businesses = await Business.getByCategoryId(categoryId);
    } else if (name) {
      businesses = await Business.searchByName(name);
    } else if (minRating && maxRating) {
      businesses = await Business.filterByRating(parseFloat(minRating), parseFloat(maxRating));
    } else {
      businesses = await Business.getAll();
    }
    
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};
//create Business
exports.createBusiness = async (req, res, next) => {
  try {
    // 1. Get owner_id from the auth middleware
    const owner_id = req.user.id; 

    // 2. Combine it with the form data from req.body
    const businessData = { ...req.body, owner_id };
    
    // 3. Call the updated model function
    const business = await Business.create(businessData);
    res.status(201).json(business);
  } catch (error) {
    next(error);
  }
};

// Update business
exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.getById(req.params.id);
    
    // SECURITY CHECK: Ensure user is the owner
    if (business.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this business' });
    }

    const updatedBusiness = await Business.update(req.params.id, req.body);
    res.json(updatedBusiness);
  } catch (error) {
    next(error);
  }
};
// Delete business
exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.getById(req.params.id);

    // SECURITY CHECK: Ensure user is the owner
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    if (business.owner_id !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this business' });
    }

    await Business.delete(req.params.id);
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    next(error);
  }
};