// Destructure Provider along with User from your model file
const { User, Provider } = require('../models/User');

// Update Profile (Bio, Skills, Online Status)
exports.updateProfile = async (req, res) => {
  try {
    // Log what is coming from the frontend to your terminal for debugging
    console.log("Request Body:", req.body);
    console.log("User ID from Token:", req.user._id);

    const { bio, skills, isOnline, businessName, hourlyRate } = req.body;
    
    // Use the Provider model specifically. 
    // This ensures Mongoose looks at the Provider schema fields (bio, skills).
    const updatedUser = await Provider.findByIdAndUpdate(
      req.user._id, 
      { 
        $set: { 
          bio, 
          skills, 
          isOnline, 
          businessName, 
          hourlyRate 
        } 
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    console.log("Updated Document in DB:", updatedUser);

    res.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get Profile Data
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};