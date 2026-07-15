import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { GetCartDetailsPayload } from '@/types/cart.types';

export const useCart = (payload: GetCartDetailsPayload) => {
 const setCart = useCartStore(state => state.setCart);
 const isCartEnabled = useOrganizationStore(state => state.organization?.isCartEnabled ?? true);
 
 return useQuery({
 queryKey: ['cart', payload.customerPhoneNo, payload.outletId],
 queryFn: async () => {
 if (!payload.customerPhoneNo || !payload.outletId || !isCartEnabled) return null;
 try {
 console.log('[CART] Loading cart');
 const data = await cartService.getCartDetails(payload);
 setCart(data || null);
 return data;
 } catch {
 setCart(null);
 return null;
 }
 },
 enabled: !!payload.customerPhoneNo && !!payload.outletId && isCartEnabled,
 staleTime: 0,
 });
};
