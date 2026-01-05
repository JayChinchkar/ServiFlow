const Review = require('../models/Review');
const Booking = require('../models/Booking');

exports.createReview = async (req, res) => {
  try {
    const { bookingId, providerId, rating, comment } = req.body;

    // 1. Validation: Check if the booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'completed') {
      return res.status(400).json({ message: "You can only review completed services." });
    }

    // 2. Security: Check if the customer is the one who booked it
    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to review this booking." });
    }

    // 3. Prevent duplicate reviews (Secondary check)
    if (booking.isReviewed) {
      return res.status(400).json({ message: "You have already reviewed this service." });
    }

    // 4. Create the review
    const review = new Review({
      booking: bookingId,
      customer: req.user.id,
      provider: providerId,
      rating,
      comment
    });

    await review.save();

    // 5. UPDATE BOOKING: Mark as reviewed so the button disappears
    booking.isReviewed = true;
    await booking.save();

    res.status(201).json({ 
      message: "Review submitted successfully!", 
      review 
    });

  } catch (error) {
    // Handle MongoDB unique constraint error (bookingId is unique in Review schema)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate review detected." });
    }
    res.status(500).json({ message: error.message });
  }
};