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
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import type { CartItem } from '@/types/cart.types';
import { useCart as useCartDetails } from '@/hooks/cart/useCart';

/* ── Mobile-only fixed footer: Grand Total + Checkout button ── */
const MobileCheckoutFooter = () => {
  const navigate = useNavigate();
  const { grandTotal, checkoutEnable, checkOutMessage, cartItemCount } = useCartStore();
  const organization = useOrganizationStore(state => state.organization);
  const currency = organization?.currency || '₹';
  if (cartItemCount === 0) return null;
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_24px_rgba(0,0,0,0.10)] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] text-[#6B7280] font-medium uppercase tracking-wide">Grand Total</p>
          <p className="text-[20px] font-black text-[#FF6B00] leading-none tabular-nums">{currency}{grandTotal.toLocaleString()}</p>
        </div>
        <Button
          className="flex-1 h-[48px] rounded-full text-[15px] font-bold bg-[#FF6B00] hover:bg-[#E65C00] text-white shadow-[0_4px_16px_rgba(255,107,0,0.3)] transition-all"
          disabled={!checkoutEnable}
          onClick={() => navigate('/checkout')}
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
 const { orderId, orderType, cartItems, updateItemQuantity, optimisticSetQuantity } = useCartStore();
 const { user } = useAuthStore();

 // Hardcoded for now per requirements (Guest flow without Auth if null)
 const [customerName, setCustomerName] = useState(user?.name || "Guest");
 const [customerPhoneNo, setCustomerPhoneNo] = useState(user?.phone || "0000000000");

 const { handleAddressAndProceed } = useAddressFlow();

 const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
 const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

 const [localDeliveryType, setLocalDeliveryType] = useState(orderType || 'Door Delivery');
 const [localInstruction, setLocalInstruction] = useState('');

 const { isLoading, isError } = useCartDetails({
 customerPhoneNo,
 outletId: selectedOutlet?._id || ""
 });

 const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
 const { mutate: removeItem } = useDeleteCart();

 const updateTimeoutRef = useRef<any>(null);

 const triggerCartUpdate = (updatedDeliveryType = localDeliveryType, updatedInstruction = localInstruction) => {
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

     console.log("=== CART UPDATE: CartPage handleUpdateQuantity ===");
     console.log("addressPayload:", addressPayload);
     console.log("Final Payload:", JSON.stringify(payload, null, 2));

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
   console.log('[Cart] Update Payload (delete via quantity=0):', item.product_retailer_id);
   optimisticSetQuantity({ _id: item.product_retailer_id } as any, 0);
   removeItem({
    outletId: selectedOutlet._id,
    orderId,
    itemid: item.product_retailer_id,
    customerPhoneNo,
    customerName
   }, {
    onSuccess: () => {
     console.log('[Cart] API Success — item deleted via qty=0');
    },
    onError: () => {
     console.error('[Cart] API Error — delete failed, reverting optimistic update');
     // Revert: refetch from server
     updateItemQuantity(item._id || '', item.quantity);
    }
   });
   return;
  }

  // Optimistic update immediately
  console.log('[Cart] Update Payload (quantity):', { itemId: item._id, newQuantity });
  updateItemQuantity(item._id || '', newQuantity);
  console.log('[Cart] Store Updated — quantity:', newQuantity);

  // Debounced network sync
  triggerCartUpdate(localDeliveryType, localInstruction);
 };

 const handleInitiateRemove = (item: CartItem) => {
 setItemToRemove(item);
 setIsRemoveDialogOpen(true);
 };

 const handleConfirmRemove = () => {
  if (!selectedOutlet || !orderId || !itemToRemove) return;

  // Optimistic: remove from store immediately so UI updates instantly
  console.log('[Cart] Update Payload (remove):', itemToRemove.product_retailer_id);
  optimisticSetQuantity({ _id: itemToRemove.product_retailer_id } as any, 0);
  setIsRemoveDialogOpen(false);
  setItemToRemove(null);

  removeItem({
   outletId: selectedOutlet._id,
   orderId,
   itemid: itemToRemove.product_retailer_id,
   customerPhoneNo,
   customerName
  }, {
   onSuccess: () => {
    console.log('[Cart] API Success — item removed');
   },
   onError: () => {
    console.error('[Cart] API Error — remove failed');
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
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-8 py-6">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-[#E5E7EB] bg-white shadow-sm border border-[#E5E7EB] shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#111827]" />
          </Button>
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#111827] leading-none">
            Shopping Cart
          </h1>
          {!isEmpty && (
            <span className="bg-[#111827] text-white text-[13px] font-bold px-3 py-1 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <>
            {/* CSS Grid: left takes all remaining space, right is fixed 360px */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-6 items-start pb-40 lg:pb-8">

            {/* Left — Cart Items: full width of remaining column */}
            <div className="min-w-0 space-y-3 w-full">
              <CartList
                items={cartItems}
                currency={currency}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleInitiateRemove}
                isUpdating={isUpdating}
              />
            </div>

            {/* Right — Order Summary: fixed 360px, sticky desktop / inline mobile */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start w-full max-w-[440px]">
              <CartSummary
                currency={currency}
                deliveryType={localDeliveryType}
                onDeliveryTypeChange={val => {
                  setLocalDeliveryType(val);
                  triggerCartUpdate(val, localInstruction);
                }}
                isUpdating={isUpdating}
              />
            </div>

            {/* Mobile inline summary */}
            <div className="lg:hidden w-full">
              <CartSummary
                currency={currency}
                deliveryType={localDeliveryType}
                onDeliveryTypeChange={val => {
                  setLocalDeliveryType(val);
                  triggerCartUpdate(val, localInstruction);
                }}
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
