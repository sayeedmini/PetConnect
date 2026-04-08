const VetClinic = require('../models/VetClinic');

const getAllVetClinics = async (req, res) => {
  try {
    const clinics = await VetClinic.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: clinics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vet clinics',
      error: error.message,
    });
  }
};

const getVetClinicById = async (req, res) => {
  try {
    const clinic = await VetClinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Vet clinic not found',
      });
    }

    res.status(200).json({
      success: true,
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vet clinic',
      error: error.message,
    });
  }
};

const createVetClinic = async (req, res) => {
  try {
    const clinic = await VetClinic.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Vet clinic created successfully',
      data: clinic,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create vet clinic',
      error: error.message,
    });
  }
};

const updateVetClinic = async (req, res) => {
  try {
    const clinic = await VetClinic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Vet clinic not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vet clinic updated successfully',
      data: clinic,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update vet clinic',
      error: error.message,
    });
  }
};

const deleteVetClinic = async (req, res) => {
  try {
    const clinic = await VetClinic.findByIdAndDelete(req.params.id);

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Vet clinic not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vet clinic deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete vet clinic',
      error: error.message,
    });
  }
};

module.exports = {
  getAllVetClinics,
  getVetClinicById,
  createVetClinic,
  updateVetClinic,
  deleteVetClinic,
};