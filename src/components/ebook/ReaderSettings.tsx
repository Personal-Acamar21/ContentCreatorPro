import React from 'react';
import { Settings2, Type, PaintBucket, Accessibility } from 'lucide-react';
import type { ReaderProfile } from '../../types/ebook';

interface ReaderSettingsProps {
  profile: ReaderProfile;
  onUpdate: (profile: ReaderProfile) => void;
}

export default function ReaderSettings({ profile, onUpdate }: ReaderSettingsProps) {
  const fontSizes = ['14px', '16px', '18px', '20px', '24px'];
  const fontFamilies = [
    { name: 'System Default', value: 'system-ui, sans-serif' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Sans Serif', value: 'Arial, sans-serif' },
    { name: 'OpenDyslexic', value: 'OpenDyslexic, sans-serif' }
  ];

  return (
    <div className="bg-white rounded-lg border p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium">Reader Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4" />
            Typography
          </label>
          <div className="space-y-3">
            <select
              value={profile.preferences.fontSize}
              onChange={(e) => onUpdate({
                ...profile,
                preferences: { ...profile.preferences, fontSize: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>

            <select
              value={profile.preferences.fontFamily}
              onChange={(e) => onUpdate({
                ...profile,
                preferences: { ...profile.preferences, fontFamily: e.target.value }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value}>{font.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <PaintBucket className="w-4 h-4" />
            Theme
          </label>
          <div className="flex gap-2">
            {['light', 'dark', 'sepia'].map(theme => (
              <button
                key={theme}
                onClick={() => onUpdate({
                  ...profile,
                  preferences: { ...profile.preferences, theme: theme as any }
                })}
                className={`flex-1 px-3 py-2 rounded-lg capitalize ${
                  profile.preferences.theme === theme
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Accessibility className="w-4 h-4" />
            Accessibility
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={profile.accessibility.highContrast}
                onChange={(e) => onUpdate({
                  ...profile,
                  accessibility: { ...profile.accessibility, highContrast: e.target.checked }
                })}
                className="rounded text-primary-600"
              />
              <span className="text-sm">High Contrast</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={profile.accessibility.dyslexicFont}
                onChange={(e) => onUpdate({
                  ...profile,
                  accessibility: { ...profile.accessibility, dyslexicFont: e.target.checked }
                })}
                className="rounded text-primary-600"
              />
              <span className="text-sm">Dyslexic-friendly Font</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}