import { ProductCard } from './ProductCard';
import type { CategoryItem } from '@/types/category.types';

interface ProductGridProps {
 products: CategoryItem[];
 onProductClick: (product: CategoryItem) => void;
 title?: string;
}

export const ProductGrid = ({ products, onProductClick, title }: ProductGridProps) => {
 if (!products || products.length === 0) return null;

 return (
 <div className="w-full py-10 bg-background">
 <div className="max-w-7xl mx-auto px-4 md:px-8">
 {title && (
 <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-8">{title}</h2>
 )}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
 {products.map((product) => (
 <ProductCard 
 key={product._id} 
 product={product} 
 onClick={onProductClick} 
 />
 ))}
 </div>
 </div>
 </div>
 );
};
