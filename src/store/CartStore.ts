import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCouponStore } from '@/store/CouponStore';
import type { CartResponse, CartItem, Address, PaymentMode, OrderType, DiscountDetails, Loyalty } from '@/types/cart.types';

interface CartState {
  orderId: string | null;
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
  tableInfo: { tableId: string; tableName: string } | null;
  numberOfGuests: number | null;
  eta: string;
  preBookingId: string | null;
  preOrderDate: string | null;
  preOrderTime: string | null;
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

  setCart: (payload: CartResponse | null) => void;
  clearCart: () => void;
  updateItemQuantity: (cartItemId: string, newQuantity: number) => void;
  removeCartItem: (productRetailerId: string) => void;
  optimisticSetQuantity: (product: any, newQuantity: number) => void;
  setOrderId: (orderId: string | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setTableInfo: (info: { tableId: string; tableName: string } | null) => void;
  setNumberOfGuests: (guests: number | null) => void;
  setOrderType: (type: OrderType | null) => void;
  setAppliedDiscount: (discount: any | null) => void;
  setPreBooking: (payload: {
    preBookingId: string | null;
    preOrderDate: string | null;
    preOrderTime: string | null;
    orderType?: OrderType | null;
    tableInfo?: { tableId: string; tableName: string } | null;
    numberOfGuests?: number | null;
  }) => void;
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
      tableInfo: null,
      numberOfGuests: null,
      eta: '',
      preBookingId: null,
      preOrderDate: null,
      preOrderTime: null,
      checkoutEnable: true,
      checkOutMessage: '',
      hasDiscount: false,
      cartDiscountDetails: null,
      loyalty: null,
      lastUpdatedAt: null,
      isDrawerOpen: false,
      appliedDiscount: null,

      setTableInfo: (info) => set({ tableInfo: info }),
      setNumberOfGuests: (guests) => set({ numberOfGuests: guests }),
      setOrderType: (type) => set({ orderType: type }),
      setPreBooking: (payload) => set(payload),

      setCart: (payload) => {
        if (!payload) {
          set((state) => ({
            orderId: null,
            cartItems: [],
            cartItemCount: 0,
            orderTotal: 0,
            savedAmount: 0,
            deliveryCharge: 0,
            packageCharge: 0,
            totalTax: 0,
            grandTotal: 0,
            customerAddress: state.customerAddress,
            addressId: state.addressId,
            paymentMode: null,
            orderType: state.orderType,
            eta: '',
            preBookingId: null,
            preOrderDate: null,
            preOrderTime: null,
            checkoutEnable: false,
            checkOutMessage: '',
            hasDiscount: false,
            cartDiscountDetails: null,
            loyalty: null,
            lastUpdatedAt: null,
            appliedDiscount: null,
          }));
          return;
        }

        const itemsCalculatedTotal = (payload.items || []).reduce((acc, item) => {
          const itemPrice = (item as any).price ?? (item as any).sellingPrice ?? (item as any).defaultSellingPrice ?? (item as any).basePrice ?? 0;
          return acc + (itemPrice * (item.quantity || 1));
        }, 0);

        const orderTotal = payload.orderTotal || (payload as any).subtotal || (payload as any).itemTotal || (payload as any).itemsTotal || itemsCalculatedTotal;
        const deliveryCharge = payload.deliveryCharge || 0;
        const totalTax = payload.totalTax || 0;

        // Only apply discount if an explicit coupon or offer is attached to the cart
        const hasExplicitCouponOrOffer = !!(payload.appliedOfferId || payload.couponName || (payload as any).appliedCoupon);
        const rawSavedAmount = hasExplicitCouponOrOffer ? (payload.savedAmount || payload.discountAmount || payload.couponDiscount || 0) : 0;
        const savedAmount = Math.min(orderTotal, Math.max(0, rawSavedAmount));

        const calculatedGrandTotal = Math.max(0, orderTotal + deliveryCharge + totalTax - savedAmount);
        const rawGrandTotal = payload.grandTotal || (payload as any).totalAmount || (payload as any).payableAmount || (payload as any).finalAmount;
        const finalGrandTotal = (rawGrandTotal !== undefined && rawGrandTotal !== null && rawGrandTotal > 0 && hasExplicitCouponOrOffer)
          ? rawGrandTotal 
          : calculatedGrandTotal;

        set((state) => ({
          orderId: payload.orderId || payload._id || null,
          cartItems: payload.items || [],
          cartItemCount: payload.items ? payload.items.reduce((acc, item) => acc + item.quantity, 0) : 0,
          orderTotal,
          savedAmount,
          deliveryCharge,
          packageCharge: payload.totalPackageCharge || 0,
          totalTax,
          grandTotal: Math.max(0, finalGrandTotal),
          customerAddress: (payload.customerAddress as any) || state.customerAddress,
          addressId: payload.addressId || state.addressId,
          paymentMode: payload.paymentMode || null,
          orderType: payload.orderType || state.orderType,
          preBookingId: (payload as any).preBookingId || null,
          preOrderDate: (payload as any).preOrderDate || null,
          preOrderTime: (payload as any).preOrderTime || null,
          checkoutEnable: payload.checkoutEnable ?? true,
          checkOutMessage: payload.checkOutMessage || '',
          appliedDiscount: payload.appliedOfferId 
            ? {
                discountId: payload.appliedOfferId,
                discountType: 'backend',
                discountPercentage: 0,
                discountAmount: savedAmount,
                couponName: payload.couponName || ''
              } 
            : null
        }));
      },

      clearCart: () => {
        try {
          useCouponStore.getState().clearCoupon();
        } catch (e) {
          // Ignore if store uninitialized
        }

        set((state) => ({
          orderId: null,
          cartItems: [],
          cartItemCount: 0,
          orderTotal: 0,
          savedAmount: 0,
          deliveryCharge: 0,
          packageCharge: 0,
          totalTax: 0,
          grandTotal: 0,
          customerAddress: state.customerAddress,
          addressId: state.addressId,
          paymentMode: null,
          orderType: state.orderType,
          preBookingId: null,
          preOrderDate: null,
          preOrderTime: null,
          checkoutEnable: false,
          checkOutMessage: '',
          appliedDiscount: null,
        }));
      },

      setAppliedDiscount: (discount) => {
        set({ appliedDiscount: discount });
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
        return {
          cartItems: newItems,
          cartItemCount: newCount,
          orderTotal: newTotal,
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
