import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, FileText } from 'lucide-react';
import { useEntryStore } from '../stores/entryStore';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type { BibEntry, EntryType } from '../../../shared/types';

const ENTRY_TYPES: EntryType[] = [
  'article', 'book', 'inproceedings', 'phdthesis', 'mastersthesis',
  'techreport', 'misc', 'online', 'conference', 'inbook', 'incollection'
];

const COMMON_FIELDS = [
  'title', 'author', 'year', 'month', 'journal', 'booktitle',
  'publisher', 'volume', 'number', 'pages', 'doi', 'url',
  'isbn', 'issn', 'editor', 'address', 'keywords', 'abstract', 'note'
];

export default function EntryEditor() {
  const { libraryId, entryId } = useParams<{ libraryId: string; entryId: string }>();
  const navigate = useNavigate();
  const { currentEntry, fetchEntry, createEntry, updateEntry } = useEntryStore();

  const isNewEntry = entryId === 'new';

  const [formData, setFormData] = useState<Partial<BibEntry>>({
    type: 'article',
    citationKey: '',
    fields: {},
  });

  const [activeTab, setActiveTab] = useState<'fields' | 'source'>('fields');

  useEffect(() => {
    if (!isNewEntry && libraryId && entryId) {
      fetchEntry(libraryId, entryId);
    }
  }, [libraryId, entryId, isNewEntry, fetchEntry]);

  useEffect(() => {
    if (currentEntry && !isNewEntry) {
      setFormData(currentEntry);
    }
  }, [currentEntry, isNewEntry]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!libraryId || !formData.citationKey || !formData.type) {
      alert('Citation key and type are required');
      return;
    }

    try {
      if (isNewEntry) {
        await createEntry(libraryId, formData);
      } else if (entryId) {
        await updateEntry(libraryId, entryId, formData);
      }
      navigate(`/library/${libraryId}`);
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry');
    }
  };

  const generateBibTeXSource = () => {
    if (!formData.type || !formData.citationKey) return '';

    let source = `@${formData.type}{${formData.citationKey},\n`;
    if (formData.fields) {
      for (const [field, value] of Object.entries(formData.fields)) {
        if (value) {
          source += `  ${field} = {${value}},\n`;
        }
      }
    }
    source += '}';
    return source;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNewEntry ? 'New Entry' : `Edit: ${formData.citationKey}`}
        </h1>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="h-5 w-5 mr-2" />
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(`/library/${libraryId}`)}
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('fields')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fields'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fields
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'source'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="inline h-4 w-4 mr-1" />
            BibTeX Source
          </button>
        </nav>
      </div>

      {activeTab === 'fields' ? (
        <Card>
          <CardContent>
            <div className="space-y-6">
              {/* Required Fields */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Required Fields
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entry Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as EntryType })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {ENTRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Citation Key *"
                    value={formData.citationKey}
                    onChange={(e) =>
                      setFormData({ ...formData, citationKey: e.target.value })
                    }
                    placeholder="e.g., Einstein1905"
                  />
                </div>
              </div>

              {/* Common Fields */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Common Fields
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {COMMON_FIELDS.map((field) => (
                    <Input
                      key={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={formData.fields?.[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field}`}
                    />
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comments
                </label>
                <textarea
                  value={formData.comments || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any comments or notes..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>BibTeX Source</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-x-auto">
              <code className="text-sm font-mono">{generateBibTeXSource()}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
