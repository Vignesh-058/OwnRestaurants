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
      console.log('[Cart] API Success (deleteCart):', data);

      // Immediately remove item from Zustand so UI updates without waiting for refetch
      removeCartItem(variables.itemid);
      console.log('[Cart] Store Updated — item removed:', variables.itemid);

      // Broad invalidation catches the query regardless of phone format used as key
      console.log('[Cart] Query Invalidated');
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('[Cart] Refetch Success');
    },
    onError: (error: any) => {
      console.error('[Cart] API Error (deleteCart):', error);
      toast.error('Failed to remove item from cart.');
    }
  });
};
