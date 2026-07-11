import { useFilters } from '@/hooks/useFilters';
import { useCategories as useCategoriesQuery } from '@/hooks/queries/useCategories';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
 inline?: boolean;
}

export const SearchFilters = ({ inline = false }: SearchFiltersProps) => {
 const { filters, setFilters, resetFilters, activeFilterCount } = useFilters();
 const { data: categories } = useCategoriesQuery();

 const [localMin, setLocalMin] = useState(filters.minPrice ?? 0);
 const [localMax, setLocalMax] = useState(filters.maxPrice ?? 2000);

 const applyPrice = () => {
 setFilters({ minPrice: localMin > 0 ? localMin : null, maxPrice: localMax < 2000 ? localMax : null });
 };

 return (
 <div className={inline ? '' : 'space-y-6'}>
 {/* Header (sidebar only) */}
 {inline && (
 <div className="flex items-center justify-between pb-4 border-b">
 <div className="flex items-center gap-2 font-black text-lg">
 <SlidersHorizontal className="h-5 w-5 text-primary" />
 Filters
 {activeFilterCount > 0 && (
 <span className="h-5 w-5 text-xs bg-primary text-white rounded-full flex items-center justify-center">
 {activeFilterCount}
 </span>
 )}
 </div>
 {activeFilterCount > 0 && (
 <button className="text-sm text-primary hover:underline" onClick={resetFilters}>
 Reset
 </button>
 )}
 </div>
 )}

 {/* Dietary */}
 <div>
 <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Dietary</Label>
 <div className="flex flex-wrap gap-2">
 {(['all', 'veg', 'non-veg'] as const).map((d) => (
 <button
 key={d}
 onClick={() => setFilters({ dietary: d })}
 className={`h-8 px-4 rounded-full border text-sm font-semibold transition-all ${
 filters.dietary === d
 ? 'bg-primary text-white border-primary shadow-sm'
 : 'bg-white text-muted-foreground hover:border-primary/50'
 }`}
 >
 {d === 'all' ? 'All' : d === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}
 </button>
 ))}
 </div>
 </div>

 <Separator />

 {/* Price range */}
 <div>
 <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
 Price Range: ₹{localMin} – ₹{localMax === 2000 ? '∞' : localMax}
 </Label>
 <div className="px-1 pb-2">
 <Slider
 min={0}
 max={2000}
 step={50}
 value={[localMin, localMax]}
 onValueChange={([min, max]) => { setLocalMin(min); setLocalMax(max); }}
 onValueCommit={applyPrice}
 className="my-4"
 />
 </div>
 <div className="flex justify-between text-xs text-muted-foreground">
 <span>₹0</span><span>₹2000+</span>
 </div>
 </div>

 <Separator />

 {/* Availability */}
 <div>
 <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Availability</Label>
 <div className="flex flex-col gap-2">
 <label className="flex items-center gap-3 cursor-pointer group">
 <input
 type="checkbox"
 checked={filters.inStockOnly}
 onChange={(e) => setFilters({ inStockOnly: e.target.checked })}
 className="rounded border-border h-4 w-4 accent-primary"
 />
 <span className="text-sm font-medium">In Stock Only</span>
 </label>
 <label className="flex items-center gap-3 cursor-pointer group">
 <input
 type="checkbox"
 checked={filters.hasOffer}
 onChange={(e) => setFilters({ hasOffer: e.target.checked })}
 className="rounded border-border h-4 w-4 accent-primary"
 />
 <span className="text-sm font-medium">🏷 Has Offer / Discount</span>
 </label>
 </div>
 </div>

 {/* Categories */}
 {categories && categories.length > 0 && (
 <>
 <Separator />
 <div>
 <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Category</Label>
 <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
 <button
 onClick={() => setFilters({ categoryId: null })}
 className={`text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${
 !filters.categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
 }`}
 >
 All Categories
 </button>
 {categories.map((cat) => (
 <button
 key={cat._id}
 onClick={() => setFilters({ categoryId: cat._id })}
 className={`text-left text-sm px-3 py-2 rounded-xl transition-colors font-medium ${
 filters.categoryId === cat._id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'
 }`}
 >
 {cat.name}
 </button>
 ))}
 </div>
 </div>
 </>
 )}

 {!inline && activeFilterCount > 0 && (
 <Button variant="outline" className="w-full rounded-full gap-2 mt-4" onClick={resetFilters}>
 <X className="h-4 w-4" /> Clear All Filters
 </Button>
 )}
 </div>
 );
};
