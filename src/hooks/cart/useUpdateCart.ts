import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { toast } from 'sonner';
import type { AddToCartPayload } from '@/types/cart.types';

export const useUpdateCart = () => {
 const queryClient = useQueryClient();

 return useMutation({
 mutationFn: (payload: AddToCartPayload) => cartService.updateCart(payload),
 onSuccess: (_, variables) => {
 queryClient.invalidateQueries({ queryKey: ['cart', variables.customerPhoneNo, variables.outletId] });
 },
 onError: () => {
 toast.error('Failed to update cart');
 }
 });
};
