import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import type { CategoryItem } from '@/types/category.types';

interface PopularProductsProps {
  products: CategoryItem[];
  onProductClick: (product: CategoryItem) => void;
}

export const PopularProducts = ({ products, onProductClick }: PopularProductsProps) => {
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
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight mb-4">
              Our Top Picks
            </h2>
            <p className="text-[#64748B] text-lg font-medium max-w-xl">
              Hand-picked by our chefs, these signature dishes are loved by our customers.
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
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
              className="snap-start shrink-0 w-[280px] md:w-[320px]"
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
};
