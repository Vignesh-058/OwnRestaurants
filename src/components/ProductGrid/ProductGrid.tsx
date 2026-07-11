import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import type { CategoryItem } from '@/types/category.types';

interface ProductGridProps {
 products: CategoryItem[];
 onProductClick: (product: CategoryItem) => void;
 title?: string;
}

export const ProductGrid = ({ products, onProductClick, title }: ProductGridProps) => {
 if (!products || products.length === 0) {
 return null; // Handled by EmptyState upstream, or we can just return null
 }

 return (
 <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 my-10">
 {title && (
 <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-foreground">
 {title}
 </h2>
 )}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 auto-rows-fr">
 {products.map((product, index) => (
 <motion.div
 key={product._id}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-50px" }}
 transition={{ delay: (index % 4) * 0.1, duration: 0.5, ease: "easeOut" }}
 className="h-full"
 >
 <ProductCard 
 product={product} 
 onClick={onProductClick} 
 className="h-full w-full"
 />
 </motion.div>
 ))}
 </div>
 </div>
 );
};
