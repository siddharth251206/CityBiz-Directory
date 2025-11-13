const express = require('express');
const router = express.Router();
const Business = require('../models/businessModel');
const Category = require('../models/categoryModel');
const Review = require('../models/reviewModel');

// Home page
router.get('/', async (req, res) => {
  try {
    const topBusinesses = await Business.getTopRated(6);
    const categories = await Category.getAll();

    res.render('mainpage', { 
      businesses: topBusinesses,
      categories: categories,
      currentPage: 'home'
    });

  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Search page
router.get('/search', async (req, res) => {
  try {
    const businesses = await Business.getAll();
    const categories = await Category.getAll();
    
    res.render('searchbiz', { 
      businesses,
      categories,
      currentPage: 'search'
    });

  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Add business page
router.get('/add', async (req, res) => {
  try {
    const categories = await Category.getAll();
    
    res.render('addbiz', { 
      categories,
      currentPage: 'add'
    });

  } catch (error) {
    res.status(500).render('error', { error });
  }
});

// Business detail page
router.get('/business/:id', async (req, res) => {
  try {
    const businessId = req.params.id;

    const business = await Business.getById(businessId);
    if (!business) return res.status(404).send('Business not found');

    const reviews = await Review.getAllByBusinessId(businessId);

    res.render('businessDetail', {
      title: `${business.name} | CityBiz Directory`,
      business,
      reviews,
      currentPage: 'business'
    });

  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

// Edit business page
router.get('/edit/:id', async (req, res) => {
  try {
    const categories = await Category.getAll();
    
    res.render('editbiz', {
      title: 'Edit Business',
      currentPage: 'dashboard',
      categories,
      businessId: req.params.id 
    });

  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('aboutus', { currentPage: 'about' });
});

// Login
router.get('/login', (req, res) => {
  res.render('login', { currentPage: 'login' });
});

// Register
router.get('/register', (req, res) => {
  res.render('register', { currentPage: 'register' });
});

// Owner Dashboard
router.get('/dashboard/owner', (req, res) => {
  res.render('ownerDashboard', { currentPage: 'dashboard' });
});

// Viewer Dashboard
router.get('/dashboard/viewer', (req, res) => {
  res.render('viewerHome', { currentPage: 'dashboard' });
});

// Admin Dashboard
router.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Admin Dashboard',
        currentPage: 'admin',
        stylesheets: ['admin.css']
    });
});

// Favorites (viewer only)
router.get('/favorites', (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  if (res.locals.user.role !== 'viewer') return res.redirect('/');

  res.render('favorites', {
    title: 'My Favorites',
    currentPage: 'favorites'
  });
});

// My reviews (viewer only)
router.get('/reviews', (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  if (res.locals.user.role !== 'viewer') return res.redirect('/');

  res.render('my-reviews', {
    title: 'My Reviews',
    currentPage: 'reviews'
  });
});

// Profile
router.get('/profile', (req, res) => {
  if (!res.locals.user) return res.redirect('/login');

  res.render('profile', {
    title: 'My Profile',
    currentPage: 'profile'
  });
});

module.exports = router;
