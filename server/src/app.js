const express = require('express');
const cors = require('cors');
const vetRoutes = require('./routes/vetRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PetConnect API is running',
  });
});

app.use('/api/vets', vetRoutes);

module.exports = app;