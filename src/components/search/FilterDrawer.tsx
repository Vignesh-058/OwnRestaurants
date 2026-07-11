import {
 Sheet,
 SheetContent,
 SheetHeader,
 SheetTitle,
 SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { useFilters } from '@/hooks/useFilters';

interface FilterDrawerProps {
 children?: React.ReactNode;
}

export const FilterDrawer = ({ children }: FilterDrawerProps) => {
 const { activeFilterCount, isFilterDrawerOpen, setFilterDrawerOpen } = useFilters();

 return (
 <Sheet open={isFilterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
 <SheetTrigger asChild>
 {children ?? (
 <Button variant="outline" className="rounded-full gap-2 relative">
 <SlidersHorizontal className="h-4 w-4" />
 Filters
 {activeFilterCount > 0 && (
 <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
 {activeFilterCount}
 </span>
 )}
 </Button>
 )}
 </SheetTrigger>
 <SheetContent side="right" className="w-[340px] sm:w-[400px] overflow-y-auto">
 <SheetHeader className="mb-6">
 <SheetTitle className="flex items-center gap-2">
 <SlidersHorizontal className="h-5 w-5 text-primary" />
 Filters & Preferences
 </SheetTitle>
 </SheetHeader>
 <SearchFilters />
 </SheetContent>
 </Sheet>
 );
};
