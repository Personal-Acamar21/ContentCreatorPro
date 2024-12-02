import React, { useState } from 'react';
import { Wand2, Sparkles, Layout, AlertTriangle, Loader2 } from 'lucide-react';
import { analyzeContent, improveContent, generateSuggestions } from '../../services/ai/contentAnalysis';
import type { ContentSuggestion } from '../../services/ai/contentAnalysis';

interface AIAssistantProps {
  content: string;
  onApplySuggestion: (suggestion: string) => void;
}

export default function AIAssistant({ content, onApplySuggestion }: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<'analyze' | 'improve' | 'suggest'>('analyze');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please add some content before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSuggestions([]);
    
    try {
      const analysis = await analyzeContent(content);
      setSuggestions(analysis.suggestions);
      setReadabilityScore(analysis.readabilityScore);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async () => {
    if (!content.trim()) {
      setError('Please add some content before improving.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const improvedContent = await improveContent(content);
      onApplySuggestion(improvedContent);
    } catch (error) {
      console.error('Improvement error:', error);
      setError('Failed to improve content. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateSuggestions = async () => {
    if (!content.trim()) {
      setError('Please add some content to get suggestions.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const suggestions = await generateSuggestions(content, 'expand');
      onApplySuggestion(suggestions);
    } catch (error) {
      console.error('Suggestion error:', error);
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">AI Writing Assistant</h3>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
              activeTab === 'analyze'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab('improve')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
              activeTab === 'improve'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Improve
          </button>
          <button
            onClick={() => setActiveTab('suggest')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
              activeTab === 'suggest'
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Layout className="w-4 h-4" />
            Suggest
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={() => {
            switch (activeTab) {
              case 'analyze':
                handleAnalyze();
                break;
              case 'improve':
                handleImprove();
                break;
              case 'suggest':
                handleGenerateSuggestions();
                break;
            }
          }}
          disabled={isAnalyzing || !content}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              {activeTab === 'analyze' ? 'Analyze Content' : 
               activeTab === 'improve' ? 'Improve Content' : 
               'Get Suggestions'}
            </>
          )}
        </button>

        {readabilityScore !== null && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">Readability Score</div>
            <div className="mt-2 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div className="text-xs font-semibold text-primary-700">
                  {Math.round(readabilityScore)}%
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${readabilityScore}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:border-primary-300 transition-all duration-200"
            >
              {suggestion.original && (
                <div className="text-sm text-gray-600 mb-2">
                  Original: {suggestion.original}
                </div>
              )}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{suggestion.suggestion}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Type: {suggestion.type}
                  </div>
                </div>
                <button
                  onClick={() => onApplySuggestion(suggestion.suggestion)}
                  className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>

        {!isAnalyzing && suggestions.length === 0 && !error && (
          <div className="text-center text-gray-500 py-8">
            Click the button above to {activeTab === 'analyze' ? 'analyze your content' : 
                                    activeTab === 'improve' ? 'improve your content' : 
                                    'get content suggestions'}
          </div>
        )}
      </div>
    </div>
  );
}