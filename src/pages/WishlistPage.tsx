import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
// Removed useAuthStore import
import { WishlistCard } from '@/components/wishlist/WishlistCard';
import { EmptyWishlist } from '@/components/wishlist/EmptyWishlist';
import { RecentlyViewed } from '@/components/wishlist/RecentlyViewed';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CategoryItem } from '@/types/category.types';

export const WishlistPage = () => {
 const navigate = useNavigate();
 const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();

 useEffect(() => {
 window.scrollTo(0, 0);
 }, []);

 const handleProductClick = (product: CategoryItem) => {
 navigate(`/product/${product._id}`);
 };

 return (
 <div className="bg-background min-h-screen py-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {wishlistCount > 0 ? (
 <div className="space-y-8">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1f2937] p-6 rounded-3xl shadow-sm border border-[#E5E7EB] dark:border-gray-800">
 <div className="flex items-center gap-4">
 <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
 <Heart className="h-7 w-7 text-red-500 fill-current" />
 </div>
 <div>
 <h1 className="text-3xl font-black text-[#111827] dark:text-white tracking-tight">My Wishlist</h1>
 <p className="text-muted-foreground text-sm font-medium mt-1">
 {wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved
 </p>
 </div>
 </div>
 
 <Button 
 variant="outline" 
 className="rounded-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
 onClick={() => {
 if (confirm('Are you sure you want to clear your wishlist?')) {
 clearWishlist();
 }
 }}
 >
 <Trash2 className="h-4 w-4" /> Clear All
 </Button>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
 {wishlistItems.map((product) => (
 <WishlistCard 
 key={product._id} 
 product={product} 
 onRemove={removeFromWishlist}
 onClick={handleProductClick}
 />
 ))}
 </div>
 
 <div className="pt-10 border-t border-[#E5E7EB] dark:border-white/10">
 <RecentlyViewed />
 </div>
 </div>
 ) : (
 <div className="space-y-12">
 <EmptyWishlist />
 <RecentlyViewed />
 </div>
 )}
 </div>
 </div>
 );
};
