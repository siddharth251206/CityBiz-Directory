const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./db');
const cookieParser = require('cookie-parser'); // <-- IMPORT THIS
const userMiddleware = require('./middleware/userMiddleware'); // <-- IMPORT THIS

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view cache', false);
app.locals.cache = false;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <-- ADD THIS
app.use(express.static(path.join(__dirname, '../public')));

// --- GLOBAL USER MIDDLEWARE ---
app.use(userMiddleware); // <-- ADD THIS (runs on all routes)

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Import routes
const viewRoutes = require('./routes/viewRoutes');
const businessRoutes = require('./routes/businessRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');     
const favoriteRoutes = require('./routes/favoriteRoutes'); 

// Use routes
app.use('/', viewRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);     
app.use('/api/favorites', favoriteRoutes); 

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});