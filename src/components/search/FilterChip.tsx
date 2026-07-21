import { X } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { useSearchStore } from '@/store/SearchStore';
import { Badge } from '@/components/ui/badge';

interface FilterChipProps {
 label: string;
 onRemove: () => void;
}

const FilterChip = ({ label, onRemove }: FilterChipProps) => (
 <Badge
 variant="outline"
 className="rounded-full h-8 px-3 gap-2 font-semibold text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-default select-none"
 >
 {label}
 <button
 onClick={onRemove}
 className="text-primary/70 hover:text-primary ml-0.5"
 aria-label={`Remove ${label} filter`}
 >
 <X className="h-3 w-3" />
 </button>
 </Badge>
);

export const FilterChips = () => {
 const { filters, setFilters, resetFilters, activeFilterCount } = useFilters();
 const { debouncedQuery, setDebouncedQuery, setQuery } = useSearchStore();

 if (activeFilterCount === 0 && !debouncedQuery.trim()) return null;

 return (
 <div className="flex flex-wrap gap-2 items-center">
 {debouncedQuery.trim() && (
 <FilterChip
 label={`"${debouncedQuery}"`}
 onRemove={() => { setQuery(''); setDebouncedQuery(''); }}
 />
 )}
 {filters.dietary !== 'all' && (
 <FilterChip
 label={filters.dietary === 'veg' ? ' Veg' : ' Non-Veg'}
 onRemove={() => setFilters({ dietary: 'all' })}
 />
 )}
 {(filters.minPrice !== null || filters.maxPrice !== null) && (
 <FilterChip
 label={`₹${filters.minPrice ?? 0} – ₹${filters.maxPrice ?? '∞'}`}
 onRemove={() => setFilters({ minPrice: null, maxPrice: null })}
 />
 )}
 {filters.inStockOnly && (
 <FilterChip label="In Stock" onRemove={() => setFilters({ inStockOnly: false })} />
 )}
 {filters.hasOffer && (
 <FilterChip label=" Offers" onRemove={() => setFilters({ hasOffer: false })} />
 )}

 {activeFilterCount > 1 && (
 <button
 className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
 onClick={resetFilters}
 >
 Clear all filters
 </button>
 )}
 </div>
 );
};
