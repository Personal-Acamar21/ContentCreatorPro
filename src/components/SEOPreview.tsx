import React from 'react';
import { Search } from 'lucide-react';

interface SEOPreviewProps {
  title: string;
  content: string;
}

export default function SEOPreview({ title, content }: SEOPreviewProps) {
  const metaDescription = content
    .replace(/<[^>]*>/g, '')
    .slice(0, 160);

  return (
    <div className="bg-white p-4 rounded-lg border space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Search className="w-4 h-4" />
        <span>Search Preview</span>
      </div>
      
      <div className="space-y-1">
        <h2 className="text-[#1a0dab] text-xl hover:underline cursor-pointer truncate">
          {title || 'Untitled Post'}
        </h2>
        <div className="text-sm text-gray-600">
          example.com › blog › {title?.toLowerCase().replace(/\s+/g, '-')}
        </div>
        <p className="text-sm text-gray-800 line-clamp-2">
          {metaDescription}...
        </p>
      </div>
    </div>
  );
}