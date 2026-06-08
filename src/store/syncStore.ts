import { create } from 'zustand';

interface SyncItem {
  id: string;
  type: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  timestamp: string;
}

interface SyncState {
  queue: SyncItem[];
  isSyncing: boolean;
  lastSyncTime: string | null;
  addToQueue: (item: SyncItem) => void;
  removeFromQueue: (id: string) => void;
  setIsSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: string) => void;
  clearQueue: () => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  queue: [],
  isSyncing: false,
  lastSyncTime: null,
  addToQueue: (item) => set((state) => ({
    queue: [...state.queue, item]
  })),
  removeFromQueue: (id) => set((state) => ({
    queue: state.queue.filter(item => item.id !== id)
  })),
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
  clearQueue: () => set({ queue: [] }),
}));
