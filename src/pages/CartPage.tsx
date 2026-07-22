import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/CartStore';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useAuthStore } from '@/store/AuthStore';
import { getCartAddressPayload } from '@/utils/cartPayload';
import { useAddressFlow } from '@/hooks/cart/useAddressFlow';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useDeleteCart } from '@/hooks/cart/useDeleteCart';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import type { CartItem } from '@/types/cart.types';
import { useCart as useCartDetails } from '@/hooks/cart/useCart';

import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

/* ── Mobile-only fixed footer: Grand Total + Checkout button ── */
const MobileCheckoutFooter = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { grandTotal, checkoutEnable, checkOutMessage, cartItemCount, preBookingId, preOrderDate, preOrderTime } = useCartStore();
  const organization = useOrganizationStore(state => state.organization);
  const currency = organization?.currency || '₹';

  const handleCheckout = () => {
    console.log('[DEBUG Checkout Flow] Button clicked (MobileCheckoutFooter)');
    console.log('[DEBUG Checkout Flow] Validation started', {
      cartItemCount,
      checkoutEnable,
      checkOutMessage,
      preBookingId,
      preOrderDate,
      preOrderTime
    });

    if (cartItemCount === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const currentPreBookingId = preBookingId || searchParams.get('preBookingId');
    const currentPreOrderDate = preOrderDate || searchParams.get('preOrderDate');
    const currentPreOrderTime = preOrderTime || searchParams.get('preOrderTime');

    if (currentPreBookingId && (!currentPreOrderDate || !currentPreOrderTime)) {
      toast.error('Pre-order date and time are required for pre-booking.');
      return;
    }

    if (!checkoutEnable && checkOutMessage && !currentPreBookingId) {
      toast.error(checkOutMessage || 'Checkout is currently disabled.');
      return;
    }

    console.log('[DEBUG Checkout Flow] Validation passed');
    console.log('[DEBUG Checkout Flow] Navigation/API triggered');

    if (currentPreBookingId) {
      navigate(`/checkout?preBookingId=${currentPreBookingId}&preOrderDate=${currentPreOrderDate}&preOrderTime=${currentPreOrderTime}`);
    } else {
      navigate('/checkout');
    }
  };

  if (cartItemCount === 0) return null;
  return (
    <div className="lg:hidden fixed left-0 right-0 z-50 bg-white border-t border-[#FFE2CC] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-4 py-3 transition-all duration-300" style={{ bottom: 'var(--floating-nav-height, 0px)' }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-[#6B7280] font-medium uppercase tracking-wide">Grand Total</p>
          <p className="text-[20px] font-bold text-[#FF6B00] leading-none tabular-nums">{currency}{grandTotal.toLocaleString()}</p>
        </div>
        <Button
          className="flex-1 h-[48px] rounded-[16px] text-[15px] font-bold bg-[#FF6B00] hover:bg-[#FF7A1A] text-white shadow-[0_4px_16px_rgba(255,107,0,0.2)] transition-all"
          disabled={cartItemCount === 0}
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
      {!checkoutEnable && checkOutMessage && (
        <p className="text-[11px] text-[#EF4444] font-semibold text-center mt-1.5">{checkOutMessage}</p>
      )}
    </div>
  );
};


export const CartPage = () => {
 const navigate = useNavigate();
 const currency = useOrganizationStore(state => state.organization?.currency || '₹');
 const selectedOutlet = useOutletStore(state => state.selectedOutlet);
 const { orderId, orderType, tableInfo, cartItems, updateItemQuantity, optimisticSetQuantity } = useCartStore();
 const { user } = useAuthStore();

 // Hardcoded for now per requirements (Guest flow without Auth if null)
 const [customerName] = useState(user?.name || "Guest");
 const [customerPhoneNo] = useState(user?.phone || "0000000000");

 const { handleAddressAndProceed } = useAddressFlow();


 const [localInstruction] = useState(orderType === 'Dine In' && tableInfo ? `Table: ${tableInfo.tableName}` : '');

 const { isLoading, isError } = useCartDetails({
 customerPhoneNo,
 outletId: selectedOutlet?._id || ""
 });

 const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
 const { mutate: removeItem } = useDeleteCart();

 const updateTimeoutRef = useRef<any>(null);

 const triggerCartUpdate = (updatedDeliveryType = orderType || 'Door Delivery', updatedInstruction = localInstruction) => {
 if (!selectedOutlet || !orderId) return;

 if (updateTimeoutRef.current) {
 clearTimeout(updateTimeoutRef.current);
 }

 updateTimeoutRef.current = setTimeout(() => {
  const latestCartItems = useCartStore.getState().cartItems;
  const cartCurrency = currency === '₹' ? 'INR' : currency;

   const proceedWithUpdate = () => {
     const addressPayload = getCartAddressPayload();

     const payload: any = {
       items: latestCartItems.map(c => ({
         itemId: c.product_retailer_id,
         quantity: c.quantity,
         variationId: c.variationId || "",
         addOnDetails: c.addons || [],
         currency: cartCurrency
       })),
       deliveryType: updatedDeliveryType,
       orderType: updatedDeliveryType,
       customerName,
       customerPhoneNo,
       instruction: updatedInstruction,
       outletId: selectedOutlet._id,
       orderId,
       ...addressPayload
     };

     if (import.meta.env.DEV) {
       console.log("=== CART UPDATE: CartPage handleUpdateQuantity ===");
       console.log("addressPayload:", addressPayload);
       console.log("Final Payload:", JSON.stringify(payload, null, 2));
     }

     updateCart(payload);
   };

   if (updatedDeliveryType === 'Door Delivery') {
     handleAddressAndProceed(proceedWithUpdate);
   } else {
     proceedWithUpdate();
   }
  }, 600); // 600ms debounce
 };

 const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
  if (!selectedOutlet || !orderId) return;

  if (newQuantity <= 0) {
   // Decrement to zero — delete directly without dialog
   if (import.meta.env.DEV) console.log('[Cart] Update Payload (delete via quantity=0):', item.product_retailer_id);
   optimisticSetQuantity({ _id: item.product_retailer_id } as any, 0);
   removeItem({
    outletId: selectedOutlet._id,
    orderId,
    itemid: (item._id && !item._id.startsWith('temp-')) ? item._id : item.product_retailer_id,
    customerPhoneNo,
    customerName
   }, {
    onSuccess: () => {
     if (import.meta.env.DEV) console.log('[Cart] API Success — item deleted via qty=0');
    },
    onError: () => {
     if (import.meta.env.DEV) console.error('[Cart] API Error — delete failed, reverting optimistic update');
     // Revert: refetch from server
     updateItemQuantity(item._id || '', item.quantity);
    }
   });
   return;
  }

  // Optimistic update immediately
  if (import.meta.env.DEV) console.log('[Cart] Update Payload (quantity):', { itemId: item._id, newQuantity });
  updateItemQuantity(item._id || '', newQuantity);
  if (import.meta.env.DEV) console.log('[Cart] Store Updated — quantity:', newQuantity);

  // Debounced network sync
  triggerCartUpdate(orderType || 'Door Delivery', localInstruction);
 };

 const handleInitiateRemove = (item: CartItem) => {
  if (!selectedOutlet || !orderId) return;

  // Optimistic: remove from store immediately so UI updates instantly
  if (import.meta.env.DEV) console.log('[Cart] Update Payload (remove):', item.product_retailer_id);
  optimisticSetQuantity({ _id: item.product_retailer_id } as any, 0);

  removeItem({
   outletId: selectedOutlet._id,
   orderId,
   itemid: (item._id && !item._id.startsWith('temp-')) ? item._id : item.product_retailer_id,
   customerPhoneNo,
   customerName
  }, {
   onSuccess: () => {
    if (import.meta.env.DEV) console.log('[Cart] API Success — item removed');
   },
   onError: () => {
    if (import.meta.env.DEV) console.error('[Cart] API Error — remove failed');
   }
 });
 };

 if (isLoading) {
 return <CartSkeleton />;
 }

 if (isError) {
 return (
 <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
 <h2 className="text-2xl font-bold mb-4">Unable to load your cart.</h2>
 <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 font-bold">
 Retry
 </Button>
 </div>
 );
 }

 const isEmpty = !cartItems || cartItems.length === 0;

   return (
    <div className="w-full min-h-screen bg-[#FAF8F5]">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-8 py-6">

        {isEmpty ? (
          <>
            {/* ── Page Header ── */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-full hover:bg-[#FFF4EB] bg-white shadow-sm border border-[#FFE2CC] shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </Button>
          <div>
            <h1 className="text-[32px] md:text-[38px] font-bold text-[#1F2937] leading-none">
              Shopping Cart
            </h1>
          </div>
        </div>
            <EmptyCart />
          </>
        ) : (
          <>
            {/* CSS Grid: 1:1 ratio (1fr for Cart, 1fr for Order Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pb-40 lg:pb-8">

            {/* Left — Cart Items */}
            <div className="min-w-0 space-y-5 w-full">
              {/* ── Page Header ── */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="w-11 h-11 rounded-full hover:bg-[#FFF4EB] bg-white shadow-sm border border-[#FFE2CC] shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
                </Button>
                <div>
                  <h1 className="text-[32px] md:text-[38px] font-bold text-[#1F2937] leading-none">
                    Shopping Cart
                  </h1>
                  <p className="text-[15px] text-[#6B7280] font-medium mt-1">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>
              <CartList
                items={cartItems}
                currency={currency}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleInitiateRemove}
                isUpdating={isUpdating}
              />
            </div>

            {/* Right — Order Summary */}
            <div className="hidden lg:flex lg:flex-col lg:sticky lg:top-[96px] lg:self-start w-full max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="w-full flex-shrink-0">
                <CartSummary
                  currency={currency}
                  isUpdating={isUpdating}
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden w-full flex flex-col gap-6 pb-24">
              <CartSummary
                currency={currency}
                isUpdating={isUpdating}
                hideMobileActions
              />
            </div>
          </div>

            {/* Mobile fixed footer — Grand Total + Checkout */}
            <MobileCheckoutFooter />
          </>
        )}
      </div>
    </div>
  );
};
