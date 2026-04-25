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

    const io = req.app.get("io");

    io.emit("new_rescue_request", {
      rescueId: savedReport.rescueId,
      description: savedReport.description,

      lat: savedReport.lat,
      lng: savedReport.lng,

      status: savedReport.status,
      isNew: true,
      createdAt: savedReport.createdAt,
    });

    res.status(201).json({
      rescueId: savedReport.rescueId,
      status: savedReport.status,
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOpenReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "Open" }).sort({
      createdAt: -1,
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching open reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAcceptedReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: "Accepted" }).sort({
      createdAt: -1,
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching accepted reports:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptReport = async (req, res) => {
  try {
    const { rescueId } = req.params;

    const updatedReport = await Report.findOneAndUpdate(
      { rescueId },
      { status: "Accepted" },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error accepting report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectReport = async (req, res) => {
  try {
    const { rescueId } = req.params;

    const updatedReport = await Report.findOneAndUpdate(
      { rescueId },
      { status: "Rejected" },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error rejecting report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const completeReport = async (req, res) => {
  try {
    const { rescueId } = req.params;

    const updatedReport = await Report.findOneAndUpdate(
      { rescueId },
      { status: "Completed" },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error completing report:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReport,
  getOpenReports,
  getAcceptedReports,
  acceptReport,
  rejectReport,
  completeReport,
};
