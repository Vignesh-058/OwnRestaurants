import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import type { GetCartDetailsPayload } from '@/types/cart.types';

export const useCart = (payload: GetCartDetailsPayload) => {
 const setOrderId = useCartStore(state => state.setOrderId);
 const setCartDetails = useCartStore(state => state.setCartDetails);
 
 return useQuery({
 queryKey: ['cart', payload.customerPhoneNo, payload.outletId],
 queryFn: async () => {
 if (!payload.customerPhoneNo || !payload.outletId) return null;
 try {
 const data = await cartService.getCartDetails(payload);
 if (data) {
 setOrderId(data.orderId);
 setCartDetails(data);
 }
 return data;
 } catch {
 setOrderId(null);
 setCartDetails(null);
 return null;
 }
 },
 enabled: !!payload.customerPhoneNo && !!payload.outletId,
 staleTime: 0,
 });
};
