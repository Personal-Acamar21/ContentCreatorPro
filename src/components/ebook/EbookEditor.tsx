import React, { useState } from 'react';
import { 
  ArrowLeft, Save, FileDown, Layout, Sparkles, 
  Loader2, Share2, X 
} from 'lucide-react';
import { useEbookStore } from '../../store/ebookStore';
import type { Ebook, Chapter } from '../../types/ebook';
import ChapterList from './ChapterList';
import EnhancedChapterEditor from './EnhancedChapterEditor';
import ShareModal from './ShareModal';

interface EbookEditorProps {
  ebook: Ebook;
  onBack: () => void;
}

export default function EbookEditor({ ebook, onBack }: EbookEditorProps) {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const { updateEbook, updateChapter } = useEbookStore();
  const [showPreview, setShowPreview] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'pdf' | 'epub' | 'mobi' | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateEbook(ebook.id, {
        updatedAt: new Date().toISOString(),
      });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'epub' | 'mobi') => {
    setExportingFormat(format);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the ebook format
      updateEbook(ebook.id, { format });
      
      // Show success message
      alert(`Successfully exported ${ebook.title} as ${format.toUpperCase()}`);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={ebook.title}
            onChange={(e) =>
              updateEbook(ebook.id, { title: e.target.value })
            }
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 px-0"
            placeholder="Enter ebook title..."
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Preview Ebook"
          >
            <Layout className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Share Ebook"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Export Ebook"
            >
              <FileDown className="w-5 h-5" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <div className="py-1">
                  {(['pdf', 'epub', 'mobi'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format)}
                      disabled={exportingFormat !== null}
                      className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {exportingFormat === format ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Export as {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      {showSaveConfirmation && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in-out">
          <Sparkles className="w-4 h-4" />
          Changes saved successfully!
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <ChapterList
            chapters={ebook.chapters}
            currentChapterId={currentChapter?.id}
            onChapterSelect={setCurrentChapter}
            ebookId={ebook.id}
          />
        </div>
        <div className="col-span-2">
          {currentChapter ? (
            <EnhancedChapterEditor
              chapter={currentChapter}
              onSave={(updates) => {
                updateChapter(ebook.id, currentChapter.id, updates);
              }}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a chapter to start editing
            </div>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{ebook.title}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 prose max-w-none">
              {ebook.chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter) => (
                  <div key={chapter.id} className="mb-8">
                    <h2>{chapter.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
          ebook={ebook}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}