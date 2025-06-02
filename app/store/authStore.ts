import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthActions {
  login: (accessToken: string, user: User, refreshToken?: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  updateToken: (accessToken: string) => void;
  initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

// the store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (accessToken: string, user: User, refreshToken?: string) => {
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken: refreshToken || null,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      updateToken: (accessToken: string) => {
        set({ accessToken });
      },

      initializeAuth: () => {
        const state = get();
        console.log('Auth initialized:', state.isAuthenticated);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// Stable selectors - these are the key to avoiding infinite loops
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);

// Fixed: Use individual action selectors instead of creating new objects
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useUpdateToken = () => useAuthStore((state) => state.updateToken);
export const useInitializeAuth = () => useAuthStore((state) => state.initializeAuth);