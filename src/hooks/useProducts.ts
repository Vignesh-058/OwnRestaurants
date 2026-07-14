import { useMemo } from 'react';
import type { CategoryItem } from '@/types/category.types';

export const useProducts = (
 allProducts: CategoryItem[] | undefined,
 activeCategoryId: string,
 searchQuery: string = ''
) => {
 return useMemo(() => {
 if (!allProducts) return [];

 let filteredProducts: CategoryItem[] = [];

 // Filter by Category
 if (activeCategoryId === 'all') {
   filteredProducts = allProducts;
 } else {
   filteredProducts = allProducts.filter(p => p.category === activeCategoryId || (p as any).categoryId === activeCategoryId);
 }

 // Filter by Search Query
 if (searchQuery?.trim()) {
 const lowerQuery = searchQuery.toLowerCase().trim();
 filteredProducts = filteredProducts.filter(product => 
 product.name.toLowerCase().includes(lowerQuery) || 
 (product.description && product.description.toLowerCase().includes(lowerQuery))
 );
 }

 return filteredProducts;
 }, [allProducts, activeCategoryId, searchQuery]);
};
