import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Wand2, RotateCw, Loader2, Layout, Smartphone, Monitor } from 'lucide-react';
import type { Chapter } from '../../types/ebook';
import { generateChapterContent } from '../../services/openai';
import { optimizeForDevice } from '../../services/ai/designAssistance';
import AIAssistant from './AIAssistant';
import ImageUploader from './ImageUploader';

interface EnhancedChapterEditorProps {
  chapter: Chapter;
  onSave: (updates: Partial<Chapter>) => void;
}

export default function EnhancedChapterEditor({ chapter, onSave }: EnhancedChapterEditorProps) {
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: chapter.content,
    onUpdate: ({ editor }) => {
      onSave({ content: editor.getHTML() });
    },
  });

  const handleAIGenerate = async () => {
    setIsGeneratingSuggestions(true);
    try {
      const content = await generateChapterContent(chapter.title, 'expand');
      if (content && editor) {
        editor.commands.setContent(content);
        onSave({ content });
      }
    } catch (error) {
      console.error('Failed to generate content:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleGenerateOutline = async () => {
    setIsGeneratingOutline(true);
    try {
      const outline = await generateChapterContent(chapter.title, 'outline');
      if (outline && editor) {
        editor.commands.setContent(outline);
        onSave({ content: outline });
      }
    } catch (error) {
      console.error('Failed to generate outline:', error);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleApplySuggestion = (suggestion: string) => {
    if (editor) {
      editor.commands.insertContent(suggestion);
    }
  };

  const handleDeviceChange = (device: 'mobile' | 'tablet' | 'desktop') => {
    setSelectedDevice(device);
    const styles = optimizeForDevice(chapter.content, device);
    // Apply device-specific styles to the editor
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      Object.assign(editorElement.style, styles);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={chapter.title}
          onChange={(e) => onSave({ title: e.target.value })}
          className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 px-0"
          placeholder="Chapter title..."
        />
        <div className="flex gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <button
              onClick={() => handleDeviceChange('mobile')}
              className={`p-2 rounded-lg ${
                selectedDevice === 'mobile' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeviceChange('tablet')}
              className={`p-2 rounded-lg ${
                selectedDevice === 'tablet' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Tablet View"
            >
              <Layout className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeviceChange('desktop')}
              className={`p-2 rounded-lg ${
                selectedDevice === 'desktop' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              showAIAssistant 
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            AI Assistant
          </button>
          <button
            onClick={handleAIGenerate}
            disabled={isGeneratingSuggestions || isGeneratingOutline}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 disabled:opacity-50"
          >
            {isGeneratingSuggestions ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            AI Suggestions
          </button>
          <button
            onClick={handleGenerateOutline}
            disabled={isGeneratingSuggestions || isGeneratingOutline}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 disabled:opacity-50"
          >
            {isGeneratingOutline ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCw className="w-4 h-4" />
            )}
            Generate Outline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${showAIAssistant ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="mb-4">
            <ImageUploader
              currentImage={chapter.image}
              onImageSelect={(url) => onSave({ image: url })}
              onImageRemove={() => onSave({ image: undefined })}
              aspectRatio="chapter"
            />
          </div>
          <EditorContent
            editor={editor}
            className="prose max-w-none border rounded-lg p-4 min-h-[300px]"
          />
        </div>
        
        {showAIAssistant && (
          <div className="lg:col-span-1">
            <AIAssistant
              content={chapter.content}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        )}
      </div>
    </div>
  );
}