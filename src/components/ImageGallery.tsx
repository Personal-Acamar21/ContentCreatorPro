import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageGalleryProps {
  onImageSelect: (url: string) => void;
}

export default function ImageGallery({ onImageSelect }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unsplashImages = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
    'https://images.unsplash.com/photo-1682687221038-404670f09561',
    'https://images.unsplash.com/photo-1682687220063-4742bd7fd538'
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-gray-200"
        title="Add Image"
      >
        <ImageIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-lg shadow-xl border p-4 z-20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Insert Image</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search Unsplash images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {unsplashImages.map((url, index) => (
                <img
                  key={index}
                  src={`${url}?w=200&h=200&fit=crop`}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-75"
                  onClick={() => {
                    onImageSelect(url);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center border-t pt-4">
              <button
                onClick={() => {
                  const url = window.prompt('Enter image URL');
                  if (url) {
                    onImageSelect(url);
                    setIsOpen(false);
                  }
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Upload className="w-4 h-4" />
                Upload from URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}