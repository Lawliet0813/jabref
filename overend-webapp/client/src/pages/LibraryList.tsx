import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, FolderOpen, Calendar } from 'lucide-react';
import { useLibraryStore } from '../stores/libraryStore';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LibraryList() {
  const { libraries, isLoading, error, fetchLibraries, createLibrary, deleteLibrary } =
    useLibraryStore();
  const [newLibraryName, setNewLibraryName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchLibraries();
  }, [fetchLibraries]);

  const handleCreateLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibraryName.trim()) return;

    await createLibrary(newLibraryName);
    setNewLibraryName('');
    setShowCreateForm(false);
  };

  const handleDeleteLibrary = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteLibrary(id);
    }
  };

  if (isLoading && libraries.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading libraries...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Libraries</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-5 w-5 mr-2" />
          New Library
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {showCreateForm && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleCreateLibrary} className="flex gap-4">
              <Input
                type="text"
                placeholder="Library name"
                value={newLibraryName}
                onChange={(e) => setNewLibraryName(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit">Create</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraries.map((library) => (
          <Card key={library.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FolderOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <CardTitle>{library.name}</CardTitle>
                </div>
                <button
                  onClick={() => handleDeleteLibrary(library.id, library.name)}
                  className="text-gray-400 hover:text-red-600"
                  title="Delete library"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">
                    {library.entries.length} entries
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  Updated {new Date(library.updatedAt).toLocaleDateString()}
                </div>
                <Link to={`/library/${library.id}`}>
                  <Button variant="secondary" className="w-full mt-4">
                    Open Library
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {libraries.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No libraries yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first library to start managing references
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Library
          </Button>
        </div>
      )}
    </div>
  );
}
