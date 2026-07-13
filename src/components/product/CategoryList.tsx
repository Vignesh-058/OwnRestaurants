import { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import { ChevronRight } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export const CategoryList = ({ categories, activeCategoryId, onSelectCategory }: CategoryListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full relative">
      <div className="flex flex-col gap-5">
        
        {/* Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
            Categories
          </h2>
          <div className="hidden sm:flex gap-2">
            <button 
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="h-9 w-9 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-muted hover:text-[#FF6B00] transition-all shadow-sm"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <button 
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="h-9 w-9 rounded-full bg-card border border-border/50 flex items-center justify-center hover:bg-muted hover:text-[#FF6B00] transition-all shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative -mx-4 md:mx-0 px-4 md:px-0">
          <div 
            ref={scrollRef}
            className="flex items-start gap-4 md:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 pt-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => {
              const isActive = activeCategoryId === category._id;
              const productCount = category.items?.length || 0;
              const categoryName = (category as any).categoryName || category.name || (category as any).displayName || (category as any).title || "Unknown";
              
              return (
                <motion.button
                  key={category._id}
                  onClick={() => onSelectCategory(category._id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex-none w-[170px] h-[220px] flex flex-col items-center justify-center p-[20px] rounded-[16px] transition-all duration-300 snap-start relative group shadow-sm border",
                    isActive 
                      ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] border-transparent shadow-[0_8px_20px_rgba(255,107,0,0.3)]" 
                      : "bg-[#111827] border-[rgba(255,255,255,0.08)] hover:bg-[#FF6B00]/10 hover:border-[#FF6B00]/30 hover:scale-[1.02]"
                  )}
                >
                  {/* Image Container */}
                  <div className={cn(
                    "w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 border-4 transition-all duration-300 mb-3 flex items-center justify-center",
                    isActive ? "border-white/20 shadow-inner" : "border-background group-hover:border-[#FF6B00]/10 shadow-sm"
                  )}>
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={categoryName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-muted text-foreground uppercase">
                        {categoryName.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Category Name & Count */}
                  <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
                    <span className={cn(
                      "font-semibold text-[16px] text-center leading-[1.3] line-clamp-2 w-full",
                      isActive ? "text-white" : "text-white group-hover:text-white"
                    )}>
                      {categoryName}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[13px] font-medium mt-1 tracking-wide",
                    isActive ? "text-white/80" : "text-[#94A3B8]"
                  )}>
                    {productCount > 0 ? `${productCount} Items` : 'Coming Soon'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
