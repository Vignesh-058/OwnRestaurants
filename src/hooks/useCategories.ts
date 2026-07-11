import { useState, useCallback, useMemo } from 'react';
import { useCategories as useCategoriesQuery } from '@/hooks/queries/useCategories';
import type { Category } from '@/types/category.types';

// Create an 'All' category to unshift into the list
const allCategory: Category = {
 _id: 'all',
 name: 'All',
 items: [],
 iconImage: undefined,
 image: undefined,
} as unknown as Category;

export const useCategories = () => {
 const { data: originalCategories, isLoading, isError, refetch } = useCategoriesQuery();

 const categories = useMemo(() => {
 if (!originalCategories) return [];
 return [allCategory, ...originalCategories];
 }, [originalCategories]);

 // 'all' is the default active category
 const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

 const handleSelectCategory = useCallback((id: string) => {
 setActiveCategoryId(id);
 }, []);

 return {
 categories,
 originalCategories,
 activeCategoryId,
 setActiveCategoryId: handleSelectCategory,
 isLoading,
 isError,
 refetch
 };
};
