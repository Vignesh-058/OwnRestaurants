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
      const data = await orderService.getOrderDetail(orderId);
      if (data) {
        return data;
      }
      throw new Error('Order not found');
    },
    enabled: isAuthenticated && !!orderId,
    staleTime: 1000 * 30, // 30 seconds
    retry: 2, // Retry twice on failure
  });
};
