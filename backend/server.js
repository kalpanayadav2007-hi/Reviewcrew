require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { runReview } = require('./orchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'https://reviewcrew-frontend.onrender.com',
}));
app.use(helmet());
app.use(express.json());

// Catch malformed JSON in request bodies (otherwise Express throws
// an unhandled error and returns an ugly HTML page instead of JSON)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body.' });
  }
  next(err);
});

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

  if (code === undefined || code === null || typeof code !== 'string') {
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

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Final safety net — catches any error that slipped past route-level handling
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`ReviewCrew backend listening on port ${PORT}`);
});

// Prevent unhandled promise rejections from crashing the whole server
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

// Prevent uncaught exceptions from silently killing the process
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});