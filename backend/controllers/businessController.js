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

    // 2. Combine it with the text data from req.body
    const businessData = { ...req.body, owner_id };

    // 3. NEW: If a file was uploaded, add its URL
    if (req.file) {
      businessData.image = req.file.path; // 'path' is the Cloudinary URL
    }
    
    // 4. Call the model function
    const business = await Business.create(businessData);
    res.status(201).json(business);
  } catch (error) {
    next(error);
  }
};

// Update business
exports.updateBusiness = async (req, res, next) => {
  try {
    const businessId = req.params.id;
    
    // 1. Get the business's current data
    const business = await Business.getById(businessId);
    
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    // --- 2. SECURITY CHECK ---
    // User must be the owner OR an admin
    if (business.owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this business' });
    }

    // This is the new data from the form
    const newData = req.body;
if (req.file) {
      newData.image = req.file.path;
    }
    // --- 3. NEW HYBRID APPROVAL LOGIC ---
    if (req.user.role === 'owner') {
        // If an OWNER is making the change, check if it needs re-approval.
        
        // Check if critical fields are being changed
        const nameChanged = newData.name && newData.name !== business.name;
        const descChanged = newData.description && newData.description !== business.description;
        // Use '!=' for category_id since it's a number, not a string
        const categoryChanged = newData.category_id && newData.category_id != business.category_id;

        if (nameChanged || descChanged || categoryChanged) {
            // A critical field was changed, force re-approval
            newData.status = 'pending';
        } else {
            // A minor field (like phone/address) was changed.
            // We preserve the current status (e.g., 'approved').
            newData.status = business.status;
        }
        
    } else if (req.user.role === 'admin') {
        // If an ADMIN is making the change (e.g., approving)
        // We trust their input. If they don't provide a status,
        // we keep the old one to be safe.
        newData.status = newData.status || business.status;
    }
    // --- END NEW LOGIC ---

    // 4. Send the final data to the model
    // The model will merge this with the existing data
    const updatedBusiness = await Business.update(businessId, newData);
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
// Get all businesses for the logged-in owner
exports.getMyBusinesses = async (req, res, next) => {
  try {
    // req.user.id comes from the 'auth' middleware
    const businesses = await Business.findByOwner(req.user.id); 
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};
// Fetches data for the edit form IF the user is the owner
exports.getBusinessDataForEdit = async (req, res, next) => {
    try {
        const businessId = req.params.id;
        const business = await Business.getById(businessId);

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // SECURITY CHECK: Is the logged-in user the owner?
        if (business.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Access Denied: You do not own this business.' });
        }
        
        // User is authorized, send the data
        res.json(business);

    } catch (error) {
        next(error);
    }
};
// Get all pending businesses (Admin Only)
exports.getPendingBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.findPending();
    res.json(businesses);
  } catch (error) {
    next(error);
  }
};