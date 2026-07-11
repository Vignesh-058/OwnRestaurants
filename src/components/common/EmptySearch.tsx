import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptySearchProps {
 query?: string;
 onClear?: () => void;
}

export const EmptySearch = ({ query, onClear }: EmptySearchProps) => (
 <div className="flex flex-col items-center justify-center p-14 text-center rounded-3xl border-2 border-dashed bg-white/50">
 <div className="h-18 w-18 bg-primary/10 rounded-full flex items-center justify-center mb-6 p-5">
 <Search className="h-10 w-10 text-primary" />
 </div>
 <h3 className="text-xl font-bold mb-2">No Results Found</h3>
 <p className="text-muted-foreground text-sm max-w-xs mb-6">
 {query
 ? `We couldn't find any results for "${query}". Try a different keyword.`
 : 'No results match your search. Try something different.'}
 </p>
 {onClear && (
 <Button variant="outline" className="rounded-full" onClick={onClear}>
 Clear Search
 </Button>
 )}
 </div>
);
