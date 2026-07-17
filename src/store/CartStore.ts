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
 appliedDiscount: {
    discountId: string;
    discountType: string;
    discountPercentage: number;
    discountAmount: number;
    couponName: string;
  } | null;
 
 // Methods
 setCart: (payload: CartResponse | null) => void;
 clearCart: () => void;
 updateItemQuantity: (cartItemId: string, newQuantity: number) => void;
 removeCartItem: (productRetailerId: string) => void;
 optimisticSetQuantity: (product: any, newQuantity: number) => void;
 setOrderId: (orderId: string | null) => void;
 openDrawer: () => void;
 closeDrawer: () => void;
 setAppliedDiscount: (discount: any | null) => void;
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
 appliedDiscount: null,

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
  appliedDiscount: null,
  });
  return;
  }
  
  if (import.meta.env.DEV) {
    console.log('[DEBUG] Cart API Response Payload:', JSON.stringify(payload, null, 2));
  }

  const orderTotal = payload.orderTotal || 0;
  const deliveryCharge = payload.deliveryCharge || 0;
  const totalTax = payload.totalTax || 0;
  const savedAmount = payload.savedAmount || payload.discountAmount || payload.couponDiscount || 0;
  
  // Calculate Grand Total = Subtotal + Delivery Charge + Tax - Discount
  const calculatedGrandTotal = orderTotal + deliveryCharge + totalTax - savedAmount;
  
  // Use backend provided final amount if available, otherwise fallback to calculated
  const finalGrandTotal = payload.grandTotal || (payload as any).totalAmount || (payload as any).payableAmount || (payload as any).finalAmount || calculatedGrandTotal;

  if (import.meta.env.DEV) {
    console.log('[DEBUG] Derived Cart Values:');
    console.log(' - Subtotal:', orderTotal);
    console.log(' - Delivery Charge:', deliveryCharge);
    console.log(' - Tax:', totalTax);
    console.log(' - Discount:', savedAmount);
    console.log(' - Grand Total (Calculated):', calculatedGrandTotal);
    console.log(' - Final Payable Amount (Used):', finalGrandTotal);
  }

  set({
   orderId: payload.orderId || payload._id || null,
   cartItems: payload.items || [],
   cartItemCount: payload.items ? payload.items.reduce((acc, item) => acc + item.quantity, 0) : 0,
   orderTotal,
   savedAmount,
   deliveryCharge,
   packageCharge: payload.totalPackageCharge || 0,
   totalTax,
   grandTotal: Math.max(0, finalGrandTotal),
   customerAddress: payload.customerAddress as any || null,
   addressId: payload.addressId || null,
   paymentMode: payload.paymentMode || null,
   orderType: payload.orderType || null,
   checkoutEnable: payload.checkoutEnable ?? true,
   checkOutMessage: payload.checkOutMessage || '',
   
   // Handle applied discounts if backend provides them directly
   appliedDiscount: payload.appliedOfferId 
     ? {
         discountId: payload.appliedOfferId,
         discountType: 'backend', // Let backend drive it
         discountPercentage: 0,
         discountAmount: payload.discountAmount || payload.couponDiscount || 0,
         couponName: payload.couponName || ''
       } 
     : null
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
 checkoutEnable: false,
 checkOutMessage: '',
 appliedDiscount: null,
 }),

 setAppliedDiscount: (discount) => {
    set({ appliedDiscount: discount });
    if (import.meta.env.DEV) console.log('[Selected Discount]', discount);
  },

  updateItemQuantity: (cartItemId, newQuantity) => set((state) => ({
 cartItems: state.cartItems.map(item => 
 item._id === cartItemId ? { ...item, quantity: newQuantity } : item
 )
 })),

  removeCartItem: (idToRemove) => set((state) => {
   const newItems = state.cartItems.filter(
    item => item.product_retailer_id !== idToRemove && item._id !== idToRemove
   );
   const newCount = newItems.reduce((acc, item) => acc + item.quantity, 0);
   const newTotal = newItems.reduce((acc, item) => acc + ((item.item_price || 0) * item.quantity), 0);
    if (import.meta.env.DEV) console.log('[Cart] Store Updated — removeCartItem, new count:', newCount);
   return {
    cartItems: newItems,
    cartItemCount: newCount,
    orderTotal: newTotal,
    // Note: This optimistic grandTotal isn't perfect, but backend is source of truth and will override on next fetch
    grandTotal: newTotal + state.deliveryCharge + state.totalTax - state.savedAmount,
   };
  }),

 optimisticSetQuantity: (product, newQuantity) => set((state) => {
    const existingIndex = state.cartItems.findIndex(
      (item: any) => item.product_retailer_id === product._id
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
          product_retailer_id: product._id,
          name: product.itemname || product.name,
          quantity: newQuantity,
          item_price: product.defaultSellingPrice || product.sellingPrice || product.price || 0,
          itemTotal: (product.defaultSellingPrice || product.sellingPrice || product.price || 0) * newQuantity,
        } as any);
      }
    }

    const newCount = newItems.reduce((acc, item) => acc + item.quantity, 0);
    const newTotal = newItems.reduce((acc, item) => acc + ((item.item_price || 0) * item.quantity), 0);

    return { 
      cartItems: newItems,
      cartItemCount: newCount,
      orderTotal: newTotal,
      // Note: This optimistic grandTotal isn't perfect, but backend is source of truth and will override on next fetch
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
