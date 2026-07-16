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
    <section className="py-8 md:py-20 bg-background relative border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-12">
        <div className="flex flex-row justify-between items-end mb-6 md:mb-12 gap-4">
          <div>
            <h2 className="text-2xl md:text-5xl font-extrabold text-foreground tracking-tight mb-2 md:mb-4 capitalize">
              Shop by Category
            </h2>
            <div className="w-16 md:w-24 h-1 md:h-1.5 bg-primary rounded-full mb-2 md:mb-6" />
            <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-2xl">
              <span className="md:hidden">Explore categories</span>
              <span className="hidden md:inline">Browse your favorite food categories.</span>
            </p>
          </div>
          {showViewAll && (
            <button 
              className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-1.5 md:gap-2 hover:gap-2 md:hover:gap-3 transition-all pb-1 md:pb-0" 
              onClick={() => navigate('/products')}
            >
              <span className="hidden sm:inline">View All Categories</span>
              <span className="sm:hidden">View All</span> 
              <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-6">
          {displayCategories.map((category, index) => {
            const name = (category as any).categoryName || category.name || (category as any).displayName || (category as any).title || "Unknown";
            const iconSrc = category.imageUrl || defaultIcon;
            const isActive = activeCategoryId === category._id;
            const productCount = (category as any).productsCount || null; // Render if available from API

            return (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                key={category._id}
                onClick={() => onSelectCategory?.(category._id)}
                className={cn(
                  "relative flex flex-col rounded-2xl transition-all duration-300 border overflow-hidden group text-left h-full",
                  isActive 
                    ? "bg-card border-primary shadow-md" 
                    : "bg-card border-border shadow-sm hover:border-primary hover:shadow-lg hover:-translate-y-2"
                )}
              >
                <div className="w-full aspect-square bg-muted flex items-center justify-center p-3 sm:p-6 relative overflow-hidden group-hover:bg-accent transition-colors duration-500">
                  {category._id === 'all' ? (
                    <LayoutGrid className={cn(
                      "w-12 h-12 transition-transform duration-500 group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                  ) : (
                    <img 
                      src={iconSrc} 
                      alt={name} 
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md" 
                    />
                  )}
                </div>
                
                <div className="p-2 sm:p-4 bg-card flex-grow flex flex-col justify-between">
                  <h3 className={cn(
                    "font-extrabold text-[13px] sm:text-base md:text-lg leading-tight mb-0.5 sm:mb-1 transition-colors line-clamp-2",
                    isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {productCount ? `${productCount} Items` : 'Explore'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
                
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                )}
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
              className="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-300 border border-dashed border-border bg-muted hover:border-primary hover:bg-accent hover:-translate-y-2 group h-full p-6"
            >
              <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center shadow-sm mb-4 group-hover:shadow-md group-hover:scale-110 transition-all duration-500">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">
                View All
              </h3>
              <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors mt-1">
                {categories.length} Categories
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};
