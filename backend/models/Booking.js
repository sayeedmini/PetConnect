const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    groomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groomer",
      required: true,
    },
    petOwnerName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    serviceLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
      address: { type: String },
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "On the Way", "Arrived", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ serviceLocation: "2dsphere" });

module.exports = mongoose.model("Booking", bookingSchema);
