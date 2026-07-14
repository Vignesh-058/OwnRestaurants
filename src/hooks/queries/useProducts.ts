import { useCategories } from '@/hooks/useCategories';

export const useProductsQuery = () => {
  const { categories, isLoading, isError, refetch } = useCategories();

  // The 'all' category (index 0) contains the deduplicated array of all products
  const allProducts = categories?.[0]?.items || [];

  return {
    data: allProducts,
    isLoading,
    isError,
    refetch,
    isFetching: isLoading
  };
};
