const express = require('express');
const router = express.Router();
const Business = require('../models/businessModel');
const Category = require('../models/categoryModel');

// Home page
router.get('/', async (req, res) => {
  try {
    // Fetch both businesses and categories
    const topBusinesses = await Business.getTopRated(4);
    const categories = await Category.getAll(); // <-- FETCH CATEGORIES
    
    res.render('mainpage', { 
      businesses: topBusinesses, 
      categories: categories  // <-- PASS CATEGORIES
    });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});
// Search businesses page
router.get('/search', async (req, res) => {
  try {
    // Fetch both businesses and categories
    const businesses = await Business.getAll();
    const categories = await Category.getAll(); // <-- FETCH CATEGORIES
    
    res.render('searchbiz', { 
      businesses: businesses, 
      categories: categories // <-- PASS CATEGORIES
    });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});
// Add business page
router.get('/add', async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.getAll();
    
    // Pass them to the EJS template
    res.render('addbiz', { categories: categories }); 
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// About us page
router.get('/about', (req, res) => {
  res.render('aboutus');
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Owner dashboard
router.get('/dashboard/owner', (req, res) => {
  res.render('ownerDashboard');
});

// Viewer home
router.get('/dashboard/viewer', (req, res) => {
  res.render('viewerHome');
});

//register
router.get('/register', (req, res) => {
  res.render('register');
});
module.exports = router;
