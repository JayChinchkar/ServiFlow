const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateProfile, getProfile } = require('../controllers/userController');

// All profile routes are protected (require login)
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

module.exports = router;