import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ChevronRight, ArrowRight } from 'lucide-react';
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
    <section className="py-10 md:py-16 bg-background relative border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-[24px] md:text-[36px] font-black text-[#1e1b4b] tracking-tight mb-1.5 md:mb-2 leading-tight">
              Shop By Category
            </h2>
            <div className="w-12 md:w-20 h-1.5 md:h-2 bg-primary rounded-full mb-2 md:mb-4" />
            <p className="text-muted-foreground text-[14px] md:text-[17px] font-medium max-w-2xl">
              <span className="md:hidden">Explore categories</span>
              <span className="hidden md:inline">Browse your favorite food categories.</span>
            </p>
          </div>
          {showViewAll && (
            <button 
              className="text-primary font-extrabold text-[12px] md:text-[13px] uppercase tracking-widest flex items-center gap-1.5 md:gap-2 hover:gap-2 md:hover:gap-3 transition-all pb-1 md:pb-0" 
              onClick={() => navigate('/products')}
            >
              <span className="hidden sm:inline">VIEW ALL CATEGORIES</span>
              <span className="sm:hidden">VIEW ALL</span> 
              <ArrowRight className="w-4 h-4 md:w-4 md:h-4" />
            </button>
          )}
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 sm:gap-6 md:gap-8 pb-4 snap-x">
          {displayCategories.map((category, index) => {
            const name = (category as any).categoryName || category.name || (category as any).displayName || (category as any).title || "Unknown";
            const iconSrc = category.imageUrl || defaultIcon;
            const isActive = activeCategoryId === category._id;

            return (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={category._id}
                onClick={() => onSelectCategory?.(category._id)}
                className="flex flex-col items-center gap-3 shrink-0 snap-center group cursor-pointer w-[80px] sm:w-[100px] md:w-[120px]"
              >
                <div className={cn(
                  "w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] rounded-full flex items-center justify-center p-[3px] transition-all duration-300",
                  isActive 
                    ? "border-[2px] border-primary bg-transparent" 
                    : "border-[2px] border-transparent bg-white shadow-sm ring-4 ring-white hover:shadow-md hover:-translate-y-1"
                )}>
                  <div className={cn(
                    "w-full h-full rounded-full flex items-center justify-center relative overflow-hidden",
                    isActive ? "bg-primary" : "bg-white p-2 md:p-3"
                  )}>
                    {category._id === 'all' ? (
                      <LayoutGrid className={cn(
                        "w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-500",
                        isActive ? "text-white" : "text-primary group-hover:text-primary"
                      )} />
                    ) : (
                      <img 
                        src={iconSrc} 
                        alt={name} 
                        className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110" 
                      />
                    )}
                  </div>
                </div>
                
                <h3 className={cn(
                  "font-bold text-[12px] sm:text-[14px] leading-tight text-center transition-colors px-1 max-w-[90px] md:max-w-[110px]",
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
