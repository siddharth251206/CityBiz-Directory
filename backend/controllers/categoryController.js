// controllers/categoryController.js
const Category = require('../models/categoryModel');

/**
 * Controller for Category operations
 * PostgreSQL-safe, stable, consistent response structure
 */

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (Number.isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const category = await Category.getById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    next(error);
  }
};

// Create a new category (admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const role = req.user && req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Category 'name' is required" });

    const newCategory = await Category.create({ name, description });

    return res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

// Update category (admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const role = req.user && req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const categoryId = parseInt(req.params.id, 10);
    if (Number.isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const { name, description } = req.body;

    const updatedCategory = await Category.update(categoryId, { name, description });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const role = req.user && req.user.role;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const categoryId = parseInt(req.params.id, 10);
    if (Number.isNaN(categoryId)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const deleted = await Category.delete(categoryId);
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
