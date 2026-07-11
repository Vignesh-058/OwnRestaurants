import { useWishlistStore } from '@/store/WishlistStore';
// Removed unused CategoryItem import

export const useRecentlyViewed = () => {
 const store = useWishlistStore();

 return {
 recentlyViewed: store.recentlyViewed,
 addRecentlyViewed: store.addRecentlyViewed,
 };
};
