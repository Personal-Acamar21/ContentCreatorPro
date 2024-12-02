import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ebook, Chapter } from '../types/ebook';

interface EbookStore {
  ebooks: Ebook[];
  addEbook: (ebook: Ebook) => void;
  updateEbook: (id: string, ebook: Partial<Ebook>) => void;
  deleteEbook: (id: string) => void;
  addChapter: (ebookId: string, chapter: Chapter) => void;
  updateChapter: (ebookId: string, chapterId: string, chapter: Partial<Chapter>) => void;
  deleteChapter: (ebookId: string, chapterId: string) => void;
  reorderChapters: (ebookId: string, chapterIds: string[]) => void;
}

export const useEbookStore = create<EbookStore>()(
  persist(
    (set) => ({
      ebooks: [],
      addEbook: (ebook) =>
        set((state) => ({ ebooks: [...state.ebooks, ebook] })),
      updateEbook: (id, updatedEbook) =>
        set((state) => ({
          ebooks: state.ebooks.map((ebook) =>
            ebook.id === id ? { ...ebook, ...updatedEbook } : ebook
          ),
        })),
      deleteEbook: (id) =>
        set((state) => ({
          ebooks: state.ebooks.filter((ebook) => ebook.id !== id),
        })),
      addChapter: (ebookId, chapter) =>
        set((state) => ({
          ebooks: state.ebooks.map((ebook) =>
            ebook.id === ebookId
              ? { 
                  ...ebook, 
                  chapters: [...ebook.chapters, chapter].map((ch, idx) => ({
                    ...ch,
                    order: idx
                  }))
                }
              : ebook
          ),
        })),
      updateChapter: (ebookId, chapterId, updatedChapter) =>
        set((state) => ({
          ebooks: state.ebooks.map((ebook) =>
            ebook.id === ebookId
              ? {
                  ...ebook,
                  chapters: ebook.chapters.map((chapter) =>
                    chapter.id === chapterId
                      ? { ...chapter, ...updatedChapter }
                      : chapter
                  ),
                }
              : ebook
          ),
        })),
      deleteChapter: (ebookId, chapterId) =>
        set((state) => ({
          ebooks: state.ebooks.map((ebook) =>
            ebook.id === ebookId
              ? {
                  ...ebook,
                  chapters: ebook.chapters
                    .filter((chapter) => chapter.id !== chapterId)
                    .map((chapter, idx) => ({
                      ...chapter,
                      order: idx // Reorder remaining chapters
                    }))
                }
              : ebook
          ),
        })),
      reorderChapters: (ebookId, chapterIds) =>
        set((state) => ({
          ebooks: state.ebooks.map((ebook) =>
            ebook.id === ebookId
              ? {
                  ...ebook,
                  chapters: chapterIds
                    .map((id, index) => {
                      const chapter = ebook.chapters.find((c) => c.id === id);
                      return chapter ? { ...chapter, order: index } : null;
                    })
                    .filter((c): c is Chapter => c !== null),
                }
              : ebook
          ),
        })),
    }),
    {
      name: 'ebook-storage',
    }
  )
);