const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password, role, phone });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // --- NEW COOKIE LOGIC ---
    // Set the token in a secure, httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents client-side JS from accessing it
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    // --- END NEW LOGIC ---

    // We still send this JSON for the client-side to store in localStorage
    // (This helps scripts know *who* is logged in without needing the token)
    res.json({
      message: 'Login successful',
      token, // Send token for API requests
      user: { // Send user object for localStorage
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- NEW LOGOUT FUNCTION ---
exports.logout = (req, res) => {
  // Clear the cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) // Expire the cookie immediately
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
// --- END NEW FUNCTION ---

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.update(req.user.id, req.body);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};