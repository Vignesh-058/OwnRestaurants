import { useWishlistStore } from '@/store/WishlistStore';
import { toast } from 'sonner';
import type { CategoryItem } from '@/types/category.types';

export const useWishlist = () => {
 const store = useWishlistStore();

 const toggleWishlist = (product: CategoryItem) => {
 if (store.isInWishlist(product._id)) {
 store.removeFromWishlist(product._id);
 toast.success('Removed from Wishlist', {
 description: `${product.name} has been removed.`,
 });
 } else {
 store.addToWishlist(product);
 toast.success('Added to Wishlist', {
 description: `${product.name} has been added.`,
 icon: '❤️',
 });
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
