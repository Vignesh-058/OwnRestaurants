import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/AuthStore';

export const useOrderDetail = (orderId?: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      console.log('[Order Details] Fetching for ID:', orderId);
      try {
        // Since backend doesn't have a direct /order/:id endpoint, 
        // we fetch the customer orders and search for the matching ID
        const response = await orderService.getOrdersByCustomer(1, 100);
        const responseAny = response as any;
        const orders = responseAny?.data || responseAny?.orders || response || [];
        const matchingOrder = (Array.isArray(orders) ? orders : []).find(
          (o: any) => o._id === orderId || o.orderId === orderId || o.orderNo === orderId
        );
        if (matchingOrder) {
          return matchingOrder;
        }
        throw new Error('Order not found');
      } catch (err) {
        throw err;
      }
    },
    enabled: isAuthenticated && !!orderId,
    staleTime: 1000 * 30, // 30 seconds
    retry: 2, // Retry twice on failure
  });
};
