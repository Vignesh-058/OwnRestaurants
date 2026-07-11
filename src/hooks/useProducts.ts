import { useMemo } from 'react';
import type { CategoryItem, Category } from '@/types/category.types';

export const useProducts = (
 categories: Category[] | undefined,
 activeCategoryId: string,
 searchQuery: string = ''
) => {
 return useMemo(() => {
 if (!categories) return [];

 let filteredProducts: CategoryItem[] = [];

 // Filter by Category
 if (activeCategoryId === 'all') {
 // Flatten all products
 const allItems = categories.flatMap(cat => cat.items || []);
 
 // Remove duplicates just in case multiple categories share items (depends on backend)
 const uniqueItemsMap = new Map<string, CategoryItem>();
 allItems.forEach(item => {
 uniqueItemsMap.set(item._id, item);
 });
 filteredProducts = Array.from(uniqueItemsMap.values());
 } else {
 // Select specific category
 const targetCategory = categories.find(c => c._id === activeCategoryId);
 filteredProducts = targetCategory?.items || [];
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
 }, [categories, activeCategoryId, searchQuery]);
};
