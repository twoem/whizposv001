import { create } from 'zustand';
import { UserRole } from '../shared/types';

interface AuthState {
  role: UserRole | null;
  userName: string | null;
  mode: 'server' | 'outlet';
  isAuthenticated: boolean;
  setRole: (role: UserRole | null) => void;
  setUserName: (name: string | null) => void;
  setMode: (mode: 'server' | 'outlet') => void;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  userName: null,
  mode: 'server',
  isAuthenticated: false,
  setRole: (role) => set({ role }),
  setUserName: (userName) => set({ userName }),
  setMode: (mode) => set({ mode }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  logout: () => set({ role: null, userName: null, isAuthenticated: false }),
}));
