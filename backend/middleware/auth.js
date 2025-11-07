const jwt = require('jsonwebtoken');

// 1. This function is your existing middleware. It just checks for a login.
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add the user payload (which includes id, role, email) to the request object
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// 2. THIS IS THE NEW FUNCTION
// This middleware checks if the user is an admin.
// It must be run *after* the 'auth' middleware.
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: 'Access Denied: Admin role required' });
  }
};
// 3. THIS IS THE NEW FUNCTION
// This middleware checks if the user is an owner.
// It must be run *after* the 'auth' middleware.
const isOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next(); // User is an owner, proceed
  } else {
    res.status(403).json({ message: 'Access Denied: Owner role required' });
  }
};
// 4. THIS IS THE NEW FUNCTION
// This middleware checks if the user is a viewer.
const isViewer = (req, res, next) => {
  if (req.user && req.user.role === 'viewer') {
    next(); // User is a viewer, proceed
  } else {
    res.status(403).json({ message: 'Access Denied: Viewer role required' });
  }
};
// We export both functions
module.exports = {
  auth,
  isAdmin,
  isOwner,
  isViewer
};