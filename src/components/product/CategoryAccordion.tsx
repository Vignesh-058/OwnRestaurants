import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryItem as ProductItem } from '@/types/category.types';
import { ProductCard } from './ProductCard';

interface Category {
  _id: string;
  name: string;
  image?: string;
  items?: ProductItem[];
}

interface CategoryAccordionProps {
  category: Category;
  isOpen: boolean;
  onToggle: () => void;
  onProductClick: (product: ProductItem) => void;
  filteredProducts: ProductItem[];
}

export const CategoryAccordion = ({
  category,
  isOpen,
  onToggle,
  onProductClick,
  filteredProducts
}: CategoryAccordionProps) => {
  const accordionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when opened
  useEffect(() => {
    if (isOpen && accordionRef.current) {
      setTimeout(() => {
        const yOffset = -100; // Adjust for sticky headers
        const element = accordionRef.current;
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300); // Wait for animation to start
    }
  }, [isOpen]);

  const productCount = filteredProducts.length;
  if (productCount === 0) return null;

  return (
    <div 
      ref={accordionRef}
      id={`accordion-${category._id}`}
      className={cn(
        "flex flex-col w-full rounded-[24px] transition-all duration-500 overflow-hidden",
        isOpen 
          ? "bg-[#FF6B00]/5 border-[#FF6B00]/30 shadow-lg shadow-[#FF6B00]/5" 
          : "bg-white dark:bg-slate-900 border-border/60 hover:border-[#FF6B00]/30 hover:shadow-md shadow-sm",
        "border"
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-5 outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] rounded-[24px]"
      >
        <div className="flex items-center gap-4">
          {category.image ? (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border-2 border-background shadow-sm bg-muted">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-2 border-background shadow-sm bg-[#FF6B00]/10 text-[#FF6B00] font-black text-xl">
              {category.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div className="flex flex-col items-start gap-1">
            <h3 className={cn(
              "font-black text-lg md:text-xl transition-colors duration-300",
              isOpen ? "text-[#FF6B00]" : "text-foreground group-hover:text-[#FF6B00]"
            )}>
              {category.name}
            </h3>
            <span className={cn(
              "text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors",
              isOpen 
                ? "bg-[#FF6B00]/10 text-[#FF6B00]" 
                : "bg-muted text-muted-foreground"
            )}>
              {productCount} {productCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        <div className={cn(
          "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/30" : "bg-muted text-muted-foreground"
        )}>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-4 md:px-5 pb-5 pt-2 border-t border-border/40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={onProductClick}
                    className={isOpen ? "bg-white" : ""}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
