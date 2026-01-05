const mongoose = require('mongoose');

const userOptions = {
  discriminatorKey: 'role', 
  collection: 'users',
};

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, userOptions);

const User = mongoose.model('User', UserSchema);

const Customer = User.discriminator('Customer', new mongoose.Schema({
  address: { street: String, city: String, zip: String }
}));

const Provider = User.discriminator('Provider', new mongoose.Schema({
  businessName: { type: String, required: true },
  serviceType: { type: String, enum: ['Plumbing', 'Tutoring', 'Electrical', 'Cleaning'], required: true },
  hourlyRate: { type: Number, required: true },
  
  // --- NEW PROFESSIONAL FEATURES ---
  isOnline: { type: Boolean, default: true }, // Master Switch
  bio: { type: String, default: "" },          // Professional Summary
  skills: [{ type: String }],                  // Tech or Service skills
  portfolio: [{ type: String }],               // Array of Image URLs
  
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String, 
    endTime: String    
  }]
}));

module.exports = { User, Customer, Provider };