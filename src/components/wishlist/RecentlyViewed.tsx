import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { useNavigate } from 'react-router-dom';
import type { CategoryItem } from '@/types/category.types';

export const RecentlyViewed = () => {
 const { recentlyViewed } = useRecentlyViewed();
 const navigate = useNavigate();

 if (!recentlyViewed || recentlyViewed.length === 0) return null;

 const handleProductClick = (product: CategoryItem) => {
 navigate(`/product/${product._id}`);
 };

 return (
 <div className="mt-16">
 <h2 className="text-2xl font-black text-[#111827] dark:text-white mb-6">Recently Viewed</h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
 {recentlyViewed.slice(0, 10).map((product) => (
 <ProductCard 
 key={`rv-${product._id}`} 
 product={product} 
 onClick={handleProductClick} 
 />
 ))}
 </div>
 </div>
 );
};
