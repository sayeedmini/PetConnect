const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  petOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groomerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., '14:30'
  serviceLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'On the Way', 'Arrived', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

// Index for geospatial queries
bookingSchema.index({ serviceLocation: '2dsphere' });

module.exports = mongoose.model('Booking', bookingSchema);
