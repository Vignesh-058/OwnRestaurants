import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptySearchResultProps {
 query?: string;
 onClear?: () => void;
}

export const EmptySearchResult = ({ query, onClear }: EmptySearchResultProps) => {
 const navigate = useNavigate();
 return (
 <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border-2 border-dashed bg-white/60 min-h-[40vh]">
 <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
 <Search className="h-10 w-10 text-primary/50" />
 </div>
 <h3 className="text-2xl font-black mb-2">No Products Found</h3>
 <p className="text-muted-foreground max-w-sm mb-6">
 {query
 ? `We couldn't find any products for "${query}". Try a different keyword or clear the filters.`
 : 'Start typing to discover products.'}
 </p>
 <div className="flex flex-col sm:flex-row gap-3 justify-center">
 {onClear && (
 <Button variant="outline" className="rounded-full gap-2" onClick={onClear}>
 <X className="h-4 w-4" /> Clear Filters
 </Button>
 )}
 <Button className="rounded-full" onClick={() => navigate('/')}>
 Browse All Products
 </Button>
 </div>
 </div>
 );
};
