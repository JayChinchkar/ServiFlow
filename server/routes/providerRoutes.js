const express = require('express');
const router = express.Router();
const { updateAvailability } = require('../controllers/providerController');
const { protect } = require('../middleware/authMiddleware');

router.put('/availability', protect, updateAvailability);

module.exports = router;