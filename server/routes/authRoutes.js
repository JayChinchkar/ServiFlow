const express = require('express');
const router = express.Router();

// 1. Import your controllers
const { register, login } = require('../controllers/authController');

// 2. IMPORT THE PROTECT MIDDLEWARE (The guard we created)
const { protect } = require('../middleware/authMiddleware');

// Route for User Registration (POST)
router.post('/register', register);

// Route for User Login (POST)
router.post('/login', login);

// New Protected Route - Notice 'protect' is placed before the (req, res) function
router.get('/profile', protect, (req, res) => {
  res.json({ 
    message: "Access Granted", 
    userId: req.user.id, 
    role: req.user.role 
  });
});

module.exports = router;