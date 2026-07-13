import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useCartStore } from '@/store/CartStore';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { toast } from 'sonner';

// New Hook
import { useProductDetail } from '@/hooks/useProductDetail';

// New UI Components
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { VariationSelector } from '@/components/product/VariationSelector';
import { AddonGroup } from '@/components/product/AddonGroup';
import { PriceSummary } from '@/components/product/PriceSummary';
import { ProductTabs } from '@/components/product/ProductTabs';
import { ProductDetailsSkeleton } from '@/components/product/ProductDetailsSkeleton';

interface ProductDrawerProps {
 itemId: string | null;
 isOpen: boolean;
 onClose: () => void;
}

export const ProductDrawer = ({ itemId, isOpen, onClose }: ProductDrawerProps) => {
 const currency = useOrganizationStore((state) => state.organization?.currency || '₹');

 const {
 item,
 isLoading,
 isError,
 selectedVariation,
 setSelectedVariation,
 selectedAddons,
 handleAddonChange,
 quantity,
 setQuantity,
 totalPrice,
 isValid
 } = useProductDetail(itemId, isOpen);

 const { mutate: updateCart, isPending } = useUpdateCart();
 const { openDrawer, cartItems, orderId, orderType } = useCartStore();
 const { user } = useAuthStore();
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

 const handleAddToCart = () => {
   if (!isValid || !item || !selectedOutlet) return;
   
   // Check if the item already exists in the cart with the exact same variation & addons
   // For simplicity, we just trigger the cart update merging with existing items
   const existingItems = cartItems.map(c => ({
     itemId: c.itemid._id,
     quantity: c.quantity,
     variationId: c.variation_id?._id || "",
     addOnDetails: c.addons || [],
     currency: currency === '₹' ? 'INR' : currency
   }));

   // Find if the exact item exists, if so increment, otherwise add new
   const currentAddonGroups = Object.entries(selectedAddons).map(([group_id, addOnIds]) => ({
     group_id,
     addon_item_ids: addOnIds
   }));

   const matchingIndex = existingItems.findIndex(i => 
     i.itemId === item.itemid && 
     i.variationId === (selectedVariation || "") && 
     JSON.stringify(i.addOnDetails) === JSON.stringify(currentAddonGroups)
   );

   if (matchingIndex !== -1) {
     existingItems[matchingIndex].quantity += quantity;
   } else {
     existingItems.push({
       itemId: item.itemid,
       quantity,
       variationId: selectedVariation || "",
       addOnDetails: currentAddonGroups,
       currency: currency === '₹' ? 'INR' : currency
     });
   }

   const payload = {
     items: existingItems,
     deliveryType: orderType || 'Door Delivery',
     orderType: orderType || 'Door Delivery',
     customerName: user?.name || 'Guest',
     customerPhoneNo: user?.phone || '0000000000',
     instruction: '',
     outletId: selectedOutlet._id,
     orderId: orderId || undefined
   };

   updateCart(payload, {
     onSuccess: () => {
       toast.success("Product added to cart.");
       onClose();
     }
   });
 };

 return (
 <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
 <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col bg-background gap-0 sm:rounded-l-[2rem] overflow-hidden shadow-2xl border-none">
 
 <SheetHeader className="sr-only">
 <SheetTitle>Product Details</SheetTitle>
 <SheetDescription>Configure and add to cart</SheetDescription>
 </SheetHeader>

 {isLoading ? (
 <ProductDetailsSkeleton />
 ) : isError || !item ? (
 <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
 <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
 <Info className="w-12 h-12 text-red-500" />
 </div>
 <h3 className="text-2xl font-bold text-[#111827] mb-2">Product Not Found</h3>
 <p className="text-[#6B7280] mb-6">Unable to load product details at this time.</p>
 <Button 
 className="rounded-full px-8 bg-[#0C6CEA] hover:bg-[#0055CC] text-white font-bold" 
 onClick={() => onClose()}
 >
 Back to Shop
 </Button>
 </div>
 ) : (
 <>
 <ScrollArea className="flex-1 w-full relative bg-white">
 <div className="relative w-full bg-black">
 <ProductGallery images={item.image} productName={item.itemname} />
 <ProductInfo 
 name={item.itemname} 
 dietryType={item.dietryType} 
 inStock={item.stockStatus} 
 rating={4.8} 
 />
 </div>

 <div className="p-4 md:p-6 space-y-8 pb-32 bg-white relative z-20">
 <VariationSelector 
 variations={item.variations}
 selectedVariation={selectedVariation}
 onSelect={setSelectedVariation}
 currency={currency}
 />

 {item.addons && item.addons.map((group) => (
 <AddonGroup 
 key={group.addongroupid}
 group={group}
 selectedAddons={selectedAddons[group.addongroupid] || []}
 onChange={handleAddonChange}
 currency={currency}
 />
 ))}

 <ProductTabs />
 </div>
 </ScrollArea>

 <div className="sticky bottom-0 w-full z-50">
 <PriceSummary 
 totalPrice={totalPrice}
 quantity={quantity}
 onQuantityChange={setQuantity}
 onAddToCart={handleAddToCart}
 isValid={isValid && !isPending}
 inStock={item.stockStatus}
 currency={currency}
 />
 </div>
 </>
 )}
 </SheetContent>
 </Sheet>
 );
};
