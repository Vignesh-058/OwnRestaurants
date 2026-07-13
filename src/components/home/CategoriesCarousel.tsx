import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import defaultIcon from '@/assets/category-icons/default.png';

interface CategoriesCarouselProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoriesCarousel = ({ categories, activeCategoryId, onSelectCategory }: CategoriesCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight mb-4">
            Explore Our Menu
          </h2>
          <p className="text-[#64748B] text-lg font-medium max-w-2xl mx-auto">
            From classic favorites to chef's specials, discover the perfect dish to satisfy your cravings.
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#111827] hover:text-[#FF6B00] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 w-12 h-12 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#111827] hover:text-[#FF6B00] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div 
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory py-8 px-4 -mx-4"
          >
            {categories.map((category, index) => {
              const name = (category as any).categoryName || category.name || (category as any).displayName || (category as any).title || "Unknown";
              const iconSrc = category.imageUrl || defaultIcon;
              const isActive = activeCategoryId === category._id;

              return (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={category._id}
                  onClick={() => onSelectCategory?.(category._id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center min-w-[160px] md:min-w-[200px] p-6 rounded-[24px] transition-all duration-300 snap-center border-2 group",
                    isActive 
                      ? "bg-[#FFF7ED] border-[#FF6B00] shadow-[0_8px_30px_rgba(255,107,0,0.15)] scale-105" 
                      : "bg-white border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:border-[#FF6B00]/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
                  )}
                >
                  <div className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                    isActive ? "bg-[#FF6B00]" : "bg-[#F8FAFC] group-hover:bg-[#FFF7ED]"
                  )}>
                    {category._id === 'all' ? (
                      <LayoutGrid className={cn(
                        "w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-white" : "text-[#FF6B00]"
                      )} />
                    ) : (
                      <img 
                        src={iconSrc} 
                        alt={name} 
                        className={cn(
                          "w-12 h-12 md:w-14 md:h-14 object-contain transition-transform duration-300 group-hover:scale-110",
                          isActive ? "brightness-0 invert" : ""
                        )} 
                      />
                    )}
                  </div>
                  <span className={cn(
                    "font-bold text-[16px] md:text-[18px] text-center transition-colors line-clamp-2",
                    isActive ? "text-[#FF6B00]" : "text-[#111827] group-hover:text-[#FF6B00]"
                  )}>
                    {name}
                  </span>
                  
                  {isActive && (
                    <div className="absolute -bottom-2 w-12 h-1 rounded-full bg-[#FF6B00]" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
