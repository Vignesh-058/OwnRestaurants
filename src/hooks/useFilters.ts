import { useSearchStore } from '@/store/SearchStore';

export const useFilters = () => {
 const { filters, setFilters, resetFilters, sortBy, setSortBy, isFilterDrawerOpen, setFilterDrawerOpen } = useSearchStore();

 const activeFilterCount = [
 filters.dietary !== 'all',
 filters.minPrice !== null || filters.maxPrice !== null,
 filters.inStockOnly,
 filters.hasOffer,
 filters.categoryId !== null,
 ].filter(Boolean).length;

 return {
 filters,
 setFilters,
 resetFilters,
 sortBy,
 setSortBy,
 isFilterDrawerOpen,
 setFilterDrawerOpen,
 activeFilterCount,
 };
};
