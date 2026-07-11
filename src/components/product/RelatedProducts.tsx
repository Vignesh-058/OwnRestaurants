import { ProductCard } from './ProductCard';
import type { CategoryItem } from '@/types/category.types';

interface RelatedProductsProps {
 products: CategoryItem[];
 onProductClick: (product: CategoryItem) => void;
}

export const RelatedProducts = ({ products, onProductClick }: RelatedProductsProps) => {
 if (!products || products.length === 0) return null;

 return (
 <div className="w-full mt-10">
 <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-6 px-4 md:px-8">
 Recommended For You
 </h3>
 <div className="flex overflow-x-auto gap-4 hide-scrollbar snap-x snap-mandatory px-4 md:px-8 pb-8">
 {products.map((product) => (
 <div key={product._id} className="snap-center w-[280px] shrink-0">
 <ProductCard product={product} onClick={onProductClick} />
 </div>
 ))}
 </div>
 </div>
 );
};
