import React from 'react';
import { X } from 'lucide-react';
import type { FilterState } from './FilterSidebar';
import type { Category } from '@/types/category.types';

interface FilterChipsProps {
  filters: FilterState;
  categories: Category[];
  onRemoveFilter: (key: keyof FilterState, value: any) => void;
  onClearAll: () => void;
}

export const FilterChips = ({ filters, categories, onRemoveFilter, onClearAll }: FilterChipsProps) => {
  const chips: { key: keyof FilterState; value: any; label: string }[] = [];

  // Categories are no longer part of FilterChips

  // Food Type
  if (filters.foodType !== 'all') {
    chips.push({ 
      key: 'foodType', 
      value: filters.foodType, 
      label: filters.foodType === 'veg' ? 'Veg' : 'Non Veg' 
    });
  }

  // Price Range
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
    chips.push({
      key: 'priceRange',
      value: filters.priceRange,
      label: `₹${filters.priceRange[0]}–₹${filters.priceRange[1]}`
    });
  }

  // Rating
  if (filters.rating > 0) {
    chips.push({
      key: 'rating',
      value: filters.rating,
      label: `${filters.rating}★ & Above`
    });
  }

  // Offers
  filters.offers.forEach(offer => {
    const labelMap: Record<string, string> = {
      'discount': 'Discount',
      'combo': 'Combo Deals',
      'bogo': 'Buy 1 Get 1',
      'free-delivery': 'Free Delivery'
    };
    chips.push({ key: 'offers', value: offer, label: labelMap[offer] || offer });
  });

  // Delivery Time
  if (filters.deliveryTime > 0) {
    chips.push({
      key: 'deliveryTime',
      value: filters.deliveryTime,
      label: `Under ${filters.deliveryTime} mins`
    });
  }

  // Availability
  filters.availability.forEach(avail => {
    const labelMap: Record<string, string> = {
      'available': 'Available Now',
      'out-of-stock': 'Out of Stock'
    };
    chips.push({ key: 'availability', value: avail, label: labelMap[avail] || avail });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      {chips.map((chip, index) => (
        <div 
          key={`${chip.key}-${index}`} 
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm text-sm text-[#111827] group"
        >
          <span>{chip.label}</span>
          <button 
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="text-[#64748B] group-hover:text-[#FF6B00] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button 
        onClick={onClearAll}
        className="text-sm font-medium text-[#FF6B00] hover:underline px-2"
      >
        Clear All
      </button>
    </div>
  );
};
