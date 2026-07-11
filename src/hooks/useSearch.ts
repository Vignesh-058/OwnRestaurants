import { useRef } from 'react';
import { useSearchStore } from '@/store/SearchStore';
import { useCategories as useCategoriesQuery } from '@/hooks/queries/useCategories';
import type { CategoryItem, Category } from '@/types/category.types';
import type { SearchFilters, SortOption } from '@/store/SearchStore';
import { useMemo } from 'react';

// ── Debounced search query hook ──────────────────────────────────────────────
export const useSearchQuery = (delay = 300) => {
 const { query, setQuery, setDebouncedQuery, addToHistory } = useSearchStore();
 const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

 const handleChange = (value: string) => {
 setQuery(value);
 if (timer.current) clearTimeout(timer.current);
 timer.current = setTimeout(() => {
 setDebouncedQuery(value);
 if (value.trim().length >= 2) addToHistory(value.trim());
 }, delay);
 };

 const clear = () => {
 setQuery('');
 setDebouncedQuery('');
 };

 return { query, handleChange, clear };
};

// ── Flatten + filter + sort products from categories ─────────────────────────
const applyFilters = (
 items: CategoryItem[],
 filters: SearchFilters,
 sort: SortOption,
 query: string
): CategoryItem[] => {
 let result = [...items];

 if (query.trim()) {
 const q = query.toLowerCase();
 result = result.filter(
 (p) =>
 p.name.toLowerCase().includes(q) ||
 p.description?.toLowerCase().includes(q) ||
 p.tag?.some((t: any) => {
          const tagStr = typeof t === 'string' ? t : t?.name || '';
          return tagStr.toLowerCase().includes(q);
        })
 );
 }

 if (filters.dietary !== 'all') {
 result = result.filter((p) =>
 filters.dietary === 'veg'
 ? ['veg', 'vegan'].includes(p.dietryType?.toLowerCase() ?? '')
 : p.dietryType?.toLowerCase() === 'non-veg'
 );
 }

 if (filters.minPrice !== null) result = result.filter((p) => p.sellingPrice >= filters.minPrice!);
 if (filters.maxPrice !== null) result = result.filter((p) => p.sellingPrice <= filters.maxPrice!);
 if (filters.inStockOnly) result = result.filter((p) => p.inStock);
 if (filters.hasOffer) result = result.filter((p) => (p.discount && p.discount.value) || p.basePrice > p.sellingPrice);
 if (filters.categoryId) result = result.filter((p) => p.category === filters.categoryId);

 switch (sort) {
 case 'price_asc': result.sort((a, b) => a.sellingPrice - b.sellingPrice); break;
 case 'price_desc': result.sort((a, b) => b.sellingPrice - a.sellingPrice); break;
 case 'discount': result.sort((a, b) => (b.basePrice - b.sellingPrice) - (a.basePrice - a.sellingPrice)); break;
 case 'az': result.sort((a, b) => a.name.localeCompare(b.name)); break;
 }

 return result;
};

// ── Main search hook used by SearchPage ──────────────────────────────────────
export const useSearch = () => {
 const { debouncedQuery, filters, sortBy } = useSearchStore();
 const { data: categories, isLoading, isError, refetch } = useCategoriesQuery();

 const allProducts = useMemo(() => {
 if (!categories) return [];
 const map = new Map<string, CategoryItem>();
 categories.forEach((cat: Category) => {
 cat.items?.forEach((item) => map.set(item._id, { ...item, category: item.category ?? cat._id }));
 });
 return Array.from(map.values());
 }, [categories]);

 const results = useMemo(
 () => applyFilters(allProducts, filters, sortBy, debouncedQuery),
 [allProducts, filters, sortBy, debouncedQuery]
 );

 const suggestions = useMemo(() => {
 if (!debouncedQuery.trim()) return [];
 const q = debouncedQuery.toLowerCase();
 return allProducts.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6).map((p) => p.name);
 }, [allProducts, debouncedQuery]);

 return { results, allProducts, isLoading, isError, refetch, suggestions };
};
