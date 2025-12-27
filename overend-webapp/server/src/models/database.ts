import type { BibDatabase, BibEntry } from '../../../shared/types/index.js';

/**
 * 簡單的記憶體資料庫
 * 在生產環境中應該使用真實的資料庫（PostgreSQL, MongoDB等）
 */
class InMemoryDatabase {
  private databases: Map<string, BibDatabase> = new Map();

  // Database operations
  getAllDatabases(): BibDatabase[] {
    return Array.from(this.databases.values());
  }

  getDatabaseById(id: string): BibDatabase | undefined {
    return this.databases.get(id);
  }

  createDatabase(database: BibDatabase): BibDatabase {
    this.databases.set(database.id, database);
    return database;
  }

  updateDatabase(id: string, updates: Partial<BibDatabase>): BibDatabase | undefined {
    const db = this.databases.get(id);
    if (!db) return undefined;

    const updated = {
      ...db,
      ...updates,
      id, // Ensure id doesn't change
      updatedAt: new Date().toISOString(),
    };
    this.databases.set(id, updated);
    return updated;
  }

  deleteDatabase(id: string): boolean {
    return this.databases.delete(id);
  }

  // Entry operations within a database
  getEntriesByDatabaseId(databaseId: string): BibEntry[] {
    const db = this.databases.get(databaseId);
    return db?.entries || [];
  }

  getEntryById(databaseId: string, entryId: string): BibEntry | undefined {
    const db = this.databases.get(databaseId);
    return db?.entries.find(e => e.id === entryId);
  }

  addEntry(databaseId: string, entry: BibEntry): BibEntry | undefined {
    const db = this.databases.get(databaseId);
    if (!db) return undefined;

    db.entries.push(entry);
    db.updatedAt = new Date().toISOString();
    return entry;
  }

  updateEntry(databaseId: string, entryId: string, updates: Partial<BibEntry>): BibEntry | undefined {
    const db = this.databases.get(databaseId);
    if (!db) return undefined;

    const entryIndex = db.entries.findIndex(e => e.id === entryId);
    if (entryIndex === -1) return undefined;

    const updated = {
      ...db.entries[entryIndex],
      ...updates,
      id: entryId, // Ensure id doesn't change
      updatedAt: new Date().toISOString(),
    };
    db.entries[entryIndex] = updated;
    db.updatedAt = new Date().toISOString();
    return updated;
  }

  deleteEntry(databaseId: string, entryId: string): boolean {
    const db = this.databases.get(databaseId);
    if (!db) return false;

    const initialLength = db.entries.length;
    db.entries = db.entries.filter(e => e.id !== entryId);

    if (db.entries.length < initialLength) {
      db.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Search entries
  searchEntries(databaseId: string, query: string, caseSensitive = false): BibEntry[] {
    const db = this.databases.get(databaseId);
    if (!db) return [];

    const searchQuery = caseSensitive ? query : query.toLowerCase();

    return db.entries.filter(entry => {
      // Search in citation key
      const citationKey = caseSensitive ? entry.citationKey : entry.citationKey.toLowerCase();
      if (citationKey.includes(searchQuery)) return true;

      // Search in all fields
      for (const [field, value] of Object.entries(entry.fields)) {
        const fieldValue = caseSensitive ? value : value.toLowerCase();
        if (fieldValue.includes(searchQuery)) return true;
      }

      return false;
    });
  }
}

// Singleton instance
export const db = new InMemoryDatabase();

// Initialize with sample data
const sampleDatabase: BibDatabase = {
  id: 'sample-library',
  name: 'Sample Library',
  entries: [
    {
      id: 'entry-1',
      type: 'article',
      citationKey: 'Einstein1905',
      fields: {
        author: 'Albert Einstein',
        title: 'Zur Elektrodynamik bewegter Körper',
        journal: 'Annalen der Physik',
        year: '1905',
        volume: '17',
        pages: '891--921',
        doi: '10.1002/andp.19053221004',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'entry-2',
      type: 'book',
      citationKey: 'Knuth1997',
      fields: {
        author: 'Donald E. Knuth',
        title: 'The Art of Computer Programming',
        publisher: 'Addison-Wesley',
        year: '1997',
        edition: '3rd',
        volume: '1',
        isbn: '0-201-89683-4',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  metadata: {
    encoding: 'UTF-8',
    saveOrder: {
      orderType: 'specified',
      sortCriteria: [
        { field: 'author', descending: false },
        { field: 'year', descending: true },
      ],
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

db.createDatabase(sampleDatabase);
