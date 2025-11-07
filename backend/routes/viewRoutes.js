const express = require('express');
const router = express.Router();
const Business = require('../models/businessModel');
const Category = require('../models/categoryModel');
const Review = require('../models/reviewModel');
const { auth, isAdmin, isOwner } = require('../middleware/auth');
const { isViewer } = require('../middleware/auth');
// Home page
router.get('/', async (req, res) => {
  try {
    // Fetch data for the new homepage
    const topBusinesses = await Business.getTopRated(6); // Get 6 for a nice grid
    const categories = await Category.getAll();

    // Render the mainpage, passing both sets of data
    res.render('mainpage', { 
      businesses: topBusinesses, // 'businesses' is used by your mainpage.js
      categories: categories 
    });
  } catch (error) {
    // Use the new error handling
    res.status(500).send('Server Error: ' + error.message);
  }
});
// Search businesses page
router.get('/search', async (req, res) => {
  try {
    // We need both all businesses AND all categories for the filters
    const businesses = await Business.getAll();
    const categories = await Category.getAll();
    
    res.render('searchbiz', { 
      businesses: businesses,
      categories: categories // Pass categories for the filter dropdown
    });
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
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
// ===================================
// NEW: BUSINESS DETAIL PAGE ROUTE
// ===================================
router.get('/business/:id', async (req, res) => {
    try {
        const businessId = req.params.id;

        // 1. Fetch the business details (this calls your stored procedure)
        const business = await Business.getById(businessId);
        
        if (!business) {
            // If no business is found, send a 404
            return res.status(404).send('Business not found');
        }

        // 2. Fetch all reviews for this business
        const reviews = await Review.getByBusinessId(businessId);

        // 3. Render the new page, passing in both sets of data
        res.render('businessDetail', {
            title: `${business.name} | CityBiz Directory`,
            business: business,
            reviews: reviews,
            currentPage: 'business' // For header styling
        });

    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});
router.get('/edit/:id', async (req, res) => {
    // We REMOVED 'auth' from this route
    try {
        // This route ONLY renders the page and gives it the categories
        const categories = await Category.getAll();
        
        res.render('editbiz', {
            title: 'Edit Business',
            currentPage: 'dashboard',
            categories: categories,
            // We pass the businessId to the EJS file
            businessId: req.params.id 
        });
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});// About us page
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
router.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Admin Dashboard',
        currentPage: 'admin'
    });
});
router.get('/favorites', (req, res) => {
    // We check res.locals.user (which was set by the cookie middleware)
    
    // 1. Check if user is logged in
    if (!res.locals.user) {
        // Not logged in, redirect to login page
        return res.redirect('/login');
    }

    // 2. Check if user has the correct role
    if (res.locals.user.role !== 'viewer') {
        // Logged in, but not a viewer. Send to homepage.
        return res.redirect('/');
    }

    // 3. User is a logged-in viewer. Render the page.
    res.render('favorites', {
        title: 'My Favorites',
        currentPage: 'favorites' // For header styling
    });
});
router.get('/reviews', (req, res) => {
    // 1. Check if user is logged in
    if (!res.locals.user) {
        return res.redirect('/login');
    }

    // 2. Check if user has the correct role
    if (res.locals.user.role !== 'viewer') {
        return res.redirect('/');
    }

    // 3. User is a logged-in viewer. Render the page.
    res.render('my-reviews', {
        title: 'My Reviews',
        currentPage: 'reviews' // For header styling
    });
});

router.get('/profile', (req, res) => {
    // 1. Check if user is logged in (using the cookie data)
    if (!res.locals.user) {
        // Not logged in, redirect to login page
        return res.redirect('/login');
    }

    // 2. User is logged in, render the page
    // (This page is for ALL roles)
    res.render('profile', {
        title: 'My Profile',
        currentPage: 'profile' // For header styling
    });
});


module.exports = router;
