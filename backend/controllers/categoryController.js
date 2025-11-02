const Category = require('../models/categoryModel');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};