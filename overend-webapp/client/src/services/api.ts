import axios from 'axios';
import type {
  BibDatabase,
  BibEntry,
  ApiResponse,
  ImportResult,
} from '../../../shared/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Library API
export const libraryApi = {
  getAll: () => api.get<ApiResponse<BibDatabase[]>>('/libraries'),

  getById: (id: string) => api.get<ApiResponse<BibDatabase>>(`/libraries/${id}`),

  create: (name: string) => api.post<ApiResponse<BibDatabase>>('/libraries', { name }),

  update: (id: string, data: Partial<BibDatabase>) =>
    api.put<ApiResponse<BibDatabase>>(`/libraries/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<void>>(`/libraries/${id}`),

  getEntries: (libraryId: string) =>
    api.get<ApiResponse<BibEntry[]>>(`/libraries/${libraryId}/entries`),

  importBibTeX: (libraryId: string, bibtexContent: string) =>
    api.post<ApiResponse<ImportResult>>(`/libraries/${libraryId}/import`, { bibtexContent }),

  export: (libraryId: string, format: 'bibtex' | 'biblatex' | 'json' = 'bibtex') =>
    api.get(`/libraries/${libraryId}/export?format=${format}`, {
      responseType: 'blob',
    }),
};

// Entry API
export const entryApi = {
  getById: (libraryId: string, entryId: string) =>
    api.get<ApiResponse<BibEntry>>(`/entries/${entryId}?libraryId=${libraryId}`),

  create: (libraryId: string, entry: Partial<BibEntry>) =>
    api.post<ApiResponse<BibEntry>>('/entries', { libraryId, ...entry }),

  update: (libraryId: string, entryId: string, entry: Partial<BibEntry>) =>
    api.put<ApiResponse<BibEntry>>(`/entries/${entryId}`, { libraryId, ...entry }),

  delete: (libraryId: string, entryId: string) =>
    api.delete<ApiResponse<void>>(`/entries/${entryId}?libraryId=${libraryId}`),
};

// Search API
export const searchApi = {
  search: (libraryId: string, query: string, caseSensitive = false) =>
    api.get<ApiResponse<BibEntry[]>>(
      `/search?libraryId=${libraryId}&q=${encodeURIComponent(query)}&caseSensitive=${caseSensitive}`
    ),
};

export default api;
