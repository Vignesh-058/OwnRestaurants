import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/hooks/useSearch';
import { useFilters } from '@/hooks/useFilters';
import { useSearchStore } from '@/store/SearchStore';
import { SearchBar } from '@/components/search/SearchBar';
import { SortDropdown } from '@/components/search/SortDropdown';
import { FilterDrawer } from '@/components/search/FilterDrawer';
import { FilterChips } from '@/components/search/FilterChip';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchSkeleton } from '@/components/search/SearchSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { CategoryItem } from '@/types/category.types';
import { useEffect } from 'react';

export const SearchPage = () => {
 const navigate = useNavigate();
 const { results, isLoading, isError, refetch } = useSearch();
 const { addRecentlyViewed } = useSearchStore();
 const { activeFilterCount, setFilterDrawerOpen } = useFilters();

 useEffect(() => { window.scrollTo(0, 0); }, []);

 const handleProductClick = (product: CategoryItem) => {
 addRecentlyViewed(product);
 navigate(`/product/${product._id}`);
 };

 return (
 <div className="min-h-screen bg-background ">
 {/* ── Sticky search header (Mobile only, hidden on desktop to avoid duplicate search inputs) ── */}
 <div className="sticky top-[80px] z-40 bg-white/95 dark:bg-black/90 backdrop-blur-lg border-b shadow-sm md:hidden">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
 <div className="flex items-center gap-3">
 <SearchBar autoFocus className="flex-1" />

 {/* Mobile filter trigger */}
 <Button
 variant="outline"
 size="icon"
 className="lg:hidden rounded-full relative h-14 w-14 shrink-0"
 onClick={() => setFilterDrawerOpen(true)}
 aria-label="Open filters"
 >
 <SlidersHorizontal className="h-5 w-5" />
 {activeFilterCount > 0 && (
 <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
 {activeFilterCount}
 </span>
 )}
 </Button>
 </div>

 {/* Active filter chips */}
 <FilterChips />
 </div>
 </div>

 {/* ── Body ── */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <div className="flex gap-8">

 {/* Desktop sidebar filters */}
 <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-36">
 <div className="bg-white rounded-3xl border p-6 shadow-sm">
 <SearchFilters inline />
 </div>
 </aside>

 {/* Results column */}
 <div className="flex-1 min-w-0 space-y-5">
 {/* Toolbar */}
 <div className="flex items-center justify-between gap-3">
 <h1 className="text-xl font-black text-foreground flex items-center gap-2">
 <Search className="h-5 w-5 text-primary" />
 Product Search
 </h1>
 <div className="flex items-center gap-2">
 <SortDropdown />
 <div className="lg:hidden">
 <FilterDrawer />
 </div>
 </div>
 </div>

 {/* Content */}
 {isLoading ? (
 <SearchSkeleton />
 ) : isError ? (
 <ErrorState variant="server" onRetry={() => refetch()} retryLabel="Retry" />
 ) : (
 <SearchResults results={results} onProductClick={handleProductClick} />
 )}
 </div>

 </div>
 </div>

 {/* Mobile / tablet filter sheet */}
 <FilterDrawer />
 </div>
 );
};
