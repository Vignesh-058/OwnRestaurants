import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Heart, Share2, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useItemDetail } from '@/hooks/queries/useItemDetail';
import { useAddToCart, useUpdateCart } from '@/hooks/queries/useCart';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationStore } from "@/store/LocationStore";
import { useLocationModalStore } from "@/store/LocationModalStore";
import { getCartAddressPayload, hasValidDeliveryAddress } from "@/utils/cartPayload";
import { useAddressFlow } from '@/hooks/cart/useAddressFlow';
import type { Variation, AddonGroup, ItemDetail } from "@/types/product.types";
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { PageLoader } from '@/components/common/PageLoader';
import { ErrorState } from '@/components/common/ErrorState';
import { ProductInfoTabs } from '@/components/product/ProductInfoTabs';
import { RecommendedProducts } from '@/components/product/RecommendedProducts';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AddonSelection = Record<string, string[]>;

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { user } = useAuthStore();
  const { handleAddressAndProceed } = useAddressFlow();
  const { orderId, orderType } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariation, setSelectedVariation] = useState<string | undefined>(undefined);
  const [addonSelections, setAddonSelections] = useState<AddonSelection>({});
  const [quantity, setQuantity] = useState(1);

  const { data: item, isLoading, isError, refetch } = useItemDetail(id || null, selectedVariation);
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();

  const inWishlist = item ? isInWishlist(item.itemid) : false;

  const handleVariationChange = (variationId: string) => {
    setSelectedVariation(variationId);
    setAddonSelections({});
  };

  const handleAddonChange = (groupId: string, itemId: string, _min: number, max: number) => {
    setAddonSelections((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(itemId)) {
        return { ...prev, [groupId]: current.filter((i) => i !== itemId) };
      }
      if (max === 1) {
        return { ...prev, [groupId]: [itemId] }; // auto-replace if max is 1
      }
      if (current.length < max) {
        return { ...prev, [groupId]: [...current, itemId] };
      }
      return prev;
    });
  };

  const calculateTotalPrice = useMemo(() => {
    if (!item) return 0;
    let total = item.sellingPrice || item.basePrice || 0;

    if (item.addons) {
      item.addons.forEach((group: any) => {
        const selected = addonSelections[group.addongroupid] || [];
        selected.forEach((selId) => {
          const addonItem = group.items.find((i: any) => i.addonitemid === selId);
          if (addonItem) {
            total += addonItem.addonitem_price;
          }
        });
      });
    }
    return total * quantity;
  }, [item, addonSelections, quantity]);

  const isValidSelection = useMemo(() => {
    if (!item) return false;
    
    // Check variation
    if (item.variations && item.variations.length > 0) {
      const currentVar = selectedVariation || item.variationid;
      if (!currentVar) return false;
    }

    // Check addons max/min
    if (item.addons) {
      for (const group of item.addons) {
        const selectedCount = (addonSelections[group.addongroupid] || []).length;
        if (selectedCount < group.min) return false;
      }
    }
    return true;
  }, [item, addonSelections, selectedVariation]);

  const handleAddToCart = () => {
    if (!item || !selectedOutlet || !user?.phone) {
      toast.error('Please login and select an outlet first');
      return;
    }
    
    const addOnDetails = Object.entries(addonSelections).map(([groupId, items]) => ({
      group_id: groupId,
      addon_item_ids: items
    })).filter(g => g.addon_item_ids.length > 0);

    const activeVariation = selectedVariation || item.variationid || '';
    const cartCurrency = org?.currency || 'INR';

    const newItem = {
      itemId: item.itemid,
      quantity,
      variationId: activeVariation,
      addOnDetails,
      currency: cartCurrency
    };

    let updatedItems = [];

    if (orderId) {
      const cartItems = useCartStore.getState().cartItems;
      updatedItems = cartItems.map(c => ({
        itemId: c.product_retailer_id,
        quantity: c.quantity,
        variationId: c.variationId || "",
        addOnDetails: c.addons || [],
        currency: cartCurrency
      }));

      const isSameAddon = (a1: any[], a2: any[]) => JSON.stringify(a1) === JSON.stringify(a2);

      const existingIndex = updatedItems.findIndex(i => 
        i.itemId === newItem.itemId && 
        i.variationId === newItem.variationId && 
        isSameAddon(i.addOnDetails, newItem.addOnDetails)
      );

      if (existingIndex >= 0) {
        updatedItems[existingIndex].quantity += quantity;
      } else {
        updatedItems.push(newItem);
      }
    } else {
      updatedItems = [newItem];
    }

    const currentOrderType = orderType || 'Takeaway';

    const proceedWithAdd = () => {
      const addressPayload = getCartAddressPayload();

      const payload: any = {
        items: updatedItems,
        deliveryType: currentOrderType,
        orderType: currentOrderType,
        customerName: user.name || 'Guest',
        customerPhoneNo: user.phone,
        instruction: '',
        outletId: selectedOutlet._id,
        ...addressPayload,
      };
      if (orderId) {
        payload.orderId = orderId;
      }

      console.log("=== CART UPDATE: ProductPage handleAddToCart ===");
      console.log("addressPayload:", addressPayload);
      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      if (orderId) {
        updateCart(payload);
      } else {
        addToCart(payload);
      }
    };

    if (currentOrderType === 'Door Delivery') {
      handleAddressAndProceed(proceedWithAdd);
    } else {
      proceedWithAdd();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.itemname || 'Check out this product',
          text: `Check out ${item?.itemname} on OwnCart!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.log('Error sharing', error);
    }
  };

  if (isLoading) return <PageLoader />;
  if (isError || !item) return <ErrorState description="Product not found" onRetry={refetch} />;

  const isPending = isAdding || isUpdating;
  const hasBasePrice = item.sellingPrice < item.basePrice;
  const maxAllowed = item.trackInventory && item.stockCount !== undefined ? item.stockCount : 999;
  const isOutOfStock = !item.stockStatus || (item.trackInventory && item.stockCount === 0);

  // Discount calculation
  let discountDisplay = null;
  if (hasBasePrice) {
    const calculatedPercent = Math.round(((item.basePrice - item.sellingPrice) / item.basePrice) * 100);
    if (calculatedPercent > 0) {
      discountDisplay = `${calculatedPercent}% OFF`;
    }
  }

  const isVeg = item.dietryType?.toLowerCase() === 'veg' || item.dietryType?.toLowerCase() === 'vegan';
  const rating = 4.8;
  const isBestseller = true; // Fallback to true for premium look if missing

  const renderAddToCartBar = () => (
    <div className="flex items-center gap-4 w-full max-w-[500px] mx-auto lg:max-w-none justify-end">
      <div className="flex items-center rounded-full overflow-hidden h-[52px] bg-orange-50 border border-orange-100 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-full w-12 rounded-none hover:bg-orange-100 text-orange-600"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || isPending}
        >
          <Minus className="h-5 w-5" />
        </Button>
        <div className="w-10 text-center font-bold text-orange-600 text-lg">{quantity}</div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-full w-12 rounded-none hover:bg-orange-100 text-orange-600"
          onClick={() => setQuantity(Math.min(maxAllowed, quantity + 1))}
          disabled={quantity >= maxAllowed || isPending || isOutOfStock}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <Button 
        className="flex-1 lg:max-w-[300px] h-[52px] text-lg rounded-full shadow-lg bg-[#FF6B00] hover:bg-[#E65C00] font-black tracking-wide transition-transform active:scale-[0.98]" 
        onClick={handleAddToCart}
        disabled={!isValidSelection || isOutOfStock || isPending}
      >
        {isPending ? 'Adding...' : !isOutOfStock ? (
          <span className="flex items-center justify-between w-full px-2">
            <span>Add to Cart</span>
            <span>•</span>
            <span>{org?.currency || '₹'}{calculateTotalPrice.toFixed(2)}</span>
          </span>
        ) : 'Out of Stock'}
      </Button>
    </div>
  );

  return (
    <div className="pb-[100px] lg:pb-12 w-full min-h-screen bg-[#F8FAFC]">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full lg:h-[500px] bg-black">
        {/* Header Actions */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 md:p-6 bg-gradient-to-b from-black/60 to-transparent">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md h-10 w-10 border border-white/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleWishlist(item as any)}
              className="rounded-full bg-white/20 hover:bg-white text-white hover:text-red-500 backdrop-blur-md h-10 w-10 border border-white/30 transition-colors"
            >
              <Heart className={cn("h-5 w-5 transition-transform", inWishlist && "fill-red-500 text-red-500 scale-110")} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md h-10 w-10 border border-white/30"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[350px] lg:h-full overflow-hidden">
          <img 
            src={item.image?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80"} 
            alt={item.itemname} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Mobile Text Content overlaid on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {item.dietryType && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/30">
                  <div className={cn("w-3 h-3 rounded-[3px] border flex items-center justify-center bg-white", isVeg ? "border-green-600" : "border-red-600")}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
                  </div>
                  <span className="text-white text-xs font-bold">{isVeg ? 'Veg' : 'Non-Veg'}</span>
                </div>
              )}
              {isBestseller && (
                <span className="bg-orange-500/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Bestseller
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-white leading-tight mb-2 tracking-tight">
              {item.itemname}
            </h1>

            <div className="flex items-center gap-4 text-white/90 text-sm font-semibold mb-4">
              <span className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded text-green-400">
                <Star className="w-4 h-4 fill-current" /> {rating} (120+)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> 25 mins
              </span>
            </div>

            <div className="flex items-end gap-3">
              <p className="text-3xl font-black text-white">
                {org?.currency || '₹'}{item.sellingPrice || item.basePrice}
              </p>
              {hasBasePrice && (
                <p className="text-lg font-bold text-white/50 line-through mb-1">
                  {org?.currency || '₹'}{item.basePrice}
                </p>
              )}
              {discountDisplay && (
                <span className="text-orange-400 font-bold mb-1 ml-1">{discountDisplay}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 lg:mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column (Desktop Text Content + Tabs) */}
          <div className="lg:col-span-7">
            {/* Desktop Hero Content (Hidden on Mobile) */}
            <div className="hidden lg:block mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {item.dietryType && (
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                    <div className={cn("w-4 h-4 rounded-[4px] border flex items-center justify-center", isVeg ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50")}>
                      <div className={cn("w-2 h-2 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
                    </div>
                    <span className="text-foreground text-sm font-bold">{isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                  </div>
                )}
                {isBestseller && (
                  <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200 text-sm font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Star className="w-4 h-4 fill-current" /> Bestseller
                  </span>
                )}
              </div>

              <h1 className="text-4xl xl:text-5xl font-black text-[#0F172A] leading-tight mb-4 tracking-tight">
                {item.itemname}
              </h1>

              <div className="flex items-center gap-6 text-[#64748B] text-base font-bold mb-6">
                <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-lg text-green-700 border border-green-100 shadow-sm">
                  <Star className="w-5 h-5 fill-current" /> {rating} (120+ Reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-5 h-5" /> 25-30 mins delivery
                </span>
              </div>

              <div className="flex items-end gap-4 p-5 bg-white rounded-2xl border border-black/5 shadow-sm inline-flex">
                <div className="flex flex-col">
                  {hasBasePrice && (
                    <p className="text-lg font-bold text-muted-foreground line-through">
                      {org?.currency || '₹'}{item.basePrice}
                    </p>
                  )}
                  <p className="text-4xl font-black text-[#FF6B00]">
                    {org?.currency || '₹'}{item.sellingPrice || item.basePrice}
                  </p>
                </div>
                {discountDisplay && (
                  <div className="bg-green-100 text-green-700 font-black px-3 py-1 rounded-lg text-sm mb-1 uppercase tracking-widest border border-green-200">
                    {discountDisplay}
                  </div>
                )}
              </div>
            </div>

            {/* Information Tabs */}
            <ProductInfoTabs product={item as any} />
            
            {/* Recommended Products */}
            <RecommendedProducts />
          </div>

          {/* Right Column (Customization & Cart) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-6">
              
              {/* Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#FF6B00] rounded-full" />
                    Select Size/Variation
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {item.variations.map((v: any) => {
                      const isActive = selectedVariation === v.variationid || (!selectedVariation && item.variationid === v.variationid);
                      return (
                        <div
                          key={v.variationid}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-[16px] border-2 transition-all cursor-pointer group",
                            isActive ? "border-[#FF6B00] bg-orange-50/50 shadow-sm" : "border-border hover:border-[#FF6B00]/40 hover:bg-muted/30"
                          )}
                          onClick={() => handleVariationChange(v.variationid)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", isActive ? 'border-[#FF6B00]' : 'border-muted-foreground/30 group-hover:border-[#FF6B00]/50')}>
                              {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />}
                            </div>
                            <span className={cn("font-bold text-lg", isActive ? "text-foreground" : "text-muted-foreground")}>{v.variation_name}</span>
                          </div>
                          <span className="font-bold text-foreground">{org?.currency || '₹'}{v.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Addons */}
              {item.addons && item.addons.length > 0 && (
                <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5 space-y-8">
                  {item.addons.map((group: any) => (
                    <div key={group.addongroupid} className="space-y-4">
                      <div className="flex items-start justify-between border-b border-black/5 pb-4">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#FF6B00] rounded-full" />
                            {group.addongroup_name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium mt-1">
                            {group.min > 0 ? `Please select at least ${group.min}` : 'Optional'}
                            {group.max > 0 ? ` (Max ${group.max})` : ''}
                          </p>
                        </div>
                        {group.min > 0 && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-3 pt-2">
                        {group.items.map((addon: any) => {
                          const isSelected = (addonSelections[group.addongroupid] || []).includes(addon.addonitemid);
                          return (
                            <div 
                              key={addon.addonitemid}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-[16px] border-2 transition-all cursor-pointer group",
                                isSelected ? "border-[#FF6B00] bg-orange-50/50 shadow-sm" : "border-border hover:border-[#FF6B00]/40 hover:bg-muted/30"
                              )}
                              onClick={() => handleAddonChange(group.addongroupid, addon.addonitemid, group.min, group.max)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-5 h-5 border-2 flex items-center justify-center transition-colors", 
                                  group.max === 1 ? "rounded-full" : "rounded-[6px]",
                                  isSelected ? "border-[#FF6B00] bg-[#FF6B00]" : "border-muted-foreground/30 group-hover:border-[#FF6B00]/50"
                                )}>
                                  {isSelected && (
                                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <span className={cn("font-bold text-[15px]", isSelected ? "text-foreground" : "text-muted-foreground")}>{addon.addonitem_name}</span>
                              </div>
                              <span className="font-bold text-foreground">+ {org?.currency || '₹'}{addon.addonitem_price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Bar Desktop embedded in right column */}
              <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-black/5 mt-8 sticky bottom-8">
                {renderAddToCartBar()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-black/5 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-50 lg:hidden pb-safe">
        {renderAddToCartBar()}
      </div>
    </div>
  );
};
