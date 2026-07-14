import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { toast } from 'sonner';
import type { CartCreateRequest } from '@/types/cart.types';

export const useCreateCart = () => {
 const queryClient = useQueryClient();
 const { setOrderId } = useCartStore();

 return useMutation({
 mutationFn: (payload: CartCreateRequest) => cartService.createCart(payload),
 onSuccess: (data) => {
 // Extract orderId from the response to save in global state
 const newOrderId = data?.data?.order?.orderId || data?.data?.orderId || data?.data?._id;
 if (newOrderId) {
 setOrderId(newOrderId);
 }
 
 // Instantly refresh global cart
 queryClient.invalidateQueries({ queryKey: ['cart'] });
 },
 onError: (error: any, variables: CartCreateRequest) => {
 const errorMsg = error?.response?.data?.message?.toLowerCase() || '';

 if (errorMsg.includes('item not found')) {
 toast.error('Selected item is unavailable.');
 } else if (errorMsg.includes('address not found')) {
 toast.error('Please select a valid delivery address.');
 useLocationModalStore.getState().openModal();
 } else if (errorMsg.includes('outlet not found')) {
 queryClient.invalidateQueries({ queryKey: ['nearby-outlets'] });
 toast.error('Outlet not found. Reloading nearby outlets...');
 } else {
 // Generic / Validation / Network Error
 toast.error('Unable to add item to cart. Please try again.', {
 action: {
 label: 'Retry',
 onClick: () => queryClient.getMutationCache().build(queryClient, { mutationFn: (val: CartCreateRequest) => cartService.createCart(val) }).execute(variables)
 }
 });
 }
 }
 });
};
