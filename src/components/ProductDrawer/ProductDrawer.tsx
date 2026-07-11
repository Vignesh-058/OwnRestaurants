import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useOrganizationStore } from '@/store/OrganizationStore';

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

 // NOTE: Phase 5 restricts us from implementing Checkout/Cart logic.
 // We simply close the drawer or show a success message for now.
 const handleAddToCart = () => {
 if (!isValid || !item) return;
 // Pretend to add to cart...
 onClose();
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
 <ScrollArea className="flex-1 w-full relative">
 <div className="relative">
 <ProductGallery images={item.image} productName={item.itemname} />
 <ProductInfo 
 name={item.itemname} 
 dietryType={item.dietryType} 
 inStock={item.stockStatus} 
 rating={4.8} 
 />
 </div>

 <div className="p-4 md:p-8 space-y-8 pb-32">
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
 isValid={isValid}
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
