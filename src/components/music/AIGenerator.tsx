import React, { useState } from 'react';
import { Wand2, Loader2, Music, Sliders } from 'lucide-react';
import type { MusicGenerationParams } from '../../services/ai/musicGeneration';

interface AIGeneratorProps {
  onGenerate: (params: MusicGenerationParams) => Promise<void>;
  isGenerating: boolean;
}

export default function AIGenerator({ onGenerate, isGenerating }: AIGeneratorProps) {
  const [params, setParams] = useState<MusicGenerationParams>({
    genre: 'ambient',
    mood: 'calm',
    tempo: 'medium',
    duration: 30
  });

  const genres = [
    'ambient', 'classical', 'electronic', 'jazz', 
    'meditation', 'piano', 'spiritual', 'world'
  ];

  const moods = [
    'calm', 'energetic', 'happy', 'inspirational', 
    'peaceful', 'relaxing', 'uplifting'
  ];

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Wand2 className="w-5 h-5 text-primary-600" />
        <h3>AI Music Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            value={params.genre}
            onChange={(e) => setParams({ ...params, genre: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mood
          </label>
          <select
            value={params.mood}
            onChange={(e) => setParams({ ...params, mood: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {moods.map((mood) => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tempo
          </label>
          <select
            value={params.tempo}
            onChange={(e) => setParams({ ...params, tempo: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (seconds)
          </label>
          <select
            value={params.duration}
            onChange={(e) => setParams({ ...params, duration: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="180">3 minutes</option>
          </select>
        </div>

        <button
          onClick={() => onGenerate(params)}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Music className="w-5 h-5" />
              Generate Music
            </>
          )}
        </button>
      </div>
    </div>
  );
}