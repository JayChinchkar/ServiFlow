const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import all FOUR functions now from the controller
const { 
  createBooking, 
  getProviderBookings, 
  getCustomerBookings,
  updateBookingStatus // Added this to the import list
} = require('../controllers/bookingController');

// Customer creates a booking (Step 1)
router.post('/', protect, createBooking);

// Provider checks their schedule (John's view)
router.get('/my-schedule', protect, getProviderBookings);

// Customer checks their history (Sarah's view)
router.get('/my-bookings', protect, getCustomerBookings);

// Provider accepts or rejects a booking (John's action)
router.patch('/:id', protect, updateBookingStatus);

module.exports = router;