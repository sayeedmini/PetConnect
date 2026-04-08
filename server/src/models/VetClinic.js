const mongoose = require('mongoose');

const vetClinicSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    servicesOffered: {
      type: [String],
      default: [],
    },
    workingHours: {
      type: String,
      required: true,
      trim: true,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('VetClinic', vetClinicSchema);