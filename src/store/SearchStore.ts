import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CategoryItem } from '@/types/category.types';

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'discount' | 'az';
export type DietaryFilter = 'all' | 'veg' | 'non-veg';

export interface SearchFilters {
 dietary: DietaryFilter;
 minPrice: number | null;
 maxPrice: number | null;
 inStockOnly: boolean;
 hasOffer: boolean;
 categoryId: string | null;
}

const defaultFilters: SearchFilters = {
 dietary: 'all',
 minPrice: null,
 maxPrice: null,
 inStockOnly: false,
 hasOffer: false,
 categoryId: null,
};

interface SearchState {
 query: string;
 debouncedQuery: string;
 searchHistory: string[];
 recentlyViewed: CategoryItem[];
 filters: SearchFilters;
 sortBy: SortOption;
 isFilterDrawerOpen: boolean;

 setQuery: (q: string) => void;
 setDebouncedQuery: (q: string) => void;
 addToHistory: (query: string) => void;
 removeFromHistory: (query: string) => void;
 clearHistory: () => void;
 addRecentlyViewed: (item: CategoryItem) => void;
 setFilters: (filters: Partial<SearchFilters>) => void;
 resetFilters: () => void;
 setSortBy: (sort: SortOption) => void;
 setFilterDrawerOpen: (open: boolean) => void;
}

export const useSearchStore = create<SearchState>()(
 persist(
 (set, get) => ({
 query: '',
 debouncedQuery: '',
 searchHistory: [],
 recentlyViewed: [],
 filters: defaultFilters,
 sortBy: 'popular',
 isFilterDrawerOpen: false,

 setQuery: (query) => set({ query }),
 setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery }),

 addToHistory: (query) => {
 const trimmed = query.trim();
 if (!trimmed) return;
 const prev = get().searchHistory.filter((h) => h !== trimmed);
 set({ searchHistory: [trimmed, ...prev].slice(0, 10) });
 },

 removeFromHistory: (query) =>
 set((s) => ({ searchHistory: s.searchHistory.filter((h) => h !== query) })),

 clearHistory: () => set({ searchHistory: [] }),

 addRecentlyViewed: (item) => {
 const prev = get().recentlyViewed.filter((i) => i._id !== item._id);
 set({ recentlyViewed: [item, ...prev].slice(0, 10) });
 },

 setFilters: (partial) =>
 set((s) => ({ filters: { ...s.filters, ...partial } })),

 resetFilters: () => set({ filters: defaultFilters }),

 setSortBy: (sortBy) => set({ sortBy }),

 setFilterDrawerOpen: (isFilterDrawerOpen) => set({ isFilterDrawerOpen }),
 }),
 {
 name: 'search-storage',
 partialize: (state) => ({
 searchHistory: state.searchHistory,
 recentlyViewed: state.recentlyViewed,
 }),
 }
 )
);
