import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Wand2, RotateCw, Loader2 } from 'lucide-react';
import type { Chapter } from '../../types/ebook';
import { generateChapterContent } from '../../services/openai';

interface ChapterEditorProps {
  chapter: Chapter;
  onSave: (updates: Partial<Chapter>) => void;
}

export default function ChapterEditor({ chapter, onSave }: ChapterEditorProps) {
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  
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
          <button
            onClick={handleAIGenerate}
            disabled={isGeneratingSuggestions || isGeneratingOutline}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 disabled:opacity-50"
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
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 disabled:opacity-50"
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

      <EditorContent
        editor={editor}
        className="prose max-w-none border rounded-lg p-4 min-h-[300px]"
      />
    </div>
  );
}