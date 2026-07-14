import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import type { GetCartDetailsPayload } from '@/types/cart.types';

export const useCart = (payload: GetCartDetailsPayload) => {
 const setCart = useCartStore(state => state.setCart);
 
 return useQuery({
 queryKey: ['cart', payload.customerPhoneNo, payload.outletId],
 queryFn: async () => {
 if (!payload.customerPhoneNo || !payload.outletId) return null;
 try {
 const data = await cartService.getCartDetails(payload);
 setCart(data || null);
 return data;
 } catch {
 setCart(null);
 return null;
 }
 },
 enabled: !!payload.customerPhoneNo && !!payload.outletId,
 staleTime: 0,
 });
};
