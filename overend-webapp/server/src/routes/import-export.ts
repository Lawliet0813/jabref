import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database.js';
import { parseBibTeX, generateBibTeX } from '../services/bibtex.js';
import type { BibEntry } from '../../../shared/types/index.js';

const router = express.Router();

// POST /api/libraries/:id/import - 匯入 BibTeX
router.post('/libraries/:id/import', async (req, res) => {
  const { id } = req.params;
  const { bibtexContent } = req.body;

  if (!bibtexContent) {
    return res.status(400).json({
      success: false,
      error: 'bibtexContent is required',
    });
  }

  const library = db.getDatabaseById(id);
  if (!library) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  try {
    const parsedEntries = await parseBibTeX(bibtexContent);
    let entriesAdded = 0;
    const errors: string[] = [];

    for (const entry of parsedEntries) {
      try {
        const bibEntry: BibEntry = {
          id: uuidv4(),
          type: entry.type as any,
          citationKey: entry.citationKey,
          fields: entry.fields,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        db.addEntry(id, bibEntry);
        entriesAdded++;
      } catch (err) {
        errors.push(`Failed to add entry ${entry.citationKey}: ${err}`);
      }
    }

    res.json({
      success: true,
      data: {
        entriesAdded,
        entriesFailed: errors.length,
        errors,
      },
      message: `Successfully imported ${entriesAdded} entries`,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: `Failed to parse BibTeX: ${err}`,
    });
  }
});

// GET /api/libraries/:id/export - 匯出 BibTeX
router.get('/libraries/:id/export', (req, res) => {
  const { id } = req.params;
  const { format = 'bibtex' } = req.query;

  const library = db.getDatabaseById(id);
  if (!library) {
    return res.status(404).json({
      success: false,
      error: 'Library not found',
    });
  }

  try {
    if (format === 'bibtex' || format === 'biblatex') {
      const bibtexContent = generateBibTeX(library.entries);

      res.setHeader('Content-Type', 'application/x-bibtex');
      res.setHeader('Content-Disposition', `attachment; filename="${library.name}.bib"`);
      res.send(bibtexContent);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${library.name}.json"`);
      res.json(library);
    } else {
      res.status(400).json({
        success: false,
        error: 'Unsupported export format. Use: bibtex, biblatex, or json',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Export failed: ${err}`,
    });
  }
});

export default router;
