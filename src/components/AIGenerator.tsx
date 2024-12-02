import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { BlogTemplate, AIGenerationParams } from '../types/blog';
import { templates } from '../data/templates';

interface AIGeneratorProps {
  onGenerate: (content: { title: string; content: string }) => void;
}

export default function AIGenerator({ onGenerate }: AIGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [params, setParams] = useState<AIGenerationParams>({
    topic: '',
    template: templates[0],
    tone: 'professional',
    length: 'medium',
    keywords: [],
    targetAudience: '',
  });

  const handleGenerate = async () => {
    if (!params.topic) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      const data = await response.json();
      onGenerate(data);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold">AI Content Generator</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Topic
          <input
            type="text"
            value={params.topic}
            onChange={(e) => setParams({ ...params, topic: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your topic"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Template
          <select
            value={params.template.id}
            onChange={(e) => {
              const template = templates.find((t) => t.id === e.target.value);
              if (template) setParams({ ...params, template });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tone
            <select
              value={params.tone}
              onChange={(e) => setParams({ ...params, tone: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="academic">Academic</option>
              <option value="conversational">Conversational</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Length
            <select
              value={params.length}
              onChange={(e) => setParams({ ...params, length: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="short">Short (~500 words)</option>
              <option value="medium">Medium (~1000 words)</option>
              <option value="long">Long (~2000 words)</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Keywords (comma-separated)
          <input
            type="text"
            value={params.keywords?.join(', ')}
            onChange={(e) => setParams({
              ...params,
              keywords: e.target.value.split(',').map(k => k.trim())
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter keywords"
          />
        </label>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !params.topic}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="-ml-1 mr-2 h-4 w-4" />
            Generate Content
          </>
        )}
      </button>
    </div>
  );
}