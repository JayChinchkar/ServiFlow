const Booking = require('../models/Booking');

// --- Create a new booking (Customer) ---
exports.createBooking = async (req, res) => {
  try {
    const { providerId, serviceDate, startTime, endTime, problemDescription, address, phoneNumber } = req.body;

    const existingBooking = await Booking.findOne({
      provider: providerId,
      serviceDate: serviceDate,
      status: { $in: ['pending', 'confirmed'] },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
    });

    if (existingBooking) return res.status(400).json({ message: "Slot already booked!" });

    const booking = new Booking({
      customer: req.user.id,
      provider: providerId,
      serviceDate,
      startTime,
      endTime,
      problemDescription,
      address,
      phoneNumber
    });

    await booking.save();
    res.status(201).json({ message: "Booking request sent!", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get bookings for Provider (FIXED FOR REVENUE) ---
exports.getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user.id })
      .populate('customer', 'firstName lastName email')
      // ADD THIS LINE: This fills the provider field with the hourlyRate so frontend can see it
      .populate('provider', 'hourlyRate') 
      .sort({ serviceDate: 1, startTime: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Get bookings for Customer ---
exports.getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('provider', 'businessName serviceType firstName lastName hourlyRate')
      .sort({ serviceDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Update Status ---
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.id },
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: `Status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};