import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import type { SortOption } from '@/store/SearchStore';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
 { value: 'popular', label: 'Popularity' },
 { value: 'price_asc', label: 'Price: Low to High' },
 { value: 'price_desc', label: 'Price: High to Low' },
 { value: 'discount', label: 'Highest Discount' },
 { value: 'az', label: 'A → Z' },
];

export const SortDropdown = () => {
 const { sortBy, setSortBy } = useFilters();

 return (
 <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
 <SelectTrigger className="w-auto min-w-[180px] rounded-full h-10 bg-white border-transparent gap-2 font-semibold text-sm">
 <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
 <SelectValue placeholder="Sort by" />
 </SelectTrigger>
 <SelectContent className="rounded-2xl">
 {SORT_OPTIONS.map((opt) => (
 <SelectItem key={opt.value} value={opt.value} className="rounded-xl my-0.5 font-medium">
 {opt.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 );
};
