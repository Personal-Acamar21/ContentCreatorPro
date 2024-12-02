import React from 'react';
import { Settings2, Calendar, Tags, Globe2 } from 'lucide-react';

interface BlogSettingsProps {
  published: boolean;
  scheduledDate?: string;
  categories: string[];
  onUpdate: (updates: {
    published: boolean;
    scheduledDate?: string;
    categories: string[];
  }) => void;
}

export default function BlogSettings({ published, scheduledDate, categories, onUpdate }: BlogSettingsProps) {
  const availableCategories = [
    'Technology',
    'Business',
    'Marketing',
    'Design',
    'Development',
    'Tutorial',
    'News',
    'Opinion'
  ];

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Settings2 className="w-5 h-5" />
        <h3>Post Settings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => onUpdate({ published: e.target.checked, scheduledDate, categories })}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Publish post</span>
          </label>
        </div>

        {!published && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Publication
              </div>
            </label>
            <input
              type="datetime-local"
              value={scheduledDate?.slice(0, 16) || ''}
              onChange={(e) => onUpdate({ published, scheduledDate: e.target.value, categories })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              Categories
            </div>
          </label>
          <div className="space-y-2">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...categories, category]
                      : categories.filter(c => c !== category);
                    onUpdate({ published, scheduledDate, categories: newCategories });
                  }}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Visibility</span>
          </div>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={published ? 'public' : 'private'}
            onChange={(e) => onUpdate({ 
              published: e.target.value === 'public',
              scheduledDate,
              categories
            })}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>
    </div>
  );
}