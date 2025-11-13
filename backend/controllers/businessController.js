// controllers/businessController.js
const Business = require('../models/businessModel');

/**
 * Controller: Business-related endpoints
 * - Assumes models return plain JS objects / arrays (result.rows / rows[0])
 * - Assumes req.user.id is set by auth middleware
 * - Uses consistent HTTP status codes and defensive checks
 */

// Get all businesses
exports.getAllBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.getAll();
    return res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Get business by ID
exports.getBusinessById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid business id' });

    const business = await Business.getById(id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    return res.json(business);
  } catch (error) {
    next(error);
  }
};

// Get top rated businesses
exports.getTopRated = async (req, res, next) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 4);
    const businesses = await Business.getTopRated(limit);
    return res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Search businesses (name / category / rating range)
exports.searchBusinesses = async (req, res, next) => {
  try {
    const { name, categoryId, minRating, maxRating } = req.query;

    let businesses;

    if (categoryId) {
      const catId = parseInt(categoryId, 10);
      if (Number.isNaN(catId)) return res.status(400).json({ message: 'Invalid category id' });
      businesses = await Business.getByCategoryId(catId);
    } else if (name) {
      businesses = await Business.searchByName(String(name));
    } else if (minRating !== undefined && maxRating !== undefined) {
      const minR = parseFloat(minRating);
      const maxR = parseFloat(maxRating);
      if (Number.isNaN(minR) || Number.isNaN(maxR)) return res.status(400).json({ message: 'Invalid rating range' });
      businesses = await Business.filterByRating(minR, maxR);
    } else {
      businesses = await Business.getAll();
    }

    return res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Create Business
exports.createBusiness = async (req, res, next) => {
  try {
    // owner_id from auth middleware
    const owner_id = req.user && (req.user.id || req.user.user_id);
    if (!owner_id) return res.status(401).json({ message: 'Authentication required' });

    const businessData = { ...req.body, owner_id };

    // If file was uploaded (multer/cloudinary middleware) attach URL/path
    if (req.file) {
      // Common fields: req.file.path OR req.file.location depending on upload middleware
      businessData.image = req.file.path || req.file.location || req.file.url || businessData.image;
    }

    const business = await Business.create(businessData);
    return res.status(201).json(business);
  } catch (error) {
    next(error);
  }
};

// Update business
exports.updateBusiness = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id, 10);
    if (Number.isNaN(businessId)) return res.status(400).json({ message: 'Invalid business id' });

    const business = await Business.getById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // Authorization: owner or admin
    const userId = req.user && (req.user.id || req.user.user_id);
    const userRole = req.user && req.user.role;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    if (business.owner_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this business' });
    }

    // Merge update payload
    const newData = { ...req.body };
    if (req.file) {
      newData.image = req.file.path || req.file.location || req.file.url || newData.image;
    }

    // Approval logic: owners changing critical fields should set status -> pending
    if (userRole === 'owner') {
      const nameChanged = newData.name && newData.name !== business.name;
      const descChanged = newData.description && newData.description !== business.description;
      const categoryChanged = newData.category_id && String(newData.category_id) !== String(business.category_id);

      if (nameChanged || descChanged || categoryChanged) {
        newData.status = 'pending';
      } else {
        // preserve existing status if owner doesn't change critical fields
        newData.status = business.status;
      }
    } else if (userRole === 'admin') {
      newData.status = newData.status || business.status;
    }

    const updatedBusiness = await Business.update(businessId, newData);
    return res.json(updatedBusiness);
  } catch (error) {
    next(error);
  }
};

// Delete business
exports.deleteBusiness = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid business id' });

    const business = await Business.getById(id);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const userId = req.user && (req.user.id || req.user.user_id);
    const userRole = req.user && req.user.role;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    if (business.owner_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this business' });
    }

    await Business.delete(id);
    return res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get all businesses for the logged-in owner
exports.getMyBusinesses = async (req, res, next) => {
  try {
    const ownerId = req.user && (req.user.id || req.user.user_id);
    if (!ownerId) return res.status(401).json({ message: 'Authentication required' });

    const businesses = await Business.findByOwner(ownerId);
    return res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Fetch data for the edit form if the user is the owner
exports.getBusinessDataForEdit = async (req, res, next) => {
  try {
    const businessId = parseInt(req.params.id, 10);
    if (Number.isNaN(businessId)) return res.status(400).json({ message: 'Invalid business id' });

    const business = await Business.getById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const userId = req.user && (req.user.id || req.user.user_id);
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    if (business.owner_id !== userId) {
      return res.status(403).json({ message: 'Access Denied: You do not own this business.' });
    }

    return res.json(business);
  } catch (error) {
    next(error);
  }
};

// Get all pending businesses (Admin Only)
exports.getPendingBusinesses = async (req, res, next) => {
  try {
    const userRole = req.user && req.user.role;
    if (userRole !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    const businesses = await Business.findPending();
    return res.json(businesses);
  } catch (error) {
    next(error);
  }
};

// Approve all pending businesses (Admin)
exports.approveAllPending = async (req, res, next) => {
  try {
    const userRole = req.user && req.user.role;
    if (userRole !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    // The model's function returns a row: { businesses_approved, message }
    const result = await Business.approveAllPending();
    return res.json(result);
  } catch (error) {
    next(error);
  }
};
