import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Download, FileText, ArrowLeft } from 'lucide-react';
import { useLibraryStore } from '../stores/libraryStore';
import { libraryApi } from '../services/api';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function ImportExport() {
  const { libraryId } = useParams<{ libraryId: string }>();
  const navigate = useNavigate();
  const { currentLibrary, fetchEntries } = useLibraryStore();

  const [importContent, setImportContent] = useState('');
  const [importResult, setImportResult] = useState<{
    success: boolean;
    entriesAdded: number;
    entriesFailed: number;
    errors?: string[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!libraryId || !importContent.trim()) {
      alert('Please upload a BibTeX file or paste content');
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const response = await libraryApi.importBibTeX(libraryId, importContent);
      setImportResult(response.data.data!);

      // Refresh entries
      await fetchEntries(libraryId);

      // Clear content after successful import
      setImportContent('');
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (format: 'bibtex' | 'biblatex' | 'json') => {
    if (!libraryId) return;

    setIsExporting(true);
    try {
      const response = await libraryApi.export(libraryId, format);

      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'json' ? 'application/json' : 'application/x-bibtex',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentLibrary?.name || 'library'}.${
        format === 'json' ? 'json' : 'bib'
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/library/${libraryId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Library
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Import & Export</h1>
        <p className="text-gray-500 mt-1">
          {currentLibrary?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Import BibTeX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload BibTeX File
                </label>
                <input
                  type="file"
                  accept=".bib,.bibtex"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

              {/* Or paste content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Paste BibTeX Content
                </label>
                <textarea
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="@article{Einstein1905,
  author = {Albert Einstein},
  title = {Zur Elektrodynamik bewegter Körper},
  journal = {Annalen der Physik},
  year = {1905}
}"
                />
              </div>

              <Button
                onClick={handleImport}
                disabled={isImporting || !importContent.trim()}
                className="w-full"
              >
                {isImporting ? 'Importing...' : 'Import Entries'}
              </Button>

              {/* Import Result */}
              {importResult && (
                <div
                  className={`p-4 rounded-md ${
                    importResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <h4 className="font-semibold mb-2">Import Results</h4>
                  <p className="text-sm">
                    Successfully imported: {importResult.entriesAdded} entries
                  </p>
                  {importResult.entriesFailed > 0 && (
                    <>
                      <p className="text-sm text-red-600">
                        Failed: {importResult.entriesFailed} entries
                      </p>
                      {importResult.errors && (
                        <ul className="mt-2 text-xs text-red-600 list-disc list-inside">
                          {importResult.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export your library in various formats:
              </p>

              {/* Export Options */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleExport('bibtex')}
                  disabled={isExporting}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Export as BibTeX (.bib)
                </Button>

                <Button
                  onClick={() => handleExport('biblatex')}
                  disabled={isExporting}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Export as BibLaTeX (.bib)
                </Button>

                <Button
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Export as JSON (.json)
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">
                  Current Library Stats
                </h4>
                <p className="text-sm text-blue-800">
                  Total entries: {currentLibrary?.entries.length || 0}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Last updated:{' '}
                  {currentLibrary?.updatedAt
                    ? new Date(currentLibrary.updatedAt).toLocaleString()
                    : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Import/Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Importing:</strong> Upload a .bib file or paste BibTeX content
              to add entries to your library. Duplicate citation keys will be skipped.
            </p>
            <p>
              <strong>Exporting:</strong> Download your entire library in BibTeX,
              BibLaTeX, or JSON format. The file will include all entries and their
              fields.
            </p>
            <p>
              <strong>Supported formats:</strong> Standard BibTeX/BibLaTeX entry
              types including article, book, inproceedings, phdthesis, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
