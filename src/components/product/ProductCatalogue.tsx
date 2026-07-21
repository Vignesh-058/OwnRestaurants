import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import { Search, Flame, Coffee, Pizza, Croissant, UtensilsCrossed, Wheat, ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

interface ProductCatalogueProps {
  categories: Category[];
  allProducts?: any[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onProductClick: (product: any) => void;
}

// Helper to map generic categories to icons
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('hot') || n.includes('fire') || n.includes('spicy') || n.includes('offer')) return Flame;
  if (n.includes('coffee') || n.includes('tea') || n.includes('beverage')) return Coffee;
  if (n.includes('pizza') || n.includes('burger')) return Pizza;
  if (n.includes('bread') || n.includes('naan') || n.includes('roti') || n.includes('croissant')) return Croissant;
  if (n.includes('rice') || n.includes('biryani') || n.includes('meal')) return Wheat;
  if (n.includes('dessert') || n.includes('sweet') || n.includes('cake')) return ChefHat;
  return UtensilsCrossed;
};

export const ProductCatalogue = ({ categories, allProducts, activeCategoryId, onSelectCategory, onProductClick }: ProductCatalogueProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const activeCategory = categories.find(c => c._id === activeCategoryId) || categories[0];
  
  const items = useProducts(allProducts, activeCategory?._id || 'all', '');
  const filters = useProductFilters(items);

  if (!activeCategory) return null;

  const categoryName = (activeCategory as any).categoryName || activeCategory.name || (activeCategory as any).displayName || "Unknown";

  return (
    <div className="w-full relative z-10 flex flex-col bg-[var(--background)]">
      

      {/* MAIN CONTENT AREA */}
      <section id="product-menu" className="w-full flex flex-col lg:flex-row relative z-10 pt-2 lg:pt-4 px-0">
        
        {/* LEFT: Premium Sidebar Categories */}
        <aside className={cn(
          "shrink-0 z-30 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] mb-4 lg:mb-0 transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "w-full lg:w-[300px] xl:w-[340px] opacity-100" : "w-full lg:w-0 lg:opacity-0 lg:m-0"
        )}>
          <div className="flex flex-row lg:flex-col lg:h-full overflow-x-auto lg:overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent gap-3 lg:gap-2 px-4 lg:px-0 pb-4 lg:pb-12 pt-1 lg:pt-2 snap-x min-w-full lg:min-w-[300px] xl:min-w-[340px]">
            
            {/* Desktop only section title */}
            <div className="hidden lg:flex px-2 mb-4 items-center justify-between">
              <h2 className="text-[20px] font-extrabold text-foreground tracking-tight">Categories</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-all group cursor-pointer"
                title="Collapse Categories"
              >
                <ChevronLeft className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {categories.map((category) => {
              const isActive = activeCategory._id === category._id;
              const productCount = allProducts ? allProducts.filter(p => p.category === category._id || p.categoryId === category._id).length : 0;
              const catName = (category as any).categoryName || category.name || (category as any).displayName || "Unknown";
              const Icon = getCategoryIcon(catName);

              return (
                <button
                  key={category._id}
                  onClick={() => onSelectCategory(category._id)}
                  className={cn(
                    "flex items-center justify-start w-auto lg:w-full h-[52px] lg:h-[56px] px-4 lg:px-4 rounded-full lg:rounded-[18px] transition-all duration-300 text-left group shrink-0 snap-start border lg:border-none",
                    isActive 
                      ? "bg-primary text-white shadow-[0_8px_25px_rgba(255,107,0,0.25)]" 
                      : "bg-white text-[#4B5563] border-border hover:bg-muted hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Icon or Image */}
                    <div className={cn(
                      "flex w-[36px] h-[36px] rounded-full overflow-hidden items-center justify-center shrink-0 transition-all shadow-sm",
                      isActive ? "bg-white/20 text-white" : "bg-[var(--background)] text-primary group-hover:bg-white" 
                    )}>
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={catName} className="w-full h-full object-cover" />
                      ) : (
                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-primary")} />
                      )}
                    </div>
                    
                    {/* Text */}
                    <span className={cn(
                      "font-bold text-[14px] lg:text-[15px] flex-1 truncate",
                      isActive ? "text-white" : "text-[#4B5563]"
                    )}>
                      {catName}
                    </span>

                    {/* Count Indicator (Desktop) */}
                    <span className={cn(
                      "hidden lg:flex items-center justify-center min-w-[24px] text-[11px] font-extrabold px-1.5 py-0.5 rounded-[8px] transition-colors",
                      isActive 
                        ? "text-primary bg-white shadow-sm" 
                        : "text-muted-foreground group-hover:text-[#4B5563] bg-transparent"
                    )}>
                      {productCount}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Premium Hot Deals Banner in Sidebar */}
            <div className="hidden lg:flex mt-6 p-5 bg-muted rounded-[20px] border border-border flex-col items-start shadow-sm mx-2">
              <span className="flex items-center gap-1.5 font-bold text-primary text-[15px] mb-2">
                 Hot Deals!
              </span>
              <p className="text-[13px] font-medium text-foreground mb-4 leading-tight">
                Up to 40% OFF on selected items this week.
              </p>
              <button className="w-full h-[40px] rounded-full bg-primary text-white font-bold text-[13px] hover:bg-primary-light transition-colors shadow-md">
                View Offers
              </button>
            </div>
          </div>
        </aside>

        {/* Floating Open Button (visible only when sidebar is closed on desktop) */}
        {!isSidebarOpen && (
          <div className="hidden lg:flex sticky top-[100px] h-fit z-40 -ml-4 mr-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="bg-white border shadow-[4px_4px_15px_rgba(0,0,0,0.05)] p-2 rounded-r-[12px] hover:bg-muted transition-colors cursor-pointer group"
            >
              <ChevronRight className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}

        {/* RIGHT: Product Listing */}
        <div className="flex-1 w-full px-4 md:px-6 lg:px-8 pb-24 lg:pb-32 lg:pl-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategoryId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col"
            >
              {/* Recommended Header */}
              <div className="mb-6 lg:mb-8 flex flex-col gap-1">
                <h3 className="text-[26px] md:text-[32px] font-extrabold text-foreground tracking-tight flex items-center gap-2">
                  {categoryName} <span className="text-3xl"></span>
                </h3>
                <p className="text-[14px] font-medium text-muted-foreground">
                  {filters.filteredItems.length} Dishes
                </p>
              </div>
              
              {/* Products Grid */}
              {filters.filteredItems.length > 0 ? (
                <div className="w-full">
                  <ProductGrid 
                    products={filters.filteredItems} 
                    onProductClick={onProductClick}
                    isSidebarOpen={isSidebarOpen}
                  />
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-border shadow-sm mt-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-foreground mb-2">No products available</h4>
                  <p className="text-muted-foreground text-[15px] font-medium">Try selecting a different category or adjusting your filters.</p>
                  <Button onClick={filters.resetFilters} className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-[48px] font-bold">
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
