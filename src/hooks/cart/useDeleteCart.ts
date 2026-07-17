import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { toast } from 'sonner';
import type { RemoveFromCartPayload } from '@/types/cart.types';

export const useDeleteCart = () => {
  const queryClient = useQueryClient();
  const { removeCartItem } = useCartStore();

  return useMutation({
    mutationFn: (payload: RemoveFromCartPayload) => {
      console.log('[Cart] Update Payload (delete):', JSON.stringify(payload, null, 2));
      return cartService.removeFromCart(payload);
    },
    onSuccess: async (data, variables) => {
      if (data?.message === 'All Items Deleted, Cart Removed' || data?.message?.includes('Cart Removed')) {
        const { clearCart } = useCartStore.getState();
        clearCart();
        queryClient.setQueriesData({ queryKey: ['cart'] }, null);
      } else {
        // Immediately remove item from Zustand so UI updates without waiting for refetch
        const { removeCartItem } = useCartStore.getState();
        removeCartItem(variables.itemid);
        // Broad invalidation catches the query regardless of phone format used as key
        await queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    },
    onError: (error: any) => {
      console.error('[Cart] API Error (deleteCart):', error);
      toast.error('Failed to remove item from cart.');
    }
  });
};
