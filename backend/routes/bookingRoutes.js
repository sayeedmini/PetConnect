const express = require('express');
const router = express.Router();
const { createBooking, updateStatus, getBookingById } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/:id', getBookingById);
router.put('/:id/status', updateStatus);

module.exports = router;
