import React from 'react';
import { X, BookOpen, ArrowRight, Plus } from 'lucide-react';
import type { EbookTemplate } from '../../types/ebook';

interface TemplateSelectorProps {
  templates: EbookTemplate[];
  onSelect: (template: EbookTemplate) => void;
  onClose: () => void;
}

export default function TemplateSelector({ templates, onSelect, onClose }: TemplateSelectorProps) {
  const handleCustomTemplate = () => {
    const customTemplate: EbookTemplate = {
      id: 'custom',
      name: 'Custom Template',
      description: 'Start with a blank template and create your own structure',
      structure: {
        title: '',
        chapters: [
          {
            title: 'Introduction',
            description: 'Start your ebook here'
          }
        ]
      }
    };
    onSelect(customTemplate);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
            <p className="text-gray-500 mt-1">Select a template or start from scratch</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Custom Template Option */}
          <div
            onClick={handleCustomTemplate}
            className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-dashed border-primary-300 p-6 hover:border-primary-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white rounded-full">
                  <Plus className="w-6 h-6 text-primary-600" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Custom Ebook
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                Start from scratch and create your own custom structure
              </p>

              <button className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-primary-600 rounded-lg border border-primary-300 hover:bg-primary-50 transition-colors duration-200">
                Start Fresh
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Existing Templates */}
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelect(template)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-50 rounded-full">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                    {template.structure.chapters.length} chapters
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {template.description}
                </p>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Sample Structure:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {template.structure.chapters.slice(0, 3).map((chapter, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs mr-2">
                          {index + 1}
                        </span>
                        {chapter.title}
                      </li>
                    ))}
                    {template.structure.chapters.length > 3 && (
                      <li className="text-gray-500 italic pl-6">
                        +{template.structure.chapters.length - 3} more chapters
                      </li>
                    )}
                  </ul>
                </div>

                <button className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
                  Use Template
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}