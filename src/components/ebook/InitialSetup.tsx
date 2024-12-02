import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import type { EbookTemplate } from '../../types/ebook';
import ImageUploader from './ImageUploader';

interface InitialSetupProps {
  template: EbookTemplate;
  onComplete: (data: { 
    title: string; 
    description: string; 
    coverImage: string;
    chapters: { title: string; description: string }[] 
  }) => void;
  onCancel: () => void;
}

export default function InitialSetup({ template, onComplete, onCancel }: InitialSetupProps) {
  const [title, setTitle] = useState(template.structure.title);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [chapters, setChapters] = useState(template.structure.chapters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      title,
      description,
      coverImage,
      chapters
    });
  };

  const handleAddChapter = () => {
    setChapters([
      ...chapters,
      {
        title: `Chapter ${chapters.length + 1}`,
        description: ''
      }
    ]);
  };

  const handleUpdateChapter = (index: number, field: 'title' | 'description', value: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      [field]: value
    };
    setChapters(updatedChapters);
  };

  const handleRemoveChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Set Up Your Ebook</h2>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ebook Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your ebook title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Brief description of your ebook"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <ImageUploader
                currentImage={coverImage}
                onImageSelect={setCoverImage}
                onImageRemove={() => setCoverImage('')}
                aspectRatio="cover"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Chapters
              </label>
              <button
                type="button"
                onClick={handleAddChapter}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add Chapter
              </button>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 mr-4">
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => handleUpdateChapter(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Chapter title"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={chapter.description}
                    onChange={(e) => handleUpdateChapter(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={2}
                    placeholder="Brief chapter description"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Ebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}