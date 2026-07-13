import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { SortOption, FoodType } from '@/hooks/useProductFilters';

interface ProductFilterPanelProps {
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  offers: string[];
  setOffers: (val: string[]) => void;
  ratings: number[];
  setRatings: (val: number[]) => void;
  foodType: FoodType;
  setFoodType: (val: FoodType) => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  resetFilters: () => void;
  onApplyMobile?: () => void;
}

const AccordionSection = ({ title, defaultOpen = true, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#F1F5F9] py-4 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left font-bold text-[#111827] text-[15px]"
      >
        {title}
        <ChevronDown className={cn("w-4 h-4 text-[#94A3B8] transition-transform duration-300", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductFilterPanel = ({
  priceRange, setPriceRange,
  offers, setOffers,
  ratings, setRatings,
  foodType, setFoodType,
  sortBy, setSortBy,
  inStockOnly, setInStockOnly,
  resetFilters,
  onApplyMobile
}: ProductFilterPanelProps) => {
  
  const toggleOffer = (offer: string) => {
    if (offers.includes(offer)) {
      setOffers(offers.filter(o => o !== offer));
    } else {
      setOffers([...offers, offer]);
    }
  };

  const toggleRating = (rating: number) => {
    if (ratings.includes(rating)) {
      setRatings(ratings.filter(r => r !== rating));
    } else {
      setRatings([...ratings, rating]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#F8FAFC]">
      <div className="p-5 flex items-center justify-between border-b border-[#F1F5F9] shrink-0">
        <h3 className="font-black text-[18px] text-[#111827]">Filters</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#E2E8F0] scrollbar-track-transparent">
        
        {/* Sort By */}
        <AccordionSection title="Sort By">
          <RadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)} className="flex flex-col gap-3">
            {[
              { id: 'popularity', label: 'Popularity' },
              { id: 'price-low', label: 'Price: Low to High' },
              { id: 'price-high', label: 'Price: High to Low' },
              { id: 'newest', label: 'Newest Arrivals' },
              { id: 'rating', label: 'Customer Rating' },
            ].map(option => (
              <div key={option.id} className="flex items-center space-x-3">
                <RadioGroupItem value={option.id} id={`sort-${option.id}`} className="border-[#CBD5E1] text-[#FF6B00]" />
                <label htmlFor={`sort-${option.id}`} className="text-[14px] font-medium text-[#475569] cursor-pointer hover:text-[#0F172A]">{option.label}</label>
              </div>
            ))}
          </RadioGroup>
        </AccordionSection>

        {/* Price Range */}
        <AccordionSection title="Price">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center text-[13px] font-bold text-[#FF6B00]">
              <span className="bg-[#FFF7ED] px-2 py-1 rounded-[6px]">₹{priceRange[0]}</span>
              <span className="bg-[#FFF7ED] px-2 py-1 rounded-[6px]">₹{priceRange[1] === 5000 ? '5000+' : priceRange[1]}</span>
            </div>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="[&_[role=slider]]:border-[#FF6B00] [&_[role=slider]]:bg-white [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&>span:first-child]:bg-[#FFEDD5] [&>span:first-child>span]:bg-[#FF6B00]"
            />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1 block">Min Price</label>
                <select 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] h-9 text-[13px] font-medium text-[#0F172A] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                >
                  {[0, 100, 250, 500, 1000].map(v => <option key={v} value={v}>₹{v}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1 block">Max Price</label>
                <select 
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] h-9 text-[13px] font-medium text-[#0F172A] focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                >
                  {[500, 1000, 2000, 5000].map(v => <option key={v} value={v}>{v === 5000 ? '₹5000+' : `₹${v}`}</option>)}
                </select>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Offers */}
        <AccordionSection title="Offers">
          <div className="flex flex-col gap-3">
            {['Discounted Products', 'Buy 1 Get 1', 'Free Delivery', 'Today\'s Deals', 'Cashback Offers'].map(offer => (
              <div key={offer} className="flex items-center space-x-3">
                <Checkbox 
                  id={`offer-${offer}`} 
                  checked={offers.includes(offer)}
                  onCheckedChange={() => toggleOffer(offer)}
                  className="border-[#CBD5E1] data-[state=checked]:bg-[#FF6B00] data-[state=checked]:border-[#FF6B00]"
                />
                <label htmlFor={`offer-${offer}`} className="text-[14px] font-medium text-[#475569] cursor-pointer hover:text-[#0F172A] leading-none">{offer}</label>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Customer Ratings */}
        <AccordionSection title="Customer Ratings">
          <div className="flex flex-col gap-3">
            {[4, 3, 2].map(rating => (
              <div key={rating} className="flex items-center space-x-3">
                <Checkbox 
                  id={`rating-${rating}`} 
                  checked={ratings.includes(rating)}
                  onCheckedChange={() => toggleRating(rating)}
                  className="border-[#CBD5E1] data-[state=checked]:bg-[#FF6B00] data-[state=checked]:border-[#FF6B00]"
                />
                <label htmlFor={`rating-${rating}`} className="text-[14px] font-medium text-[#475569] cursor-pointer hover:text-[#0F172A] leading-none flex items-center gap-1">
                  {rating}<span className="text-[#F59E0B]">★</span> & Above
                </label>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Food Type */}
        <AccordionSection title="Food Type">
          <RadioGroup value={foodType} onValueChange={(v) => setFoodType(v as FoodType)} className="flex flex-col gap-3">
            {[
              { id: 'all', label: 'All Types', icon: '🍽️' },
              { id: 'veg', label: 'Veg', icon: '🌱' },
              { id: 'non-veg', label: 'Non Veg', icon: '🍗' },
            ].map(option => (
              <div key={option.id} className="flex items-center space-x-3">
                <RadioGroupItem value={option.id} id={`food-${option.id}`} className="border-[#CBD5E1] text-[#FF6B00]" />
                <label htmlFor={`food-${option.id}`} className="text-[14px] font-medium text-[#475569] cursor-pointer hover:text-[#0F172A] flex items-center gap-1.5">
                  {option.label} <span>{option.icon}</span>
                </label>
              </div>
            ))}
          </RadioGroup>
        </AccordionSection>

        {/* Availability */}
        <AccordionSection title="Availability">
          <div className="flex items-center justify-between">
            <label htmlFor="in-stock" className="text-[14px] font-medium text-[#475569] cursor-pointer hover:text-[#0F172A]">
              In Stock Only
            </label>
            <Switch 
              id="in-stock" 
              checked={inStockOnly} 
              onCheckedChange={setInStockOnly}
              className="data-[state=checked]:bg-[#10B981]"
            />
          </div>
        </AccordionSection>

      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-[#F1F5F9] bg-white sticky bottom-0 rounded-b-[16px] shadow-[0_-4px_10px_rgba(0,0,0,0.02)] shrink-0 flex items-center gap-3">
        <Button 
          variant="outline"
          onClick={resetFilters}
          className="flex-1 border-[#E2E8F0] text-[#475569] font-bold h-12 rounded-[12px] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        >
          Reset Filters
        </Button>
        <Button 
          onClick={onApplyMobile} 
          className="flex-1 bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold h-12 rounded-[12px] shadow-[0_4px_12px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_16px_rgba(255,107,0,0.3)] transition-all"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
