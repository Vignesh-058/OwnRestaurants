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
 queryFn: () => orderService.getOrdersByCustomer(currentPage, pageSize),
 enabled: isAuthenticated,
 staleTime: 2 * 60 * 1000, // 2 minutes
 retry: 1,
 });

 useEffect(() => {
 setLoading(query.isLoading || query.isFetching);
 if (query.isError) {
 setError(query.error?.message || 'Failed to fetch orders');
 } else {
 setError(null);
 }
 if (query.data) {
 setOrdersData(query.data.data, query.data.totalOrders, query.data.pagination);
 }
 }, [query.data, query.isLoading, query.isFetching, query.isError, query.error]);

 return query;
};
