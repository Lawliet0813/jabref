import { create } from 'zustand';
import type { BibEntry } from '../../../shared/types';
import { entryApi, searchApi } from '../services/api';

interface EntryState {
  currentEntry: BibEntry | null;
  searchResults: BibEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEntry: (libraryId: string, entryId: string) => Promise<void>;
  createEntry: (libraryId: string, entry: Partial<BibEntry>) => Promise<void>;
  updateEntry: (libraryId: string, entryId: string, entry: Partial<BibEntry>) => Promise<void>;
  deleteEntry: (libraryId: string, entryId: string) => Promise<void>;
  searchEntries: (libraryId: string, query: string, caseSensitive?: boolean) => Promise<void>;
  setCurrentEntry: (entry: BibEntry | null) => void;
  clearSearchResults: () => void;
}

export const useEntryStore = create<EntryState>((set) => ({
  currentEntry: null,
  searchResults: [],
  isLoading: false,
  error: null,

  fetchEntry: async (libraryId: string, entryId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await entryApi.getById(libraryId, entryId);
      set({ currentEntry: response.data.data || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createEntry: async (libraryId: string, entry: Partial<BibEntry>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await entryApi.create(libraryId, entry);
      set({ currentEntry: response.data.data || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateEntry: async (libraryId: string, entryId: string, entry: Partial<BibEntry>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await entryApi.update(libraryId, entryId, entry);
      set({ currentEntry: response.data.data || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteEntry: async (libraryId: string, entryId: string) => {
    set({ isLoading: true, error: null });
    try {
      await entryApi.delete(libraryId, entryId);
      set({ currentEntry: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  searchEntries: async (libraryId: string, query: string, caseSensitive = false) => {
    set({ isLoading: true, error: null });
    try {
      const response = await searchApi.search(libraryId, query, caseSensitive);
      set({ searchResults: response.data.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentEntry: (entry: BibEntry | null) => {
    set({ currentEntry: entry });
  },

  clearSearchResults: () => {
    set({ searchResults: [] });
  },
}));
