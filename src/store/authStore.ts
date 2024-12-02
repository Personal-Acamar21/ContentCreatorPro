import { create } from 'zustand';
import { User } from 'firebase/auth';
import { onAuthChange, signInAnonymous } from '../services/firebase/auth';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  isLocalMode: boolean;
  setUser: (user: User | null) => void;
  setLocalMode: (isLocal: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLocalMode: false,
      setUser: (user) => set({ user }),
      setLocalMode: (isLocal) => set({ isLocalMode: isLocal }),
      initialize: async () => {
        try {
          const user = await signInAnonymous();
          if (!user) {
            set({ isLocalMode: true });
          }
          set({ user });
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({ isLocalMode: true });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Initialize auth state
useAuthStore.getState().initialize();

// Subscribe to auth state changes
onAuthChange((user) => {
  useAuthStore.getState().setUser(user);
});