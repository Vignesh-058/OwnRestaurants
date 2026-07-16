import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import type { CategoryItem } from '@/types/category.types';

import { cn } from '@/lib/utils';

interface ProductCollectionProps {
  title: string;
  subtitle?: string;
  products: CategoryItem[];
  onProductClick: (product: CategoryItem) => void;
  hideBorderBottom?: boolean;
}

export const ProductCollection = React.memo(({ title, subtitle, products, onProductClick, hideBorderBottom }: ProductCollectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className={cn("py-20 bg-background overflow-hidden relative", !hideBorderBottom && "border-b border-border")}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4">
              {title}
            </h2>
            <div className="w-20 h-1.5 bg-primary rounded-full mb-6" />
            {subtitle && (
              <p className="text-muted-foreground text-lg font-medium max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Navigation Controls */}
          {products.length > 3 && (
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 pt-4 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {products.map((product, index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={product._id}
              className="snap-start shrink-0 w-[80vw] sm:w-[280px] md:w-[320px]"
            >
              <ProductCard 
                product={product}
                onClick={() => onProductClick(product)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

ProductCollection.displayName = 'ProductCollection';
