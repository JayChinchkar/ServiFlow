const { Provider } = require('../models/User');

const updateAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'Provider') {
      return res.status(403).json({ message: "Forbidden: Only providers can perform this action" });
    }

    // Add a check to see if req.body exists
    if (!req.body || !req.body.availability) {
      return res.status(400).json({ message: "Missing availability data in request body" });
    }

    const { availability } = req.body;
    
    const provider = await Provider.findByIdAndUpdate(
      req.user.id, 
      { availability }, 
      { new: true, runValidators: true } // runValidators ensures the 'enum' days are correct
    );

    res.json({ message: "Availability updated successfully", availability: provider.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { updateAvailability };