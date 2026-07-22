import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { useAuthStore } from '@/store/AuthStore';

export const useOrderDetail = (orderId?: string) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      try {
        const order = await orderService.getOrderById(orderId);
        if (order) return order;
      } catch (_err) {
        const response = await orderService.getOrdersByCustomer(1, 100);
        const orders = response?.data || [];
        const matchingOrder = orders.find(
          (o: any) => o._id === orderId || o.orderId === orderId || o.orderNo === orderId
        );
        if (matchingOrder) return matchingOrder;
      }
      throw new Error('Order not found');
    },
    enabled: isAuthenticated && !!orderId,
    staleTime: 1000 * 30, // 30 seconds
    retry: 2, // Retry twice on failure
  });
};
