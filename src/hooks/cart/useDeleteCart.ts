import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';
import type { RemoveFromCartPayload } from '@/types/cart.types';

export const useDeleteCart = () => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (payload: RemoveFromCartPayload) => cartService.removeFromCart(payload),
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: ['cart', variables.customerPhoneNo, variables.outletId] });
 toast.success('Removed from cart');
 },
 onError: () => {
 toast.error('Failed to remove item');
 }
 });
};
