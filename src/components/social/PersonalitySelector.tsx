import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { brandPersonalities } from '../../data/personalities';
import type { BrandPersonality } from '../../types/social';

interface PersonalitySelectorProps {
  selectedId?: string;
  onSelect: (personality: BrandPersonality) => void;
}

export default function PersonalitySelector({ selectedId, onSelect }: PersonalitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedPersonality = brandPersonalities.find(p => p.id === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-primary-300 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <span className="text-gray-700">
            {selectedPersonality ? (
              <span className="flex items-center gap-2">
                <span>{selectedPersonality.emoji}</span>
                {selectedPersonality.name}
              </span>
            ) : (
              'Select AI Personality'
            )}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2 grid gap-2">
            {brandPersonalities.map((personality) => (
              <button
                key={personality.id}
                onClick={() => {
                  onSelect(personality);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 hover:bg-primary-50 ${
                  selectedId === personality.id ? 'bg-primary-50 border-primary-200' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{personality.emoji}</span>
                  <span className="font-medium">{personality.name}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{personality.description}</p>
                <div className="flex flex-wrap gap-2">
                  {personality.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}