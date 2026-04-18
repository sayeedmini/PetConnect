const Booking = require("../models/Booking");

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { groomerId, petOwnerName, date, time, coordinates, address } = req.body;

    const booking = await Booking.create({
      groomerId,
      petOwnerName,
      date,
      time,
      serviceLocation: { 
        type: "Point", 
        coordinates,
        address
      },
      status: "Pending",
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, error: error.message || "Server Error" });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Accepted", "On the Way", "Arrived", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("groomerId", "name email location address");

    if (!booking) {
      return res.status(404).json({ success: false, error: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
