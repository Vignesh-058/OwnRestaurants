import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { toast } from 'sonner';
import type { CartCreateRequest } from '@/types/cart.types';

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  const { setOrderId, setCart } = useCartStore();

  return useMutation({
    mutationFn: (payload: CartCreateRequest) => {
      console.log('[Cart] Update Payload:', JSON.stringify(payload, null, 2));
      return cartService.updateCart(payload);
    },
    onSuccess: async (data) => {
      console.log('[Cart] API Success (updateCart):', data);

      // Persist orderId from response
      const newOrderId = data?.data?.order?.orderId || data?.data?.orderId || data?.data?._id;
      if (newOrderId) {
        setOrderId(newOrderId);
      }

      // Invalidate and immediately refetch cart query
      console.log('[Cart] Query Invalidated');
      await queryClient.invalidateQueries({ queryKey: ['cart'] });

      // After refetch, useCart's queryFn calls setCart — store is updated via the query
      console.log('[Cart] Refetch Success');
    },
    onError: (error: any) => {
      console.error('[Cart] API Error (updateCart):', error);
      const status = error?.response?.status;
      if (status === 401) return;
      const message = error?.response?.data?.message || 'Unable to update cart.';
      toast.error(message);
    }
  });
};
