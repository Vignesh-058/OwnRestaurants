import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/AuthStore';
import { useOrderStore } from '@/store/OrderStore';

export const useOrders = () => {
 const { isAuthenticated } = useAuthStore();
 const { currentPage, pageSize } = useOrderStore();

 return useQuery({
 queryKey: ['orders', currentPage, pageSize],
 queryFn: () => orderService.getOrdersByCustomer(currentPage, pageSize),
 enabled: isAuthenticated,
 staleTime: 2 * 60 * 1000, // 2 minutes
 retry: 1,
 });
};
