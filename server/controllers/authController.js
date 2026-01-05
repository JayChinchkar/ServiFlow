const { User, Customer, Provider } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- REGISTER LOGIC ---
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, ...extraData } = req.body;

    // DEBUG: Add this line to see what the server is receiving
    console.log("Received Body:", req.body);

    // 1. Validation check
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Password is required and must be a string." });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 3. Hash password (The error was happening here)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user based on role
    if (role === 'Provider') {
      user = new Provider({
        email, 
        password: hashedPassword, 
        firstName, 
        lastName,
        businessName: extraData.businessName,
        serviceType: extraData.serviceType,
        hourlyRate: extraData.hourlyRate
      });
    } else {
      user = new Customer({
        email, 
        password: hashedPassword, 
        firstName, 
        lastName,
        address: extraData.address
      });
    }

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN LOGIC ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // 4. Send back token and basic user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login }; // Export both functions