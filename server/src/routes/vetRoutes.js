const express = require('express');
const {
  getAllVetClinics,
  getVetClinicById,
  createVetClinic,
  updateVetClinic,
  deleteVetClinic,
} = require('../controllers/vetController');

const router = express.Router();

router.get('/', getAllVetClinics);
router.get('/:id', getVetClinicById);
router.post('/', createVetClinic);
router.put('/:id', updateVetClinic);
router.delete('/:id', deleteVetClinic);

module.exports = router;