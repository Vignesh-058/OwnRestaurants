import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/CartStore';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useAuthStore } from '@/store/AuthStore';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useDeleteCart } from '@/hooks/cart/useDeleteCart';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { DeliveryTypeSelector } from '@/components/cart/DeliveryTypeSelector';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import { RemoveItemDialog } from '@/components/cart/RemoveItemDialog';
import { DiscountList } from '@/components/discount/DiscountList';
import type { CartItem, AddToCartPayload } from '@/types/cart.types';
import { useCart as useCartDetails } from '@/hooks/cart/useCart';

export const CartPage = () => {
 const navigate = useNavigate();
 const currency = useOrganizationStore(state => state.organization?.currency || '₹');
 const selectedOutlet = useOutletStore(state => state.selectedOutlet);
 const { orderId, orderType, cartItems, updateItemQuantity } = useCartStore();
 const { user } = useAuthStore();

 // Hardcoded for now per requirements (Guest flow without Auth if null)
 const customerPhoneNo = user?.phone || "0000000000";
 const customerName = user?.name || "Guest";

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

 const payload: AddToCartPayload = {
 items: latestCartItems.map(c => ({
 itemId: c.itemid._id,
 quantity: c.quantity,
 variationId: c.variation_id?._id || "",
 addOnDetails: c.addons || [],
 currency: cartCurrency
 })),
 deliveryType: updatedDeliveryType,
 orderType: updatedDeliveryType,
 customerName,
 customerPhoneNo,
 instruction: updatedInstruction,
 addressId: useCartStore.getState().addressId || undefined,
 outletId: selectedOutlet._id,
 orderId
 };

 updateCart(payload);
 }, 600); // 600ms debounce
 };

 const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
 if (!selectedOutlet || !orderId) return;

 if (newQuantity <= 0) {
 setItemToRemove(item);
 setIsRemoveDialogOpen(true);
 return;
 }

 // 1. Optimistic Local Update
 updateItemQuantity(item._id, newQuantity);

 // 2. Debounce Network Request
 triggerCartUpdate(localDeliveryType, localInstruction);
 };

 const handleInitiateRemove = (item: CartItem) => {
 setItemToRemove(item);
 setIsRemoveDialogOpen(true);
 };

 const handleConfirmRemove = () => {
 if (!selectedOutlet || !orderId || !itemToRemove) return;
 
 removeItem({
 outletId: selectedOutlet._id,
 orderId,
 itemid: itemToRemove._id,
 customerPhoneNo,
 customerName
 }, {
 onSettled: () => {
 setIsRemoveDialogOpen(false);
 setItemToRemove(null);
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 md:px-8 py-6 md:py-10 flex flex-col relative">
        <div className="flex flex-col mb-8 md:mb-10">
          <div className="flex items-center space-x-4 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-[#E5E7EB] bg-white shadow-sm border border-[#E5E7EB]">
              <ArrowLeft className="w-5 h-5 text-[#111827]" />
            </Button>
            <h1 className="text-[28px] md:text-[34px] font-bold text-[#111827]">Shopping Cart</h1>
            {!isEmpty && (
              <span className="bg-[#111827] text-white text-sm font-bold px-3 py-1 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            )}
          </div>
          <p className="text-[#6B7280] text-[15px] md:text-[16px] ml-14">
            Review your selected items before checkout.
          </p>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 pb-32 lg:pb-0 items-start">
 
 <div className="flex-1 space-y-6">
 <DeliveryTypeSelector 
 value={localDeliveryType}
 onChange={(val) => {
 setLocalDeliveryType(val);
 triggerCartUpdate(val, localInstruction);
 }}
 disabled={isUpdating}
 />

 <DiscountList />
 
 <div className="bg-card p-6 rounded-3xl border shadow-sm">
 <h3 className="font-bold text-lg mb-4">Cooking Instructions</h3>
 <textarea
 className="w-full bg-background border rounded-xl p-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
 placeholder="Any special requests? (e.g. less spicy, extra napkins)"
 value={localInstruction}
 onChange={(e) => {
 setLocalInstruction(e.target.value);
 triggerCartUpdate(localDeliveryType, e.target.value);
 }}
 disabled={isUpdating}
 />
 </div>

 <CartList 
 items={cartItems}
 currency={currency}
 onUpdateQuantity={handleUpdateQuantity}
 onRemove={handleInitiateRemove}
 isUpdating={isUpdating}
 />
 </div>

          {/* Desktop Summary Sidebar / Mobile Sticky Footer */}
          <div className="w-full lg:sticky lg:top-24 flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 lg:z-auto bg-white/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0 border-t lg:border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
            <CartSummary currency={currency} />
          </div>

        </div>
        )}

 {itemToRemove && (
 <RemoveItemDialog 
 isOpen={isRemoveDialogOpen}
 onOpenChange={setIsRemoveDialogOpen}
 onConfirm={handleConfirmRemove}
 itemName={itemToRemove.itemid.itemname}
 />
 )}
      </div>
    </div>
  );
};
