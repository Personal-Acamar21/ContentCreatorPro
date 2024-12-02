import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SocialPost } from '../types/social';

interface SocialStore {
  posts: SocialPost[];
  addPost: (post: SocialPost) => void;
  updatePost: (id: string, post: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => SocialPost | undefined;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      posts: [],
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      updatePost: (id, updatedPost) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === id ? { ...post, ...updatedPost } : post
          ),
        })),
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),
      getPost: (id) => get().posts.find((post) => post.id === id),
    }),
    {
      name: 'social-storage',
    }
  )
);