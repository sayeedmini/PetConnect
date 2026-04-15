const express = require('express');
const router = express.Router();
const { updateProfile, searchGroomers, getGroomerById } = require('../controllers/groomerController');
const { upload } = require('../config/cloudinary');

router.get('/search', searchGroomers);
router.get('/:id', getGroomerById);
router.put('/profile', upload.array('portfolioImages', 5), updateProfile);

module.exports = router;
