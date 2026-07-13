import { create } from 'zustand';
import type { Settings } from '@/types/settings.types';

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  clearSettings: () => set({ settings: null }),
}));
