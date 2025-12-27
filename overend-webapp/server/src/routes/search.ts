import express from 'express';
import { db } from '../models/database.js';

const router = express.Router();

// GET /api/search?libraryId=xxx&q=query - 搜尋條目
router.get('/', (req, res) => {
  const { libraryId, q, caseSensitive } = req.query;

  if (!libraryId || typeof libraryId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'libraryId query parameter is required',
    });
  }

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'q (query) parameter is required',
    });
  }

  const isCaseSensitive = caseSensitive === 'true';
  const results = db.searchEntries(libraryId, q, isCaseSensitive);

  res.json({
    success: true,
    data: results,
    total: results.length,
  });
});

export default router;
