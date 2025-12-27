import { create } from 'zustand';
import type { BibDatabase, BibEntry } from '../../../shared/types';
import { libraryApi } from '../services/api';

interface LibraryState {
  libraries: BibDatabase[];
  currentLibrary: BibDatabase | null;
  currentEntries: BibEntry[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLibraries: () => Promise<void>;
  fetchLibrary: (id: string) => Promise<void>;
  createLibrary: (name: string) => Promise<void>;
  deleteLibrary: (id: string) => Promise<void>;
  fetchEntries: (libraryId: string) => Promise<void>;
  setCurrentLibrary: (library: BibDatabase | null) => void;
  setError: (error: string | null) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  libraries: [],
  currentLibrary: null,
  currentEntries: [],
  isLoading: false,
  error: null,

  fetchLibraries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await libraryApi.getAll();
      set({ libraries: response.data.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchLibrary: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await libraryApi.getById(id);
      set({ currentLibrary: response.data.data || null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createLibrary: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      await libraryApi.create(name);
      await get().fetchLibraries();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteLibrary: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await libraryApi.delete(id);
      await get().fetchLibraries();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchEntries: async (libraryId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await libraryApi.getEntries(libraryId);
      set({ currentEntries: response.data.data || [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentLibrary: (library: BibDatabase | null) => {
    set({ currentLibrary: library });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
