import { ProductCard } from './ProductCard';
import type { CategoryItem } from '@/types/category.types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductGridProps {
 products: CategoryItem[];
 onProductClick: (product: CategoryItem) => void;
 title?: string;
 isSidebarOpen?: boolean;
}

export const ProductGrid = ({ products, onProductClick, title, isSidebarOpen = true }: ProductGridProps) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
      )}
      <motion.div 
        className={cn(
          "grid gap-4 md:gap-5 transition-all duration-300",
          isSidebarOpen 
            ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4" 
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {products.map((product) => (
          <motion.div 
            key={product._id}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="flex w-full justify-center"
          >
            <ProductCard 
              product={product} 
              onClick={onProductClick} 
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
