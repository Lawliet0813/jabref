import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database.js';
import type { BibDatabase } from '../../../shared/types/index.js';

const router = express.Router();

// GET /api/libraries - 取得所有文獻庫
router.get('/', (req, res) => {
  const libraries = db.getAllDatabases();
  res.json({
    success: true,
    data: libraries,
  });
});

// GET /api/libraries/:id - 取得單一文獻庫
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const library = db.getDatabaseById(id);

  if (!library) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  res.json({
    success: true,
    data: library,
  });
});

// POST /api/libraries - 建立新文獻庫
router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Library name is required',
    });
  }

  const newLibrary: BibDatabase = {
    id: uuidv4(),
    name,
    entries: [],
    metadata: {
      encoding: 'UTF-8',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = db.createDatabase(newLibrary);

  res.status(201).json({
    success: true,
    data: created,
    message: 'Library created successfully',
  });
});

// PUT /api/libraries/:id - 更新文獻庫
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, metadata, preamble, bibtexStrings } = req.body;

  const updated = db.updateDatabase(id, {
    name,
    metadata,
    preamble,
    bibtexStrings,
  });

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  res.json({
    success: true,
    data: updated,
    message: 'Library updated successfully',
  });
});

// DELETE /api/libraries/:id - 刪除文獻庫
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteDatabase(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  res.json({
    success: true,
    message: 'Library deleted successfully',
  });
});

// GET /api/libraries/:id/entries - 取得文獻庫的所有條目
router.get('/:id/entries', (req, res) => {
  const { id } = req.params;
  const library = db.getDatabaseById(id);

  if (!library) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  res.json({
    success: true,
    data: library.entries,
  });
});

export default router;
