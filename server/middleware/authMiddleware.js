const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the full user from DB and attach to request
      // We exclude the password for security
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Token is invalid" });
    }
  } else {
    res.status(401).json({ message: "No token found, access denied" });
  }
};

module.exports = { protect };