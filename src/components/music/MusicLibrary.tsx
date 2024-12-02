import React, { useState } from 'react';
import { Play, Download, Filter, Search, AlertTriangle } from 'lucide-react';
import { musicLibrary, categories } from '../../data/musicLibrary';
import type { MusicTrack } from '../../types/music';
import AudioPlayer from './AudioPlayer';

interface MusicLibraryProps {
  onSelectTrack: (track: MusicTrack) => void;
}

export default function MusicLibrary({ onSelectTrack }: MusicLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const filteredTracks = musicLibrary.filter(track => {
    const matchesCategory = !selectedCategory || track.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (track: MusicTrack) => {
    try {
      const link = document.createElement('a');
      link.href = track.url;
      link.download = `${track.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download track. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracks..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="pl-4 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {playbackError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{playbackError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTracks.map(track => (
          <div
            key={track.id}
            className="bg-white rounded-lg border p-4 hover:border-primary-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{track.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 capitalize">
                    {track.category}
                  </span>
                  {track.artist && (
                    <>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {track.artist}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(track)}
                  className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onSelectTrack(track)}
                  className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                >
                  Use Track
                </button>
              </div>
            </div>

            {playingTrackId === track.id ? (
              <AudioPlayer
                url={track.url}
                onError={(error) => {
                  setPlaybackError(error);
                  setPlayingTrackId(null);
                }}
                onPlaybackStart={() => setPlaybackError(null)}
                onPlaybackEnd={() => setPlayingTrackId(null)}
              />
            ) : (
              <button
                onClick={() => setPlayingTrackId(track.id)}
                className="w-full px-4 py-2 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Preview Track
              </button>
            )}
          </div>
        ))}

        {filteredTracks.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No tracks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}