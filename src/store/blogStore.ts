import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost } from '../types/blog';

interface BlogStore {
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => BlogPost | undefined;
}

export const useBlogStore = create<BlogStore>()(
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
      name: 'blog-storage',
    }
  )
);