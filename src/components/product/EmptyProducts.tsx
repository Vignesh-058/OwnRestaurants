import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyProductsProps {
 onClearFilters: () => void;
}

export const EmptyProducts = ({ onClearFilters }: EmptyProductsProps) => {
 return (
 <div className="w-full flex flex-col items-center justify-center py-32 px-4 text-center bg-background">
 <div className="h-24 w-24 bg-[#0C6CEA]/10 rounded-full flex items-center justify-center mb-6">
 <SearchX className="h-12 w-12 text-[#0C6CEA]" />
 </div>
 <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2">No products found</h2>
 <p className="text-[#6B7280] text-lg mb-8 max-w-md">
 Try another category or search term.
 </p>
 <Button 
 onClick={onClearFilters}
 size="lg"
 className="rounded-full px-8 bg-[#0C6CEA] hover:bg-[#0055CC] text-white font-bold shadow-md hover:-translate-y-0.5 transition-all duration-300"
 >
 Clear Filters
 </Button>
 </div>
 );
};
