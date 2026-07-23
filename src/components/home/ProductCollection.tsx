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
    <section className={cn("py-6 md:py-10 bg-background overflow-hidden relative", !hideBorderBottom && "border-b border-border")}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1e1b4b] tracking-tight mb-1 capitalize leading-tight">
              {title}
            </h2>
            <div className="w-10 md:w-16 h-1 bg-primary rounded-full mb-2" />
            {subtitle && (
              <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Navigation Controls */}
          {products.length > 3 && (
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={scrollPrev}
                className="size-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:shadow-xs transition-all"
                aria-label={`Scroll ${title} left`}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button 
                onClick={scrollNext}
                className="size-9 rounded-full border border-border bg-card flex items-center justify-center text-foreground hover:border-primary hover:text-primary hover:shadow-xs transition-all"
                aria-label={`Scroll ${title} right`}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden pb-4 pt-2 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-5">
            {products.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={product._id}
                className="flex-[0_0_72vw] sm:flex-[0_0_240px] md:flex-[0_0_270px] lg:flex-[0_0_280px] min-w-0 pl-4 md:pl-5 cursor-grab active:cursor-grabbing"
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
