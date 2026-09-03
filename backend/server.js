   require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Hello World route — confirms the server is alive
app.get('/', (req, res) => {
  res.send('ReviewCrew backend is running! 🚀');
});

// Health check route (per API.md)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`ReviewCrew backend listening on port ${PORT}`);
});