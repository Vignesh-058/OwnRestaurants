import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartResponse } from '@/types/cart.types';

interface CartState {
 orderId: string | null;
 cartDetails: CartResponse | null;
 deliveryType: string;
 setOrderId: (orderId: string | null) => void;
 setCartDetails: (details: CartResponse | null) => void;
 setDeliveryType: (type: string) => void;
 clearCart: () => void;
}

export const useCartStore = create<CartState>()(
 persist(
 (set) => ({
 orderId: null,
 cartDetails: null,
 deliveryType: 'Door Delivery',
 setOrderId: (orderId) => set({ orderId }),
 setCartDetails: (cartDetails) => set({ cartDetails }),
 setDeliveryType: (deliveryType) => set({ deliveryType }),
 clearCart: () => set({ orderId: null, cartDetails: null }),
 }),
 {
 name: 'cart-storage',
 }
 )
);
