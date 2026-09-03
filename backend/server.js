require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const { runReview } = require('./orchestrator');

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

// Code review route (per API.md)
app.post('/api/review', async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Field "code" is required and must be a string.' });
  }

  const trimmed = code.trim();

  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Code cannot be empty.' });
  }

  if (trimmed.length > 5000) {
    return res.status(400).json({ error: 'Code exceeds the 5000 character limit.' });
  }

  try {
    const result = await runReview(trimmed);
    res.json(result);
  } catch (err) {
    console.error('Review failed:', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`ReviewCrew backend listening on port ${PORT}`);
});