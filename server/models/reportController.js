const Report = require("../models/report");

const createReport = async (req, res) => {
  try {
    const { description, locationSource } = req.body;

    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);
    const files = req.files || [];

    const rescueId =
      "RES-" + Math.floor(100000 + Math.random() * 900000);

    const report = {
      rescueId,
      description,
      lat,
      lng,
      locationSource,
      media: files.map((file) => file.filename),
      status: "Open",
      createdAt: new Date(),
    };

    const savedReport = await Report.create(report);

    console.log("Saved Report:", savedReport);

    res.status(201).json({
      rescueId: savedReport.rescueId,
      status: savedReport.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createReport };
