import React, { useState } from 'react';
import { Search, Globe, Share2, Image as ImageIcon, Upload, X } from 'lucide-react';
import ImageGallery from '../ImageGallery';

interface BlogSEOProps {
  title: string;
  content: string;
  onUpdate: (updates: { 
    title: string; 
    excerpt: string; 
    keywords: string[];
    socialImage?: string;
  }) => void;
}

export default function BlogSEO({ title, content, onUpdate }: BlogSEOProps) {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [socialImage, setSocialImage] = useState<string>('');
  const plainText = content.replace(/<[^>]*>/g, '');
  const excerpt = plainText.slice(0, 160);
  const suggestedKeywords = extractKeywords(plainText);

  function extractKeywords(text: string): string[] {
    // Simple keyword extraction (in a real app, use NLP or AI)
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['this', 'that', 'with', 'from'].includes(word));
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  const handleImageSelect = (url: string) => {
    setSocialImage(url);
    onUpdate({ title, excerpt, keywords: suggestedKeywords, socialImage: url });
    setShowImageGallery(false);
  };

  const handleRemoveImage = () => {
    setSocialImage('');
    onUpdate({ title, excerpt, keywords: suggestedKeywords, socialImage: '' });
  };

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Globe className="w-5 h-5" />
        <h3>SEO Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate({ 
              title: e.target.value, 
              excerpt, 
              keywords: suggestedKeywords,
              socialImage 
            })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter SEO-friendly title"
          />
          <p className="mt-1 text-sm text-gray-500">
            {title.length}/60 characters (recommended)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => onUpdate({ 
              title, 
              excerpt: e.target.value, 
              keywords: suggestedKeywords,
              socialImage
            })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Enter meta description"
          />
          <p className="mt-1 text-sm text-gray-500">
            {excerpt.length}/160 characters (recommended)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Search className="w-4 h-4" />
            Search Preview
          </h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-[#1a0dab] text-xl hover:underline cursor-pointer">
              {title || 'Untitled Post'}
            </div>
            <div className="text-sm text-green-700 my-1">
              example.com › blog › {title?.toLowerCase().replace(/\s+/g, '-')}
            </div>
            <p className="text-sm text-gray-600">
              {excerpt}...
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Social Media Preview
            </div>
            <button
              onClick={() => setShowImageGallery(true)}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
            >
              <Upload className="w-4 h-4" />
              Change Image
            </button>
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {socialImage ? (
                <>
                  <img
                    src={socialImage}
                    alt="Social preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="font-medium text-gray-900 mb-1">
                {title || 'Untitled Post'}
              </div>
              <p className="text-sm text-gray-500">
                {excerpt}...
              </p>
              <div className="text-xs text-gray-400 mt-2">
                example.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {showImageGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Choose Social Image</h3>
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ImageGallery onImageSelect={handleImageSelect} />
          </div>
        </div>
      )}
    </div>
  );
}