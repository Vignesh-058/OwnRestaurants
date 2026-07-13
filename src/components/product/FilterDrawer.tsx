import React from 'react';
import { cn } from '@/lib/utils';
import { X, Star, Sparkles, TrendingUp, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { FilterState } from './FilterSidebar'; // We'll export this or define it here

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterDrawer = ({ isOpen, onClose, filters, onFilterChange }: FilterDrawerProps) => {

  const handleUpdate = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleToggleArray = (key: 'offers' | 'availability', value: string) => {
    const current = filters[key] || [];
    if (current.includes(value)) {
      handleUpdate(key, current.filter(v => v !== value));
    } else {
      handleUpdate(key, [...current, value]);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[90vw] sm:max-w-[400px] p-0 flex flex-col bg-white border-none rounded-l-[24px]">
        
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[#E5E7EB] flex flex-row items-center justify-between">
          <SheetTitle className="text-[20px] font-bold text-[#111827] flex items-center gap-2 m-0">
            <Filter className="w-5 h-5 text-[#FF6B00]" /> Filters
          </SheetTitle>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          
          {/* Veg / Non-Veg */}
          <div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-3">Dietary Preference</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'veg', label: 'Pure Veg', icon: <div className="w-2 h-2 rounded-full bg-green-500 border border-green-700" /> },
                { id: 'non-veg', label: 'Non Veg', icon: <div className="w-2 h-2 rounded-full bg-red-500 border border-red-700" /> }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => handleUpdate('foodType', type.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-semibold transition-all border",
                    filters.foodType === type.id
                      ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-[0_2px_10px_rgba(255,107,0,0.2)]"
                      : "bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#FF6B00] hover:text-[#FF6B00]"
                  )}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'recommended', label: 'Recommended' },
                { id: 'price-asc', label: 'Price: Low to High' },
                { id: 'price-desc', label: 'Price: High to Low' },
                { id: 'rating', label: 'Highest Rated' },
                { id: 'best-selling', label: 'Popular' },
                { id: 'newest', label: 'Newest' }
              ].map(sort => (
                <button
                  key={sort.id}
                  onClick={() => handleUpdate('sortBy', sort.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[14px] font-semibold transition-all border",
                    filters.sortBy === sort.id
                      ? "bg-[#FFF7ED] text-[#FF6B00] border-[#FF6B00]"
                      : "bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#FF6B00] hover:text-[#FF6B00]"
                  )}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-3">Rating</h3>
            <div className="flex flex-wrap gap-2">
              {[4.5, 4.0, 3.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleUpdate('rating', filters.rating === rating ? 0 : rating)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold transition-all border",
                    filters.rating === rating
                      ? "bg-[#FFF7ED] text-[#FF6B00] border-[#FF6B00]"
                      : "bg-white text-[#64748B] border-[#E5E7EB] hover:border-[#F59E0B] hover:text-[#F59E0B]"
                  )}
                >
                  {rating}+ <Star className={cn("w-3.5 h-3.5", filters.rating === rating ? "fill-[#FF6B00] text-[#FF6B00]" : "fill-[#F59E0B] text-[#F59E0B]")} />
                </button>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div>
            <h3 className="text-[15px] font-bold text-[#111827] mb-3">Special Offers</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: 'discount', label: 'Discounted Items', icon: <Sparkles className="w-4 h-4 text-pink-500" /> },
                { id: 'bogo', label: 'Buy One Get One', icon: <TrendingUp className="w-4 h-4 text-blue-500" /> }
              ].map(offer => {
                const isActive = (filters.offers || []).includes(offer.id);
                return (
                  <button
                    key={offer.id}
                    onClick={() => handleToggleArray('offers', offer.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-[12px] border transition-all",
                      isActive 
                        ? "bg-[#FFF7ED] border-[#FF6B00] text-[#FF6B00]" 
                        : "bg-white border-[#E5E7EB] text-[#111827] hover:border-[#FF6B00]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {offer.icon}
                      <span className="font-semibold text-[14px]">{offer.label}</span>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isActive ? "border-[#FF6B00] bg-[#FF6B00]" : "border-[#CBD5E1]"
                    )}>
                      {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 rounded-[14px] border-[#E5E7EB] text-[#64748B] font-bold text-[15px] hover:bg-[#F8FAFC]"
            onClick={() => {
              onFilterChange({
                ...filters,
                foodType: 'all',
                priceRange: [0, 5000],
                rating: 0,
                offers: [],
                deliveryTime: 0,
                availability: [],
                sortBy: 'recommended'
              });
            }}
          >
            Clear All
          </Button>
          <Button 
            className="flex-1 h-12 rounded-[14px] bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(255,107,0,0.25)]"
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
