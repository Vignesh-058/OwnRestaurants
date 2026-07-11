import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart as useCartDetails } from '@/hooks/cart/useCart';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useDeleteCart } from '@/hooks/cart/useDeleteCart';
import { useCartStore } from '@/store/CartStore';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';
import { DeliveryTypeSelector } from '@/components/cart/DeliveryTypeSelector';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import { RemoveItemDialog } from '@/components/cart/RemoveItemDialog';
import type { CartItem, AddToCartPayload } from '@/types/cart.types';

export const CartPage = () => {
 const navigate = useNavigate();
 const currency = useOrganizationStore(state => state.organization?.currency || '₹');
 const selectedOutlet = useOutletStore(state => state.selectedOutlet);
 const orderId = useCartStore(state => state.orderId);
 const deliveryType = useCartStore(state => state.deliveryType);

 // Hardcoded for now per requirements (Guest flow without Auth)
 const customerPhoneNo = "0000000000";
 const customerName = "Guest";

 const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
 const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

 const { data: cartData, isLoading, isError } = useCartDetails({
 customerPhoneNo: orderId ? customerPhoneNo : "",
 outletId: selectedOutlet?._id || ""
 });

 const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
 const { mutate: removeItem } = useDeleteCart();

 const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
 if (!selectedOutlet || !orderId) return;

 if (newQuantity <= 0) {
 setItemToRemove(item);
 setIsRemoveDialogOpen(true);
 return;
 }

 const payload: AddToCartPayload = {
 items: [{
 itemId: item.itemid._id,
 quantity: newQuantity,
 variationId: item.variation_id?._id || "",
 addOnDetails: item.addons || [],
 currency: currency === '₹' ? 'INR' : currency
 }],
 deliveryType,
 orderType: deliveryType,
 customerName,
 customerPhoneNo,
 instruction: "",
 addressId: "",
 outletId: selectedOutlet._id,
 orderId
 };

 updateCart(payload);
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
 <h2 className="text-2xl font-bold mb-4">Unable to load cart</h2>
 <p className="text-muted-foreground mb-8 max-w-sm">
 Something went wrong while fetching your cart details. Please try again.
 </p>
 <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-8 font-bold">
 Retry
 </Button>
 </div>
 );
 }

 const isEmpty = !cartData || !cartData.items || cartData.items.length === 0;

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] flex flex-col relative">
 <div className="flex items-center space-x-4 mb-8">
 <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-muted">
 <ArrowLeft className="w-5 h-5" />
 </Button>
 <h1 className="text-2xl font-black">Shopping Cart</h1>
 </div>

 {isEmpty ? (
 <EmptyCart />
 ) : (
 <div className="flex flex-col lg:flex-row gap-8 pb-32 lg:pb-0">
 
 <div className="flex-1 space-y-6">
 <DeliveryTypeSelector />
 
 <CartList 
 items={cartData.items}
 currency={currency}
 onUpdateQuantity={handleUpdateQuantity}
 onRemove={handleInitiateRemove}
 isUpdating={isUpdating}
 />
 </div>

 {/* Desktop Summary Sidebar / Mobile Sticky Footer */}
 <div className="w-full lg:w-[400px] flex-shrink-0 fixed lg:relative bottom-0 left-0 right-0 z-50 lg:z-auto bg-background/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-4 lg:p-0 border-t lg:border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
 <CartSummary 
 subTotal={cartData.subTotal}
 tax={cartData.tax}
 total={cartData.total}
 currency={currency}
 />
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
 );
};
