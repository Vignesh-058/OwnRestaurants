import { useWishlistStore } from '@/store/WishlistStore';
import type { CategoryItem } from '@/types/category.types';

export const useWishlist = () => {
 const store = useWishlistStore();

 const toggleWishlist = (product: CategoryItem) => {
 if (store.isInWishlist(product._id)) {
 store.removeFromWishlist(product._id);
 } else {
 store.addToWishlist(product);
 }
 };

 return {
 wishlistItems: store.items,
 wishlistCount: store.items.length,
 addToWishlist: store.addToWishlist,
 removeFromWishlist: store.removeFromWishlist,
 clearWishlist: store.clearWishlist,
 isInWishlist: store.isInWishlist,
 toggleWishlist,
 };
};
