import React, { useState } from 'react';
import { Upload, X, Loader2, AlertTriangle } from 'lucide-react';
import { marked } from 'marked';

interface ImportModalProps {
  onImport: (chapters: { title: string; content: string }[]) => void;
  onClose: () => void;
}

export default function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{ title: string; content: string }[]>([]);

  const processContent = () => {
    if (!content.trim()) {
      setError('Please enter some content to import');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Split content by # headers
      const sections = content.split(/(?=^#\s)/m).filter(Boolean);
      
      if (sections.length === 0) {
        // If no sections found, treat entire content as one chapter
        const chapters = [{
          title: 'Chapter 1',
          content: marked.parse(content)
        }];
        setPreview(chapters);
        return;
      }

      const chapters = sections.map((section, index) => {
        const lines = section.trim().split('\n');
        const titleMatch = lines[0].match(/^#+\s+(.+)$/);
        const title = titleMatch ? titleMatch[1] : `Chapter ${index + 1}`;
        const content = marked.parse(lines.slice(1).join('\n').trim());

        return { title, content };
      });

      setPreview(chapters);
    } catch (error) {
      console.error('Error processing content:', error);
      setError('Failed to process content. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Import Content</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your content (Markdown format)
            </label>
            <div className="text-xs text-gray-500 mb-2">
              Use # for chapter titles. Example:
              <pre className="mt-1 p-2 bg-gray-50 rounded">
                # Chapter 1{'\n'}
                Content for chapter 1...{'\n\n'}
                # Chapter 2{'\n'}
                Content for chapter 2...
              </pre>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              className="w-full h-[400px] px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              placeholder="Paste your content here..."
            />
            <button
              onClick={processContent}
              disabled={!content.trim() || isProcessing}
              className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Process Content
                </>
              )}
            </button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="h-[400px] overflow-y-auto border rounded-lg p-4">
              {preview.length > 0 ? (
                <div className="space-y-4">
                  {preview.map((chapter, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-medium text-gray-900 mb-2">{chapter.title}</h3>
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Preview will appear here after processing
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            Import Content
          </button>
        </div>
      </div>
    </div>
  );
}