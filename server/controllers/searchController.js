const { User } = require('../models/User'); 
const Review = require('../models/Review');
const mongoose = require('mongoose');

const searchProviders = async (req, res) => {
  try {
    const { service, city } = req.query; 

    // Match only Users who are Providers AND NOT Offline
    let matchQuery = { 
      role: 'Provider',
      // This allows existing providers (who don't have the field yet) 
      // and newly online providers to show up.
      isOnline: { $ne: false } 
    };

    if (service) {
      matchQuery.serviceType = { $regex: service, $options: 'i' };
    }

    if (city) {
      matchQuery['address.city'] = { $regex: city, $options: 'i' };
    }

    const providers = await User.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'reviews', 
          localField: '_id',
          foreignField: 'provider',
          as: 'allReviews'
        }
      },
      {
        $addFields: {
          // Calculate average, fallback to 0 if no reviews exist
          averageRating: { $ifNull: [{ $avg: '$allReviews.rating' }, 0] },
          totalReviews: { $size: '$allReviews' }
        }
      },
      {
        $project: { 
          password: 0, 
          allReviews: 0,
          __v: 0 
        }
      }
    ]);

    res.json(providers);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchProviders };