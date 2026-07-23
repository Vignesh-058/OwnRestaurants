import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import defaultIcon from '@/assets/category-icons/default.png';
import { useNavigate } from 'react-router-dom';

interface CategoriesCarouselProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoriesCarousel = ({ categories, activeCategoryId, onSelectCategory }: CategoriesCarouselProps) => {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) return null;

  // Limit categories to 11 to leave room for a "View All" button if there are more
  const maxDisplay = 11;
  const showViewAll = categories.length > maxDisplay;
  const displayCategories = categories.slice(0, showViewAll ? maxDisplay : 12);

  return (
    <section className="py-6 md:py-10 bg-background relative border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1e1b4b] tracking-tight mb-1 leading-tight">
              Shop By Category
            </h2>
            <div className="w-10 md:w-16 h-1 bg-primary rounded-full mb-2" />
            <p className="text-muted-foreground text-xs md:text-sm font-medium max-w-2xl">
              <span className="md:hidden">Explore categories</span>
              <span className="hidden md:inline">Browse your favorite food categories.</span>
            </p>
          </div>
          {showViewAll && (
            <button 
              className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:gap-2 transition-all pb-1 md:pb-0" 
              onClick={() => navigate('/products')}
            >
              <span className="hidden sm:inline">VIEW ALL CATEGORIES</span>
              <span className="sm:hidden">VIEW ALL</span> 
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 pb-3 snap-x">
          {displayCategories.map((category, index) => {
            const name = (category as any).categoryName || category.name || (category as any).displayName || (category as any).title || "Unknown";
            const iconSrc = category.imageUrl || defaultIcon;
            const isActive = activeCategoryId === category._id;

            return (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                key={category._id}
                onClick={() => onSelectCategory?.(category._id)}
                className="flex flex-col items-center gap-2 shrink-0 snap-center group cursor-pointer w-[68px] sm:w-[84px] md:w-[96px]"
              >
                <div className={cn(
                  "size-14 sm:size-16 md:size-20 rounded-full flex items-center justify-center p-0.5 transition-all duration-200",
                  isActive 
                    ? "border-2 border-primary bg-transparent" 
                    : "border-2 border-transparent bg-white shadow-xs hover:shadow-sm hover:-translate-y-0.5"
                )}>
                  <div className={cn(
                    "w-full h-full rounded-full flex items-center justify-center relative overflow-hidden",
                    isActive ? "bg-primary" : "bg-white p-2"
                  )}>
                    {category._id === 'all' ? (
                      <LayoutGrid className={cn(
                        "size-5 sm:size-6 transition-transform duration-300",
                        isActive ? "text-white" : "text-primary group-hover:text-primary"
                      )} />
                    ) : (
                      <img 
                        src={iconSrc} 
                        alt={name} 
                        className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105" 
                      />
                    )}
                  </div>
                </div>
                
                <h3 className={cn(
                  "font-bold text-xs leading-tight text-center transition-colors px-1 max-w-[80px] md:max-w-[96px] truncate",
                  isActive ? "text-primary" : "text-[#1e1b4b] group-hover:text-primary"
                )}>
                  {name}
                </h3>
              </motion.button>
            );
          })}
          
          {showViewAll && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: displayCategories.length * 0.05 }}
              onClick={() => navigate('/products')}
              className="relative flex flex-col items-center justify-center rounded-[24px] transition-all duration-300 border border-dashed border-border bg-muted hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_12px_40px_-12px_rgba(255,107,53,0.2)] hover:-translate-y-2 group h-full p-6"
            >
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-sm mb-4 group-hover:shadow-md group-hover:scale-110 transition-all duration-500">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-extrabold text-lg text-[#1e1b4b] group-hover:text-primary transition-colors">
                View All
              </h3>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};
