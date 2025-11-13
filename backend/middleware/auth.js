const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalid" });
  }
};

const isAdmin = (req, res, next) =>
  req.user?.role === "admin" ? next() : res.status(403).json({ message: "Admin required" });

const isOwner = (req, res, next) =>
  req.user?.role === "owner" ? next() : res.status(403).json({ message: "Owner required" });

const isViewer = (req, res, next) =>
  req.user?.role === "viewer" ? next() : res.status(403).json({ message: "Viewer required" });

module.exports = { auth, isAdmin, isOwner, isViewer };
