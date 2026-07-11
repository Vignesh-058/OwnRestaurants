import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CategoryItem } from '@/types/category.types';

interface WishlistState {
 items: CategoryItem[];
 recentlyViewed: CategoryItem[];

 // Actions
 addToWishlist: (item: CategoryItem) => void;
 removeFromWishlist: (id: string) => void;
 clearWishlist: () => void;
 isInWishlist: (id: string) => boolean;

 addRecentlyViewed: (item: CategoryItem) => void;
}

export const useWishlistStore = create<WishlistState>()(
 persist(
 (set, get) => ({
 items: [],
 recentlyViewed: [],

 addToWishlist: (item) => {
 const { items } = get();
 if (!items.find((i) => i._id === item._id)) {
 set({ items: [item, ...items] });
 }
 },

 removeFromWishlist: (id) => {
 set((state) => ({
 items: state.items.filter((item) => item._id !== id),
 }));
 },

 clearWishlist: () => {
 set({ items: [] });
 },

 isInWishlist: (id) => {
 return get().items.some((item) => item._id === id);
 },

 addRecentlyViewed: (item) => {
 const { recentlyViewed } = get();
 // Remove if it already exists, so we can push it to the top
 const filtered = recentlyViewed.filter((i) => i._id !== item._id);
 set({
 recentlyViewed: [item, ...filtered].slice(0, 20), // Keep last 20
 });
 },
 }),
 {
 name: 'wishlist-storage', // Key in local storage
 }
 )
);
