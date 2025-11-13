const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch {
      res.locals.user = null;
    }
  }

  next();
};

module.exports = userMiddleware;
