import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import libraryRoutes from './routes/library.js';
import entryRoutes from './routes/entry.js';
import searchRoutes from './routes/search.js';
import importExportRoutes from './routes/import-export.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/libraries', libraryRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', importExportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Overend Web App API ready`);
});
