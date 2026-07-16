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
    <section className="py-20 bg-background relative border-b border-border">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 capitalize">
              Shop by Category
            </h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mb-6" />
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              Browse your favorite food categories.
            </p>
          </div>
          {showViewAll && (
            <button 
              className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all" 
              onClick={() => navigate('/products')}
            >
              View All Categories <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
                <div className="w-full aspect-square bg-muted flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-accent transition-colors duration-500">
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
                
                <div className="p-4 bg-card flex-grow flex flex-col justify-between">
                  <h3 className={cn(
                    "font-extrabold text-base md:text-lg leading-tight mb-1 transition-colors line-clamp-2",
                    isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {productCount ? `${productCount} Items` : 'Explore'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
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
