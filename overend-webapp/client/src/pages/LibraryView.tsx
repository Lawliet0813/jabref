import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, FileText, Download, Upload } from 'lucide-react';
import { useLibraryStore } from '../stores/libraryStore';
import { useEntryStore } from '../stores/entryStore';
import { entryApi } from '../services/api';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { BibEntry } from '../../../shared/types';

export default function LibraryView() {
  const { libraryId } = useParams<{ libraryId: string }>();
  const navigate = useNavigate();
  const { currentLibrary, currentEntries, fetchLibrary, fetchEntries } = useLibraryStore();
  const { searchEntries, searchResults, clearSearchResults } = useEntryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (libraryId) {
      fetchLibrary(libraryId);
      fetchEntries(libraryId);
    }
  }, [libraryId, fetchLibrary, fetchEntries]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libraryId || !searchQuery.trim()) return;

    setIsSearching(true);
    await searchEntries(libraryId, searchQuery);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearchResults();
  };

  const handleDeleteEntry = async (entryId: string, citationKey: string) => {
    if (!libraryId) return;
    if (window.confirm(`Are you sure you want to delete "${citationKey}"?`)) {
      await entryApi.delete(libraryId, entryId);
      fetchEntries(libraryId);
    }
  };

  const displayedEntries = searchResults.length > 0 || searchQuery ? searchResults : currentEntries;

  if (!currentLibrary) {
    return <div className="text-center py-12">Loading library...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentLibrary.name}</h1>
            <p className="text-gray-500 mt-1">{displayedEntries.length} entries</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/library/${libraryId}/import-export`}>
              <Button variant="secondary">
                <Upload className="h-4 w-4 mr-2" />
                Import/Export
              </Button>
            </Link>
            <Link to={`/library/${libraryId}/entry/new`}>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search entries (title, author, keywords...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
          {(searchResults.length > 0 || searchQuery) && (
            <Button type="button" variant="secondary" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </form>
      </div>

      {/* Entries Table */}
      {displayedEntries.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No results found' : 'No entries yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? 'Try a different search query'
              : 'Add your first reference entry to get started'}
          </p>
          {!searchQuery && (
            <Link to={`/library/${libraryId}/entry/new`}>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                Add Entry
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Citation Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {entry.citationKey}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {entry.fields.title || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {entry.fields.author || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {entry.fields.year || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link to={`/library/${libraryId}/entry/${entry.id}`}>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteEntry(entry.id, entry.citationKey)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
