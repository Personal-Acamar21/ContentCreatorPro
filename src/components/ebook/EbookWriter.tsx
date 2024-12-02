import React, { useState } from 'react';
import { BookOpen, Plus, Wand2, FileDown, Layout, Sparkles, Loader2, Trash2, Import, Share2, Search, X } from 'lucide-react';
import { useEbookStore } from '../../store/ebookStore';
import type { Ebook } from '../../types/ebook';
import EbookEditor from './EbookEditor';
import TemplateSelector from './TemplateSelector';
import InitialSetup from './InitialSetup';
import ImportModal from './ImportModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { ebookTemplates } from '../../data/ebookTemplates';

export default function EbookWriter() {
  const [currentEbook, setCurrentEbook] = useState<Ebook | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(ebookTemplates[0]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { ebooks, addEbook, deleteEbook } = useEbookStore();

  const filteredEbooks = ebooks.filter(ebook => 
    ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ebook.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNew = () => {
    setCurrentEbook(null);
    setShowTemplateSelector(true);
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    setShowInitialSetup(true);
  };

  const handleInitialSetupComplete = (data: { 
    title: string; 
    description: string; 
    chapters: { title: string; description: string }[] 
  }) => {
    const newEbook: Ebook = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      chapters: data.chapters.map((chapter, index) => ({
        id: crypto.randomUUID(),
        title: chapter.title,
        content: chapter.description,
        order: index
      })),
      template: selectedTemplate.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      format: 'pdf',
      style: {
        fontFamily: "'Source Sans Pro', system-ui, sans-serif",
        fontSize: '16px',
        lineHeight: '1.6',
        spacing: '1.5rem'
      }
    };
    addEbook(newEbook);
    setShowInitialSetup(false);
    setCurrentEbook(newEbook);
  };

  const handleDelete = (ebook: Ebook) => {
    setEbookToDelete(ebook);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ebookToDelete) {
      deleteEbook(ebookToDelete.id);
      setShowDeleteModal(false);
      setEbookToDelete(null);
    }
  };

  if (currentEbook) {
    return (
      <EbookEditor
        ebook={currentEbook}
        onBack={() => setCurrentEbook(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Ebook Writer</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage your ebooks with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Import className="w-5 h-5" />
            Import Content
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Ebook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Tools</h3>
          <div className="space-y-4">
            <button
              onClick={handleCreateNew}
              className="w-full px-4 py-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-3"
            >
              <Wand2 className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-medium">AI-Assisted Writing</div>
                <div className="text-sm text-gray-500">Get help with content generation</div>
              </div>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="w-full px-4 py-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-3"
            >
              <Import className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-medium">Import Content</div>
                <div className="text-sm text-gray-500">Import from Markdown or text</div>
              </div>
            </button>
            <button
              onClick={handleCreateNew}
              className="w-full px-4 py-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-3"
            >
              <Layout className="w-5 h-5 text-primary-600" />
              <div>
                <div className="font-medium">Design Templates</div>
                <div className="text-sm text-gray-500">Professional layouts and styles</div>
              </div>
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Your Ebooks</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ebooks..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredEbooks.map((ebook) => (
                <div
                  key={ebook.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-300 transition-all duration-200 cursor-pointer"
                  onClick={() => setCurrentEbook(ebook)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{ebook.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(ebook.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          ebook.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ebook.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(ebook);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredEbooks.length === 0 && (
                <div
                  onClick={handleCreateNew}
                  className="text-center py-12 cursor-pointer group"
                >
                  <div className="bg-white rounded-lg shadow-sm border p-8 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col items-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        {searchQuery ? 'No ebooks found matching your search.' : 'No ebooks yet. Create your first ebook to get started!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTemplateSelector && (
        <TemplateSelector
          templates={ebookTemplates}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {showInitialSetup && (
        <InitialSetup
          template={selectedTemplate}
          onComplete={handleInitialSetupComplete}
          onCancel={() => setShowInitialSetup(false)}
        />
      )}

      {showImportModal && (
        <ImportModal
          onImport={(chapters) => {
            const newEbook: Ebook = {
              id: crypto.randomUUID(),
              title: 'Imported Ebook',
              description: '',
              chapters: chapters.map((chapter, index) => ({
                id: crypto.randomUUID(),
                title: chapter.title,
                content: chapter.content,
                order: index
              })),
              template: 'imported',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'draft',
              format: 'pdf'
            };
            addEbook(newEbook);
            setShowImportModal(false);
            setCurrentEbook(newEbook);
          }}
          onClose={() => setShowImportModal(false)}
        />
      )}

      {showDeleteModal && ebookToDelete && (
        <DeleteConfirmModal
          ebook={ebookToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setEbookToDelete(null);
          }}
        />
      )}
    </div>
  );
}