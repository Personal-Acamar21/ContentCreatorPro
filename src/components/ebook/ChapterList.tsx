import React from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useEbookStore } from '../../store/ebookStore';
import type { Chapter } from '../../types/ebook';

interface ChapterListProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onChapterSelect: (chapter: Chapter) => void;
  ebookId: string;
}

export default function ChapterList({
  chapters,
  currentChapterId,
  onChapterSelect,
  ebookId
}: ChapterListProps) {
  const { addChapter, deleteChapter, reorderChapters } = useEbookStore();

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: 'New Chapter',
      content: '',
      order: chapters.length
    };
    addChapter(ebookId, newChapter);
    onChapterSelect(newChapter);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      deleteChapter(ebookId, chapterId);
      if (currentChapterId === chapterId) {
        const remainingChapters = chapters.filter(ch => ch.id !== chapterId);
        if (remainingChapters.length > 0) {
          onChapterSelect(remainingChapters[0]);
        }
      }
    }
  };

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Chapters</h3>
        <button
          onClick={handleAddChapter}
          className="p-2 text-primary-600 hover:bg-primary-50 rounded-full"
          title="Add Chapter"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {sortedChapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer group ${
              currentChapterId === chapter.id
                ? 'bg-primary-50 text-primary-700'
                : 'hover:bg-gray-50'
            }`}
          >
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
            <div
              className="flex-1"
              onClick={() => onChapterSelect(chapter)}
            >
              {chapter.title}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChapter(chapter.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {chapters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No chapters yet. Click the + button to add one.
          </div>
        )}
      </div>
    </div>
  );
}