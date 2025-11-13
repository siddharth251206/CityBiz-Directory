// controllers/userController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await User.register({ name, email, password: hashed, role, phone });

if (!result.user_id) {
  return res.status(400).json({ success: false, message: result.message });
}

return res.status(201).json({
  success: true,
  message: result.message,
  user_id: result.user_id
});


  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
};


// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // SET COOKIE (same as OLD working version)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: "Logged out successfully" });
};

// GET PROFILE
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res, next) => {
  try {
    const updated = await User.update(req.user.user_id, req.body);
    res.json({ message: "Profile updated successfully", user: updated });
  } catch (err) {
    next(err);
  }
};
