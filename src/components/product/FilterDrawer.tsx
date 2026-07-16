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
        <SheetHeader className="px-6 py-5 border-b border-border flex flex-row items-center justify-between">
          <SheetTitle className="text-[20px] font-bold text-foreground flex items-center gap-2 m-0">
            <Filter className="w-5 h-5 text-primary" /> Filters
          </SheetTitle>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
          
          {/* Veg / Non-Veg */}
          <div>
            <h3 className="text-[15px] font-bold text-foreground mb-3">Dietary Preference</h3>
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
                      ? "bg-primary text-white border-primary shadow-[0_2px_10px_rgba(255,107,0,0.2)]"
                      : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
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
            <h3 className="text-[15px] font-bold text-foreground mb-3">Sort By</h3>
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
                      ? "bg-accent text-primary border-primary"
                      : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-[15px] font-bold text-foreground mb-3">Rating</h3>
            <div className="flex flex-wrap gap-2">
              {[4.5, 4.0, 3.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleUpdate('rating', filters.rating === rating ? 0 : rating)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-semibold transition-all border",
                    filters.rating === rating
                      ? "bg-accent text-primary border-primary"
                      : "bg-white text-muted-foreground border-border hover:border-warning hover:text-warning"
                  )}
                >
                  {rating}+ <Star className={cn("w-3.5 h-3.5", filters.rating === rating ? "fill-primary text-primary" : "fill-warning text-warning")} />
                </button>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div>
            <h3 className="text-[15px] font-bold text-foreground mb-3">Special Offers</h3>
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
                        ? "bg-accent border-primary text-primary" 
                        : "bg-white border-border text-foreground hover:border-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {offer.icon}
                      <span className="font-semibold text-[14px]">{offer.label}</span>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isActive ? "border-primary bg-primary" : "border-border"
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
        <div className="p-4 border-t border-border bg-white flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-12 rounded-[14px] border-border text-muted-foreground font-bold text-[15px] hover:bg-muted"
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
            className="flex-1 h-12 rounded-[14px] bg-primary hover:bg-primary text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(255,107,0,0.25)]"
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
