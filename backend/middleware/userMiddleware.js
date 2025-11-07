const jwt = require('jsonwebtoken');

// This middleware runs on *every* request to check for a user cookie
const userMiddleware = (req, res, next) => {
  // Get the token from the cookie
  const token = req.cookies.token;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Add the user payload to res.locals
      // This makes it available in all EJS templates
      res.locals.user = decoded;
    } catch (error) {
      // Invalid token, but we don't block the page,
      // we just don't set the user.
      res.locals.user = null;
    }
  }

  next();
};

module.exports = userMiddleware;