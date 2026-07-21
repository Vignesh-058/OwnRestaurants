import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useCartStore } from '@/store/CartStore';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';
import { getCartAddressPayload } from '@/utils/cartPayload';
import { useAddressFlow } from '@/hooks/cart/useAddressFlow';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useCreateCart } from '@/hooks/cart/useCreateCart';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

import { useMediaQuery } from '@/hooks/useMediaQuery';

export const ProductDrawer = ({ itemId, isOpen, onClose }: ProductDrawerProps) => {
 const organization = useOrganizationStore((state) => state.organization);
  const currency = organization?.currency || '₹';
  const detailConfig = organization?.theme?.config?.productDetail;
  const showVariants = detailConfig?.showVariants ?? true;
  const showAddons = detailConfig?.showAddons ?? true;
  const isCartEnabled = organization?.isCartEnabled ?? true;
 const isDesktop = useMediaQuery('(min-width: 768px)');

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

 const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
  const { mutate: createCart, isPending: isCreating } = useCreateCart();
  const { cartItems, orderId, orderType, tableInfo, preBookingId: storePreBookingId, preOrderDate: storePreOrderDate, preOrderTime: storePreOrderTime, openDrawer, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
 const { handleAddressAndProceed } = useAddressFlow();

 const isAdding = isUpdating || isCreating;

 const handleAddToCart = () => {
   if (!isValid || !item || !selectedOutlet) return;
   
    const urlPreBookingId = searchParams.get('preBookingId');
    const urlPreOrderDate = searchParams.get('preOrderDate');
    const urlPreOrderTime = searchParams.get('preOrderTime');
    
    // Check if the item already exists in the cart with the exact same variation & addons
    // For simplicity, we just trigger the cart update merging with existing items
    let finalOrderId = orderId;
    let finalExistingItems = cartItems.map(c => ({
      itemId: c.product_retailer_id,
      quantity: c.quantity,
      variationId: c.variationId || "",
      addOnDetails: c.addons || [],
      currency: currency === '₹' ? 'INR' : currency
    }));

    if (urlPreBookingId) {
      const isDifferentPreBooking = storePreBookingId !== urlPreBookingId || storePreOrderDate !== urlPreOrderDate || storePreOrderTime !== urlPreOrderTime;
      if (cartItems.length > 0 && (!storePreBookingId || isDifferentPreBooking)) {
        clearCart();
        finalOrderId = null;
        finalExistingItems = [];
      }
    }

   // Find if the exact item exists, if so increment, otherwise add new
   const currentAddonGroups = Object.entries(selectedAddons).map(([group_id, addOnIds]) => ({
     group_id,
     addon_item_ids: addOnIds
   }));

   console.log('[Selected Variation]', selectedVariation);
   console.log('[Selected Addons]', currentAddonGroups);

    const matchingIndex = finalExistingItems.findIndex(i => 
      i.itemId === item.itemid && 
      i.variationId === (selectedVariation || "") && 
      JSON.stringify(i.addOnDetails) === JSON.stringify(currentAddonGroups)
    );

    if (matchingIndex !== -1) {
      finalExistingItems[matchingIndex].quantity += quantity;
    } else {
      finalExistingItems.push({
        itemId: item.itemid,
        quantity,
        variationId: selectedVariation || "",
        addOnDetails: currentAddonGroups,
        currency: currency === '₹' ? 'INR' : currency
      });
    }

    const currentOrderType = orderType || 'Door Delivery';

    const proceedWithAdd = () => {
      const addressPayload = getCartAddressPayload();

      const payload: any = {
        items: finalExistingItems,
        deliveryType: currentOrderType,
        orderType: currentOrderType,
        customerName: user?.name || 'Guest',
        customerPhoneNo: user?.phone || '0000000000',
        instruction: currentOrderType === 'Dine In' && tableInfo ? `Table: ${tableInfo.tableName}` : '',
        outletId: selectedOutlet._id,
        ...addressPayload,
      };
      
      if (finalOrderId) payload.orderId = finalOrderId;
      
      if (urlPreBookingId) {
        payload.preBookingId = urlPreBookingId;
        payload.preOrderDate = urlPreOrderDate;
        payload.preOrderTime = urlPreOrderTime;
      }

      console.log("=== CART UPDATE: ProductDrawer handleAddToCart ===");
      console.log("addressPayload:", addressPayload);
      console.log("[Final Cart Payload]", JSON.stringify(payload, null, 2));

      if (finalOrderId) {
        updateCart(payload, {
          onSuccess: () => {
            toast.success("Product added to cart.");
            onClose();
            if (urlPreBookingId) openDrawer();
          }
        });
      } else {
        createCart(payload, {
          onSuccess: () => {
            toast.success("Product added to cart.");
            onClose();
            if (urlPreBookingId) openDrawer();
          }
        });
      }
    };

    if (currentOrderType === 'Door Delivery') {
      handleAddressAndProceed(proceedWithAdd);
    } else {
      proceedWithAdd();
    }
  };

 return (
 <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
 <SheetContent side={isDesktop ? "right" : "bottom"} className={cn("p-0 flex flex-col bg-background overflow-hidden shadow-2xl border-none", isDesktop ? "w-full sm:max-w-xl gap-0 sm:rounded-l-[2rem]" : "h-[90vh] rounded-t-3xl w-full")}>
 
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
 <h3 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h3>
 <p className="text-muted-foreground mb-6">Unable to load product details at this time.</p>
 <Button 
 className="rounded-full px-8 bg-info hover:bg-info text-white font-bold" 
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
 rating={item.rating} 
 />
 </div>

 <div className="p-4 md:p-6 space-y-8 pb-32 bg-white relative z-20">
 {showVariants && (
                <VariationSelector 
                  variations={item.variations}
                  selectedVariation={selectedVariation}
                  onSelect={setSelectedVariation}
                  currency={currency}
                />
              )}

 {showAddons && item.addons && item.addons.map((group) => (
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
 {isCartEnabled && <PriceSummary 
 totalPrice={totalPrice}
 quantity={quantity}
 onQuantityChange={setQuantity}
 onAddToCart={handleAddToCart}
 isValid={isValid && !isAdding}
 inStock={item.stockStatus}
 currency={currency}
 />}
 </div>
 </>
 )}
 </SheetContent>
 </Sheet>
 );
};
