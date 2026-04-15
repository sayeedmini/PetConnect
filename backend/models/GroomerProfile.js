const mongoose = require('mongoose');

const groomerProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  experience: { type: String, required: true },
  services: [{ type: String }],
  pricing: [{
    packageName: String,
    price: Number,
    description: String
  }],
  portfolioImages: [{ type: String }], // Array of Cloudinary URLs
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  addressString: String
}, { timestamps: true });

// Index for geospatial queries
groomerProfileSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('GroomerProfile', groomerProfileSchema);
