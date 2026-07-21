import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import type { CategoryItem } from '@/types/category.types';
import useEmblaCarousel from 'embla-carousel-react';

import { cn } from '@/lib/utils';

interface ProductCollectionProps {
  title: string;
  subtitle?: string;
  products: CategoryItem[];
  onProductClick: (product: CategoryItem) => void;
  hideBorderBottom?: boolean;
}

export const ProductCollection = React.memo(({ title, subtitle, products, onProductClick, hideBorderBottom }: ProductCollectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start', 
    containScroll: 'trimSnaps',
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <section className={cn("py-10 md:py-16 bg-background overflow-hidden relative", !hideBorderBottom && "border-b border-border")}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#1e1b4b] tracking-tight mb-1.5 md:mb-2 capitalize leading-tight">
              {title}
            </h2>
            <div className="w-12 md:w-20 h-1.5 md:h-2 bg-primary rounded-full mb-2 md:mb-4" />
            {subtitle && (
              <p className="text-muted-foreground text-[14px] md:text-[17px] font-medium max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Navigation Controls */}
          {products.length > 3 && (
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={scrollPrev}
                className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={scrollNext}
                className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:shadow-md transition-all duration-300"
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden pb-8 pt-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0" ref={emblaRef}>
          <div className="flex -ml-6">
            {products.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={product._id}
                className="flex-[0_0_80vw] sm:flex-[0_0_280px] md:flex-[0_0_320px] min-w-0 pl-6 cursor-grab active:cursor-grabbing"
              >
                <ProductCard 
                  product={product}
                  onClick={() => onProductClick(product)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ProductCollection.displayName = 'ProductCollection';
