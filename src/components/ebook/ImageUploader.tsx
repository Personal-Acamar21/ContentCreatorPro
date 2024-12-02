import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelect: (url: string) => void;
  onImageRemove: () => void;
  aspectRatio?: 'cover' | 'chapter';
  className?: string;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=700&fit=crop',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=700&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=700&fit=crop',
];

export default function ImageUploader({ 
  currentImage, 
  onImageSelect, 
  onImageRemove,
  aspectRatio = 'cover',
  className = ''
}: ImageUploaderProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      onImageSelect(imageUrl);
      setImageUrl('');
      setShowGallery(false);
    }
  };

  return (
    <div className={className}>
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Selected"
            className={`w-full ${
              aspectRatio === 'cover' 
                ? 'aspect-[2/3] object-cover' 
                : 'aspect-video object-cover'
            } rounded-lg`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={onImageRemove}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowGallery(true)}
          className={`w-full ${
            aspectRatio === 'cover' ? 'aspect-[2/3]' : 'aspect-video'
          } border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200`}
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-500">Click to add image</span>
        </button>
      )}

      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Choose Image</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {sampleImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onImageSelect(url);
                    setShowGallery(false);
                  }}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden group"
                >
                  <img
                    src={url}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter image URL..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}