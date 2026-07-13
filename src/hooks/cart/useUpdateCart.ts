import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';
import type { CartCreateRequest } from '@/types/cart.types';

export const useUpdateCart = () => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (payload: CartCreateRequest) => {
    const data = {
      ...payload
    };
    if (!data.orderId) {
      return cartService.createCart(data);
    }
    return cartService.updateCart(data);
  },
 onSuccess: (_) => {
 // Globally refresh cart state without relying on specific args
 queryClient.invalidateQueries({ queryKey: ['cart'] });
 },
 onError: (error: any) => {
  const status = error?.response?.status;
  if (status === 401) return; // Handled silently by axios interceptor
  const message = error?.response?.data?.message || 'Unable to update cart.';
  toast.error(message);
  }
 });
};
