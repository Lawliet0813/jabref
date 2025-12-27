import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database.js';
import type { BibEntry } from '../../../shared/types/index.js';

const router = express.Router();

// GET /api/entries/:id - 取得單一條目
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { libraryId } = req.query;

  if (!libraryId || typeof libraryId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'libraryId query parameter is required',
    });
  }

  const entry = db.getEntryById(libraryId, id);

  if (!entry) {
    return res.status(404).json({
      success: false,
      error: 'Entry not found',
    });
  }

  res.json({
    success: true,
    data: entry,
  });
});

// POST /api/entries - 新增條目（需要 libraryId）
router.post('/', (req, res) => {
  const { libraryId, type, citationKey, fields, files, comments } = req.body;

  if (!libraryId) {
    return res.status(400).json({
      success: false,
      error: 'libraryId is required',
    });
  }

  if (!type || !citationKey) {
    return res.status(400).json({
      success: false,
      error: 'type and citationKey are required',
    });
  }

  const newEntry: BibEntry = {
    id: uuidv4(),
    type,
    citationKey,
    fields: fields || {},
    files,
    comments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = db.addEntry(libraryId, newEntry);

  if (!created) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  res.status(201).json({
    success: true,
    data: created,
    message: 'Entry created successfully',
  });
});

// PUT /api/entries/:id - 更新條目
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { libraryId, type, citationKey, fields, files, comments } = req.body;

  if (!libraryId) {
    return res.status(400).json({
      success: false,
      error: 'libraryId is required',
    });
  }

  const updated = db.updateEntry(libraryId, id, {
    type,
    citationKey,
    fields,
    files,
    comments,
  });

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Entry not found',
    });
  }

  res.json({
    success: true,
    data: updated,
    message: 'Entry updated successfully',
  });
});

// DELETE /api/entries/:id - 刪除條目
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const { libraryId } = req.query;

  if (!libraryId || typeof libraryId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'libraryId query parameter is required',
    });
  }

  const deleted = db.deleteEntry(libraryId, id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Entry not found',
    });
  }

  res.json({
    success: true,
    message: 'Entry deleted successfully',
  });
});

export default router;
