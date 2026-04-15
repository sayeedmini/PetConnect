const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
  try {
    const { petOwnerId, groomerId, date, time, coordinates } = req.body;

    const booking = await Booking.create({
      petOwnerId,
      groomerId,
      date,
      time,
      serviceLocation: {
        type: 'Point',
        coordinates // [longitude, latitude]
      },
      status: 'Pending'
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Public
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Pending', 'Accepted', 'On the Way', 'Arrived', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get booking details (for testing live tracking)
// @route   GET /api/bookings/:id
// @access  Public
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('groomerId petOwnerId', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
     console.error('Error fetching booking:', error);
     res.status(500).json({ success: false, error: 'Server Error' });
  }
};
