import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Category } from '@/types/category.types';
import defaultIcon from '@/assets/category-icons/default.png';

// Keep FilterState for reference if needed elsewhere
export interface FilterState {
  categories: string[];
  foodType: string;
  priceRange: [number, number];
  rating: number;
  offers: string[];
  deliveryTime: number;
  availability: string[];
  sortBy: string;
}

interface FilterSidebarProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory?: (id: string) => void;
  onOpenFilters?: () => void;
  className?: string;
}

export const FilterSidebar = ({ categories, activeCategoryId, onSelectCategory, onOpenFilters, className }: FilterSidebarProps) => {
  const [categorySearch, setCategorySearch] = useState('');

  const validCategories = useMemo(() => {
    const valid = categories.filter(c => {
      const name = ((c as any).categoryName || c.name || (c as any).displayName || (c as any).title || "").toLowerCase().trim();
      return name !== 'all';
    });
    
    // De-duplicate by name to satisfy user request "Remove duplicate categories"
    const unique = [];
    const seen = new Set();
    for (const c of valid) {
      const name = ((c as any).categoryName || c.name || (c as any).displayName || (c as any).title || "").trim();
      if (!seen.has(name)) {
        seen.add(name);
        unique.push(c);
      }
    }

    return unique.sort((a, b) => {
      const nameA = ((a as any).categoryName || a.name || (a as any).displayName || (a as any).title || "").toLowerCase();
      const nameB = ((b as any).categoryName || b.name || (b as any).displayName || (b as any).title || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [categories]);

  const filteredCategories = validCategories.filter(c => {
    const name = ((c as any).categoryName || c.name || (c as any).displayName || (c as any).title || "").toLowerCase();
    return name.includes(categorySearch.toLowerCase());
  });

  return (
    <div 
      className={cn(
        "flex flex-col bg-white h-full w-full shrink-0 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/60 overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="p-5 pb-4 border-b border-[#E5E7EB]/40">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[22px] font-bold text-[#111827] leading-tight">Categories</h2>
              <p className="text-[#64748B] text-[13px] mt-0.5 font-medium">Browse Menu</p>
            </div>
            
            {/* New Filter Button */}
            <button 
              onClick={onOpenFilters}
              className="group flex items-center justify-center w-10 h-10 rounded-[12px] bg-[#FFF7ED] border border-[rgba(255,107,0,0.15)] shadow-[0_4px_10px_rgba(255,107,0,0.08)] hover:bg-[#FF6B00] hover:scale-105 hover:shadow-[0_4px_12px_rgba(255,107,0,0.2)] transition-all duration-250 cursor-pointer"
              title="Open Filters"
            >
              <SlidersHorizontal className="w-5 h-5 text-[#FF6B00] group-hover:text-white transition-colors duration-250" />
            </button>
          </div>
          
          {/* Search Box */}
          <div className="relative mt-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#94A3B8]" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10 h-[46px] bg-[#F8FAFC]/80 border-[#E5E7EB] rounded-[14px] text-[14px] focus-visible:ring-2 focus-visible:ring-[#FF6B00]/20 focus-visible:border-[#FF6B00] placeholder:text-[#94A3B8] transition-all"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4">
          <div className="flex flex-col gap-1.5">
            {filteredCategories.map(category => {
              const name = (category as any).categoryName || category.name || (category as any).displayName || (category as any).title || "Unknown";
              const iconSrc = category.imageUrl || defaultIcon;
              const count = category.items?.length || 0;
              const isActive = activeCategoryId === category._id;

              return (
                <button
                  key={category._id}
                  onClick={() => onSelectCategory?.(category._id)}
                  className={cn(
                    "flex items-center justify-between w-full p-3 rounded-[12px] transition-all duration-300 group text-left",
                    isActive 
                      ? "bg-[#FF6B00] text-white shadow-[0_4px_12px_rgba(255,107,0,0.25)] scale-[1.02] ml-1 mr-1 w-[calc(100%-8px)]" 
                      : "bg-transparent hover:bg-[#FFF7ED] hover:-translate-y-0.5 text-[#111827]"
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "w-10 h-10 rounded-[10px] overflow-hidden shrink-0 flex items-center justify-center transition-colors shadow-sm",
                      isActive ? "bg-white/20" : "bg-white border border-[#E5E7EB]/60"
                    )}>
                      <img 
                        src={iconSrc} 
                        alt={name} 
                        className={cn(
                          "w-7 h-7 object-contain drop-shadow-sm transition-all",
                          isActive ? "brightness-0 invert" : ""
                        )}
                      />
                    </div>
                    <span className={cn(
                      "font-semibold text-[14px] truncate transition-colors",
                      isActive ? "text-white" : "group-hover:text-[#FF6B00]"
                    )}>
                      {name}
                    </span>
                  </div>
                  
                  {/* Count Badge */}
                  <div className={cn(
                    "flex items-center justify-center min-w-[24px] h-[24px] px-1.5 rounded-full text-[11px] font-bold transition-colors ml-2 shadow-sm",
                    isActive 
                      ? "bg-white/25 text-white" 
                      : "bg-white border border-[#E5E7EB] text-[#64748B] group-hover:border-[#FF6B00]/30 group-hover:text-[#FF6B00]"
                  )}>
                    {count}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
