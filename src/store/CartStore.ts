import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartResponse, CartItem, Address, PaymentMode, OrderType, DiscountDetails, Loyalty } from '@/types/cart.types';

interface CartState {
 // Replaces orderId in legacy store logic
 orderId: string | null;
 
 // Exact backend fields
 cartItems: CartItem[];
 cartItemCount: number;
 orderTotal: number;
 savedAmount: number;
 deliveryCharge: number;
 packageCharge: number;
 totalTax: number;
 grandTotal: number;
 customerAddress: Address | null;
 addressId: string | null;
 paymentMode: PaymentMode | null;
 orderType: OrderType | null;
 eta: string;
 checkoutEnable: boolean;
 checkOutMessage: string;
 hasDiscount: boolean;
 cartDiscountDetails: DiscountDetails | null;
 loyalty: Loyalty | null;
 lastUpdatedAt: string | null;
 isDrawerOpen: boolean;
 
 // Methods
 setCart: (payload: CartResponse | null) => void;
 clearCart: () => void;
 updateItemQuantity: (cartItemId: string, newQuantity: number) => void;
 optimisticSetQuantity: (product: any, newQuantity: number) => void;
 setOrderId: (orderId: string | null) => void;
 openDrawer: () => void;
 closeDrawer: () => void;
}

export const useCartStore = create<CartState>()(
 persist(
 (set) => ({
 orderId: null,
 cartItems: [],
 cartItemCount: 0,
 orderTotal: 0,
 savedAmount: 0,
 deliveryCharge: 0,
 packageCharge: 0,
 totalTax: 0,
 grandTotal: 0,
 customerAddress: null,
 addressId: null,
 paymentMode: null,
 orderType: null,
 eta: '',
 checkoutEnable: false,
 checkOutMessage: '',
 hasDiscount: false,
 cartDiscountDetails: null,
 loyalty: null,
 lastUpdatedAt: null,
 isDrawerOpen: false,

 setCart: (payload) => {
 if (!payload) {
 set({
 orderId: null,
 cartItems: [],
 cartItemCount: 0,
 orderTotal: 0,
 savedAmount: 0,
 deliveryCharge: 0,
 packageCharge: 0,
 totalTax: 0,
 grandTotal: 0,
 customerAddress: null,
 addressId: null,
 paymentMode: null,
 orderType: null,
 eta: '',
 checkoutEnable: false,
 checkOutMessage: '',
 hasDiscount: false,
 cartDiscountDetails: null,
 loyalty: null,
 lastUpdatedAt: null,
 });
 return;
 }
 
 set({
 orderId: payload._id || payload.cart?._id || null, // Assuming orderId maps to cart._id or root _id
 cartItems: payload.cartItems || [],
 cartItemCount: payload.cartItemCount || 0,
 orderTotal: payload.orderTotal || 0,
 savedAmount: payload.savedAmount || 0,
 deliveryCharge: payload.deliveryCharge || 0,
 packageCharge: payload.packageCharge || 0,
 totalTax: payload.totalTax || 0,
 grandTotal: payload.grandTotal || 0,
 customerAddress: payload.customerAddress || null,
 addressId: payload.addressId || null,
 paymentMode: payload.paymentMode || null,
 orderType: payload.orderType || null,
 eta: payload.eta || '',
 checkoutEnable: payload.checkoutEnable || false,
 checkOutMessage: payload.checkOutMessage || '',
 hasDiscount: payload.hasDiscount || false,
 cartDiscountDetails: payload.cartDiscountDetails || null,
 loyalty: payload.loyalty || null,
 lastUpdatedAt: payload.lastUpdatedAt || new Date().toISOString(),
 });
 },

 clearCart: () => set({
 orderId: null,
 cartItems: [],
 cartItemCount: 0,
 orderTotal: 0,
 savedAmount: 0,
 deliveryCharge: 0,
 packageCharge: 0,
 totalTax: 0,
 grandTotal: 0,
 customerAddress: null,
 addressId: null,
 paymentMode: null,
 orderType: null,
 eta: '',
 checkoutEnable: false,
 checkOutMessage: '',
 hasDiscount: false,
 cartDiscountDetails: null,
 loyalty: null,
 lastUpdatedAt: null,
 }),

 updateItemQuantity: (cartItemId, newQuantity) => set((state) => ({
 cartItems: state.cartItems.map(item => 
 item._id === cartItemId ? { ...item, quantity: newQuantity } : item
 )
 })),
 optimisticSetQuantity: (product, newQuantity) => set((state) => {
    const existingIndex = state.cartItems.findIndex(
      (item: any) => 
        (item.itemid?._id || item.itemid?.itemid || item.itemid) === (product._id || product.itemid)
    );

    const newItems = [...state.cartItems];
    
    if (newQuantity <= 0) {
      if (existingIndex !== -1) {
        newItems.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        newItems[existingIndex].quantity = newQuantity;
      } else {
        newItems.push({
          _id: `temp-${Date.now()}`,
          itemid: product,
          quantity: newQuantity,
          unitPrice: product.defaultSellingPrice || product.sellingPrice || product.price || 0,
          totalPrice: (product.defaultSellingPrice || product.sellingPrice || product.price || 0) * newQuantity,
        } as any);
      }
    }

    const newCount = newItems.reduce((acc, item) => acc + item.quantity, 0);
    const newTotal = newItems.reduce((acc, item) => acc + ((item.unitPrice || 0) * item.quantity), 0);

    return { 
      cartItems: newItems,
      cartItemCount: newCount,
      orderTotal: newTotal,
      grandTotal: newTotal + state.deliveryCharge + state.totalTax - state.savedAmount
    };
  }),
 setOrderId: (orderId) => set({ orderId }),
 openDrawer: () => set({ isDrawerOpen: true }),
 closeDrawer: () => set({ isDrawerOpen: false }),
 }),
 {
 name: 'cart-storage',
 }
 )
);
