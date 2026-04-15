const GroomerProfile = require('../models/GroomerProfile');
const User = require('../models/User');

// @desc    Update groomer profile including uploading portfolio images
// @route   PUT /api/groomers/profile
// @access  Public (in reality should be protected by auth middleware)
exports.updateProfile = async (req, res) => {
  try {
    const { userId, experience, services, pricing, coordinates, addressString } = req.body;
    
    // Process image URLs from Cloudinary multer upload
    const portfolioImagesUrl = req.files ? req.files.map(file => file.path) : [];

    let parsedServices = services;
    if (typeof services === 'string') {
      parsedServices = JSON.parse(services);
    }

    let parsedPricing = pricing;
    if (typeof pricing === 'string') {
      parsedPricing = JSON.parse(pricing);
    }

    let parsedCoordinates = coordinates;
    if (typeof coordinates === 'string') {
      parsedCoordinates = JSON.parse(coordinates); // expects [longitude, latitude]
    }

    const updateFields = {
      userId,
      experience,
      addressString
    };

    if (parsedServices) updateFields.services = parsedServices;
    if (parsedPricing) updateFields.pricing = parsedPricing;
    if (parsedCoordinates) {
      updateFields.location = {
        type: 'Point',
        coordinates: parsedCoordinates
      };
    }

    // Find and update, or create if it doesn't exist (using upsert)
    let profile = await GroomerProfile.findOneAndUpdate(
      { userId },
      { 
        $set: updateFields,
        $push: { portfolioImages: { $each: portfolioImagesUrl } } // add new images
      },
      { new: true, upsert: true } // upsert creates a new document if no match is found
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error updating groomer profile:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Search groomers by filters (location, services)
// @route   GET /api/groomers/search
// @access  Public
exports.searchGroomers = async (req, res) => {
  try {
    const { service, maxDistance = 50000, lng, lat } = req.query; // maxDistance in meters (default 50km)
    
    let query = {};
    
    // Filter by service if provided
    if (service) {
      query.services = { $in: [service] };
    }

    // Filter by location if longitude and latitude are provided
    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    // Since we need to join with User to get Groomer names, we populate
    const groomers = await GroomerProfile.find(query).populate('userId', 'name email');
    
    res.status(200).json({ success: true, data: groomers });
  } catch (error) {
    console.error('Error searching groomers:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get groomer profile by ID
// @route   GET /api/groomers/:id
// @access  Public
exports.getGroomerById = async (req, res) => {
  try {
    const groomer = await GroomerProfile.findById(req.params.id).populate('userId', 'name email');
    if (!groomer) {
      return res.status(404).json({ success: false, error: 'Groomer not found' });
    }
    res.status(200).json({ success: true, data: groomer });
  } catch (error) {
    console.error('Error fetching groomer by id:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
