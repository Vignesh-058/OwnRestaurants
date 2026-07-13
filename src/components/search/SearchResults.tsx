import { memo, useState } from 'react';
import type { CategoryItem } from '@/types/category.types';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptySearchResult } from './EmptySearchResult';
import { useSearchStore } from '@/store/SearchStore';
import { useFilters } from '@/hooks/useFilters';

interface SearchResultsProps {
 results: CategoryItem[];
 onProductClick: (product: CategoryItem) => void;
}

const PAGE_SIZE = 24;

export const SearchResults = memo(({ results, onProductClick }: SearchResultsProps) => {
 const { debouncedQuery } = useSearchStore();
 const { resetFilters } = useFilters();
 const [page, setPage] = useState(1);

 const visibleResults = results.slice(0, page * PAGE_SIZE);
 const hasMore = results.length > visibleResults.length;

 const handleClear = () => {
 resetFilters();
 useSearchStore.getState().setQuery('');
 useSearchStore.getState().setDebouncedQuery('');
 };

 if (results.length === 0) {
 return <EmptySearchResult query={debouncedQuery} onClear={handleClear} />;
 }

 return (
 <div className="space-y-6">
 {/* Count */}
 <p className="text-sm text-muted-foreground font-medium">
 <span className="font-black text-foreground">{results.length}</span> product{results.length !== 1 ? 's' : ''} found
 </p>

 {/* Grid */}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
 {visibleResults.map((product) => (
 <ProductCard
 key={product._id}
 product={product}
 onClick={onProductClick}
 />
 ))}
 </div>

 {/* Load more */}
 {hasMore && (
 <div className="flex justify-center pt-4">
 <button
 onClick={() => setPage((p) => p + 1)}
 className="h-12 px-8 rounded-full border-2 border-primary/30 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
 >
 Load More ({results.length - visibleResults.length} remaining)
 </button>
 </div>
 )}
 </div>
 );
});

SearchResults.displayName = 'SearchResults';
