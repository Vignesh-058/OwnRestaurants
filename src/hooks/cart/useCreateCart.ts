import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { toast } from 'sonner';
import type { AddToCartPayload } from '@/types/cart.types';

export const useCreateCart = () => {
 const queryClient = useQueryClient();
 const setOrderId = useCartStore(state => state.setOrderId);

 return useMutation({
 mutationFn: (payload: AddToCartPayload) => cartService.createCart(payload),
 onSuccess: (data, variables) => {
 if (data?.data?.orderId) {
 setOrderId(data.data.orderId);
 }
 queryClient.invalidateQueries({ queryKey: ['cart', variables.customerPhoneNo, variables.outletId] });
 toast.success('Added to cart');
 },
 onError: () => {
 toast.error('Failed to create cart');
 }
 });
};
