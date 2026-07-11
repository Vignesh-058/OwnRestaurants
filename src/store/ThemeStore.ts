import { create } from 'zustand';

interface ThemeState {
 theme: any | null;
 setTheme: (theme: any) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
 theme: null,
 setTheme: (theme) => set({ theme }),
}));
