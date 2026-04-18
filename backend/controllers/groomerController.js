const Groomer = require("../models/Groomer");

// @desc    Get all groomers, optionally filtered by service
// @route   GET /api/groomers/search
exports.searchGroomers = async (req, res) => {
  try {
    const { service, lng, lat, maxDistance = 50000 } = req.query;
    let query = {};

    if (service) {
      query.services = { $in: [service] };
    }

    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      };
    }

    const groomers = await Groomer.find(query);
    res.status(200).json({ success: true, data: groomers });
  } catch (error) {
    console.error("Error searching groomers:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get a single groomer by ID
// @route   GET /api/groomers/:id
exports.getGroomerById = async (req, res) => {
  try {
    const groomer = await Groomer.findById(req.params.id);
    if (!groomer) {
      return res.status(404).json({ success: false, error: "Groomer not found" });
    }
    res.status(200).json({ success: true, data: groomer });
  } catch (error) {
    console.error("Error fetching groomer:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
