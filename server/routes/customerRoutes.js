const express = require('express');
const router = express.Router();
const { searchProviders } = require('../controllers/searchController');

// This is a PUBLIC route - Customers don't need to be logged in to search
router.get('/search', searchProviders);

module.exports = router;