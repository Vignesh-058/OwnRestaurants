import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category.types';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useProducts } from '@/hooks/useProducts';
import { ProductFilterPanel } from './ProductFilterPanel';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface ProductCatalogueProps {
  categories: Category[];
  allProducts?: any[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onProductClick: (product: any) => void;
}

export const ProductCatalogue = ({ categories, allProducts, activeCategoryId, onSelectCategory, onProductClick }: ProductCatalogueProps) => {
  const activeCategory = categories.find(c => c._id === activeCategoryId) || categories[0];
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  
  const items = useProducts(allProducts, activeCategory?._id || 'all', '');
  const filters = useProductFilters(items);

  if (!activeCategory) return null;

  const categoryName = (activeCategory as any).categoryName || activeCategory.name || (activeCategory as any).displayName || "Unknown";

  return (
    <section id="product-menu" className="w-full flex flex-col lg:flex-row relative z-10">
      {/* LEFT: Sidebar (Categories + Desktop Filters) */}
      <aside className="w-full lg:w-[360px] shrink-0 bg-white border-r border-[#E2E8F0] z-30 relative">
        <div className="p-6 lg:p-6 flex flex-col lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-[#E2E8F0] scrollbar-track-transparent">
          
          <div className="flex-shrink-0">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h2 className="text-[26px] font-bold text-[#0F172A] tracking-tight leading-none mb-1.5">Categories</h2>
                <p className="text-[13px] text-[#64748B] font-medium">Browse Menu</p>
              </div>
              
              {/* Desktop Filter Toggle (hidden on mobile) */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsDesktopFilterOpen(!isDesktopFilterOpen)}
                className={cn(
                  "hidden lg:flex w-10 h-10 rounded-full border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors relative",
                  isDesktopFilterOpen && "bg-[#FFF7ED] border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FFF7ED]"
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {(filters.offers.length > 0 || filters.ratings.length > 0 || filters.foodType !== 'all') && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00] border-2 border-white" />
                )}
              </Button>

              {/* Mobile Filter Toggle (hidden on desktop) */}
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="lg:hidden flex w-10 h-10 rounded-full border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors relative"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {(filters.offers.length > 0 || filters.ratings.length > 0 || filters.foodType !== 'all') && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#FF6B00] border-2 border-white" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:max-w-md p-0 bg-white border-r-0">
                  <div className="h-full flex flex-col">
                    <ProductFilterPanel {...filters} onApplyMobile={() => setIsMobileFilterOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="mb-4 mt-4">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={filters.searchQuery}
                  onChange={(e) => filters.setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 h-[48px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF6B00]/30 focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
                />
              </div>
            </div>
          </div>
          
          {/* Desktop Filter Panel Animated */}
          <AnimatePresence>
            {isDesktopFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block absolute left-6 right-6 top-[132px] z-[60]"
              >
                <div className="h-[450px] bg-white rounded-[16px] border border-[#E2E8F0] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
                  <ProductFilterPanel {...filters} onApplyMobile={() => setIsDesktopFilterOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Categories List */}
          <div className="flex flex-col gap-1.5 mb-8">
            {categories.map((category) => {
              const isActive = activeCategory._id === category._id;
              
              // Count products for this category using allProducts
              const productCount = allProducts ? allProducts.filter(p => p.category === category._id || p.categoryId === category._id).length : 0;
              const catName = (category as any).categoryName || category.name || (category as any).displayName || "Unknown";

              return (
                <button
                  key={category._id}
                  onClick={() => onSelectCategory(category._id)}
                  className={cn(
                    "flex items-center justify-between w-full h-[60px] px-3 rounded-[16px] transition-all duration-300 text-left group",
                    isActive 
                      ? "bg-[#FFF7ED] text-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.1)]" 
                      : "bg-transparent text-[#0F172A] hover:bg-[#F8FAFC]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-[38px] h-[38px] rounded-[10px] overflow-hidden flex items-center justify-center shrink-0 transition-all",
                      "bg-[#F0FDF4] border border-[#DCFCE7] shadow-sm",
                      isActive && "ring-2 ring-white/50 bg-white" 
                    )}>
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={catName} className="w-[60%] h-[60%] object-contain drop-shadow-sm" />
                      ) : (
                        <span className="text-xs font-bold uppercase text-[#16A34A]">{catName.charAt(0)}</span>
                      )}
                    </div>
                    <span className={cn(
                      "font-semibold text-[15px]",
                      isActive ? "text-[#FF6B00]" : "text-[#0F172A]"
                    )}>{catName}</span>
                  </div>
                  <span className={cn(
                    "text-[13px] font-bold px-2.5 py-1 rounded-[8px] transition-colors",
                    isActive 
                      ? "text-[#FF6B00] bg-white shadow-sm" 
                      : "text-[#64748B] group-hover:text-[#475569] bg-transparent"
                  )}>
                    {productCount}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </aside>

      {/* RIGHT: Product Listing */}
      <div className="flex-1 w-full p-4 md:p-8 lg:p-[40px] pb-16 lg:pb-[64px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategoryId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col max-w-[1400px] mx-auto"
          >
            {/* Header for right side */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-0 pb-2">
              <h3 className="text-[32px] md:text-[48px] font-bold text-[#0F172A] flex items-center gap-4 tracking-tight">
                {categoryName}
                <span className="text-[14px] md:text-[15px] font-bold text-[#64748B] bg-[#F1F5F9] px-3 h-9 flex items-center justify-center rounded-full">
                  {filters.filteredItems.length} items
                </span>
              </h3>
            </div>
            
            {/* Products Grid */}
            {filters.filteredItems.length > 0 ? (
              <div className="w-full">
                <ProductGrid 
                  products={filters.filteredItems} 
                  onProductClick={onProductClick}
                />
              </div>
            ) : (
              <div className="py-24 text-center flex flex-col items-center justify-center bg-white rounded-[24px] border border-dashed border-[#CBD5E1] shadow-sm">
                <span className="text-5xl mb-4">🔍</span>
                <h4 className="text-2xl font-black text-[#0F172A] mb-2">No items found</h4>
                <p className="text-[#64748B] text-[15px] font-medium">Try adjusting your filters or search query.</p>
                <Button onClick={filters.resetFilters} className="mt-6 bg-[#FF6B00] hover:bg-[#E65C00] text-white rounded-full px-6">
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
