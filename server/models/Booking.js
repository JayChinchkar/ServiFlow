const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  // ADD THESE:
  problemDescription: { type: String, default: "" },
  address: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected', 'completed'], 
    default: 'pending' 
  },
  isReviewed: { type: Boolean, default: false } // Add this line
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);