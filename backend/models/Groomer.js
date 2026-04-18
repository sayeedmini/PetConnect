const mongoose = require("mongoose");

const groomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    experience: { type: String, required: true },
    services: [{ type: String }],
    pricing: [
      {
        packageName: String,
        price: Number,
        description: String,
      },
    ],
    portfolioImages: [{ type: String }],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    address: { type: String },
  },
  { timestamps: true }
);

// Index for geospatial queries (find nearby groomers)
groomerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Groomer", groomerSchema);
