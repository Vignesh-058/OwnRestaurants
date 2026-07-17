import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrderStore } from '@/store/OrderStore';
import { useEffect } from 'react';

export const useOrders = () => {
 const { isAuthenticated } = useAuthStore();
 const { currentPage, pageSize, setOrdersData, setLoading, setError } = useOrderStore();

  const query = useQuery({
  queryKey: ['orders', currentPage, pageSize],
  queryFn: async () => {
    console.log('[Order API Request]', { page: currentPage, limit: pageSize });
    const response = await orderService.getOrdersByCustomer(currentPage, pageSize);
    console.log('[Order API Response]', response);
    console.log('[Orders Count]', response.data?.length);
    if (response.data && response.data.length > 0) {
      console.log('[Latest Order ID]', response.data[0]._id);
    }
    return response;
  },
  enabled: isAuthenticated,
  staleTime: 1000 * 30, // 30 seconds
  gcTime: 1000 * 60 * 5, // 5 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: false,
  });

  useEffect(() => {
  if (query.isFetching) {
    console.log('[Refetch Triggered]', { queryKey: ['orders', currentPage, pageSize] });
  }
  setLoading(query.isLoading || query.isFetching);
  if (query.isError) {
 setError(query.error?.message || 'Failed to fetch orders');
 } else {
 setError(null);
 }
 if (query.data) {
 setOrdersData(query.data.data, query.data.totalOrders, query.data.pagination);
 }
 }, [query.data, query.isLoading, query.isFetching, query.isError, query.error, setLoading, setError, setOrdersData, currentPage, pageSize]);

 return query;
};
