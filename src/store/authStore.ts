import { create } from 'zustand';
import { UserRole } from '../shared/types';

interface AuthState {
  role: UserRole | null;
  mode: 'server' | 'outlet';
  isAuthenticated: boolean;
  setRole: (role: UserRole | null) => void;
  setMode: (mode: 'server' | 'outlet') => void;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  mode: 'server',
  isAuthenticated: false,
  setRole: (role) => set({ role }),
  setMode: (mode) => set({ mode }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  logout: () => set({ role: null, isAuthenticated: false }),
}));
