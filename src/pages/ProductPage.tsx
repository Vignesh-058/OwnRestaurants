import type {
  CategoryItemVariation,
  CategoryItemAddonItem,
} from "@/types/category.types";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Share2, Star, Clock, ImageOff, AlertCircle, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useItemDetail } from "@/hooks/queries/useItemDetail";
import { useAddToCart, useUpdateCart } from "@/hooks/queries/useCart";
import { useAuthStore } from "@/store/AuthStore";
import { useOutletStore } from "@/store/OutletStore";
import { getCartAddressPayload } from "@/utils/cartPayload";
import { useAddressFlow } from "@/hooks/cart/useAddressFlow";
import { useCartStore } from "@/store/CartStore";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { RecommendedProducts } from "@/components/product/RecommendedProducts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AddonSelection = Record<string, string[]>;

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { user } = useAuthStore();
  const { handleAddressAndProceed } = useAddressFlow();
  const { orderId, orderType } = useCartStore();

  const [selectedVariation, setSelectedVariation] = useState<
    string | undefined
  >(undefined);
  const [addonSelections, setAddonSelections] = useState<AddonSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    data: item,
    isLoading,
    isError,
  } = useItemDetail(id || null, selectedVariation);
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();

  const handleVariationChange = (variationId: string) => {
    setSelectedVariation(variationId);
    setAddonSelections({});
  };

  const handleAddonChange = (
    groupId: string,
    itemId: string,
    _min: number,
    max: number,
  ) => {
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
          const addonItem = group.items.find(
            (i: CategoryItemAddonItem) => i.addonitemid === selId,
          );
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
        const selectedCount = (addonSelections[group.addongroupid] || [])
          .length;
        if (selectedCount < group.min) return false;
      }
    }
    return true;
  }, [item, addonSelections, selectedVariation]);

  const handleAddToCart = () => {
    if (!item || !selectedOutlet || !user?.phone) {
      toast.error("Please login and select an outlet first");
      return;
    }

    const addOnDetails = Object.entries(addonSelections)
      .map(([groupId, items]) => ({
        group_id: groupId,
        addon_item_ids: items,
      }))
      .filter((g) => g.addon_item_ids.length > 0);

    const activeVariation = selectedVariation || item.variationid || "";
    const cartCurrency = org?.currency || "INR";

    const newItem = {
      itemId: item.itemid,
      quantity,
      variationId: activeVariation,
      addOnDetails,
      currency: cartCurrency,
    };

    let updatedItems = [];

    if (orderId) {
      const cartItems = useCartStore.getState().cartItems;
      updatedItems = cartItems.map((c) => ({
        itemId: c.product_retailer_id,
        quantity: c.quantity,
        variationId: c.variationId || "",
        addOnDetails: c.addons || [],
        currency: cartCurrency,
      }));

      const isSameAddon = (a1: unknown[], a2: unknown[]) =>
        JSON.stringify(a1) === JSON.stringify(a2);

      const existingIndex = updatedItems.findIndex(
        (i) =>
          i.itemId === newItem.itemId &&
          i.variationId === newItem.variationId &&
          isSameAddon(i.addOnDetails, newItem.addOnDetails),
      );

      if (existingIndex >= 0) {
        updatedItems[existingIndex].quantity += quantity;
      } else {
        updatedItems.push(newItem);
      }
    } else {
      updatedItems = [newItem];
    }

    const currentOrderType = orderType || "Takeaway";

    const proceedWithAdd = () => {
      const addressPayload = getCartAddressPayload();

      const payload: any = {
        items: updatedItems,
        deliveryType: currentOrderType,
        orderType: currentOrderType,
        customerName: user.name || "Guest",
        customerPhoneNo: user.phone,
        instruction: "",
        outletId: selectedOutlet._id,
        ...addressPayload,
      };
      if (orderId) {
        payload.orderId = orderId;
      }

      if (import.meta.env.DEV) {
        console.log("=== CART UPDATE: ProductPage handleAddToCart ===");
        console.log("addressPayload:", addressPayload);
        console.log("Final Payload:", JSON.stringify(payload, null, 2));
      }

      if (orderId) {
        updateCart(payload);
      } else {
        addToCart(payload);
      }
    };

    if (currentOrderType === "Door Delivery") {
      handleAddressAndProceed(proceedWithAdd);
    } else {
      proceedWithAdd();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.itemname || "Check out this product",
          text: `Check out ${item?.itemname} on OwnCart!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (import.meta.env.DEV) console.log("Error sharing", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 h-[350px] lg:h-[600px]">
            <Skeleton className="w-full h-full rounded-3xl" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-1/2 h-8" />
            <Skeleton className="w-full h-[200px] rounded-3xl mt-12" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-3xl font-black text-foreground mb-3">Product not found</h3>
        <p className="text-muted-foreground font-medium mb-8 text-lg">The item you are looking for is unavailable.</p>
        <Button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-6 text-lg font-bold">
          Go Back
        </Button>
      </div>
    );
  }

  const isPending = isAdding || isUpdating;
  const hasBasePrice = item.sellingPrice < item.basePrice;
  const maxAllowed =
    item.trackInventory && item.stockCount !== undefined
      ? item.stockCount
      : 999;
  const isOutOfStock =
    !item.stockStatus || (item.trackInventory && item.stockCount === 0);

  // Discount calculation
  let discountDisplay = null;
  if (hasBasePrice) {
    const calculatedPercent = Math.round(
      ((item.basePrice - item.sellingPrice) / item.basePrice) * 100,
    );
    if (calculatedPercent > 0) {
      discountDisplay = `${calculatedPercent}% OFF`;
    }
  }

  const isVeg =
    item.dietryType?.toLowerCase() === "veg" ||
    item.dietryType?.toLowerCase() === "vegan";
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
        <div className="w-10 text-center font-bold text-orange-600 text-lg">
          {quantity}
        </div>
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
        className="flex-1 lg:max-w-[300px] h-[52px] text-lg rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black tracking-wide transition-transform active:scale-[0.98]"
        onClick={handleAddToCart}
        disabled={!isValidSelection || isOutOfStock || isPending}
      >
        {isPending ? (
          "Adding..."
        ) : !isOutOfStock ? (
          <span className="flex items-center justify-between w-full px-2">
            <span>Add</span>
            <span>•</span>
            <span>
              {org?.currency || "₹"}
              {calculateTotalPrice.toFixed(2)}
            </span>
          </span>
        ) : (
          "Out of Stock"
        )}
      </Button>
    </div>
  );

  return (
    <div
      className="w-full min-h-screen bg-[#FAF8F5] transition-all duration-300"
      style={{
        paddingBottom: "calc(6.5rem + var(--floating-nav-height, 0px))",
      }}
    >
      <div className="max-w-7xl mx-auto w-full lg:py-8 px-0 lg:px-8 flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-12 relative">
        
        {/* Mobile Header (Back & Share) */}
        <div className="lg:hidden absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md h-10 w-10 border border-white/30 pointer-events-auto"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md h-10 w-10 border border-white/30 pointer-events-auto"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="lg:col-span-5 relative w-full lg:sticky lg:top-24 lg:h-max">
          <div className="relative w-full h-[350px] lg:h-auto lg:aspect-[4/5] bg-muted overflow-hidden lg:rounded-3xl lg:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
            {!imageLoaded && !imageError && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            {imageError ? (
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground gap-3">
                <ImageOff className="w-10 h-10 opacity-20" />
                <span className="text-sm font-medium opacity-50">No Image Available</span>
              </div>
            ) : (
              <img
                src={item.image?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80"}
                alt={item.itemname}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  !imageLoaded ? "opacity-0" : "opacity-100"
                )}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImageError(true); setImageLoaded(true); }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden pointer-events-none" />

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {discountDisplay && (
                <div className="bg-[#FF6B00] text-white text-[13px] font-black px-3 py-1.5 rounded-lg shadow-sm flex items-center tracking-wide w-max">
                  {discountDisplay}
                </div>
              )}
            </div>

            {/* Mobile Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {item.dietryType && (
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/30">
                    <div className={cn("w-3 h-3 rounded-[3px] border flex items-center justify-center bg-white", isVeg ? "border-green-600" : "border-red-600")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
                    </div>
                    <span className="text-white text-[11px] font-bold">{isVeg ? "Veg" : "Non-Veg"}</span>
                  </div>
                )}
                {isBestseller && (
                  <span className="bg-yellow-400/90 text-yellow-900 backdrop-blur-md px-2 py-1 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Bestseller
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-white leading-tight mb-1">{item.itemname}</h1>
              <div className="flex items-center gap-3 text-white/90 text-xs font-semibold">
                <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3.5 h-3.5 fill-current" /> {rating}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 25 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="lg:col-span-7 px-4 md:px-8 lg:px-0 pt-6 pb-32 lg:pb-0 lg:pt-0">
          
          {/* Desktop Breadcrumbs & Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <div className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>
                <Home className="w-4 h-4" /> Home
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <div className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/products')}>
                Products
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="text-foreground line-clamp-1 max-w-[200px]">{item.itemname}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-10 w-10 hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Title & Meta */}
          <div className="hidden lg:block mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {item.dietryType && (
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border shadow-sm">
                  <div className={cn("w-4 h-4 rounded-[4px] border flex items-center justify-center", isVeg ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50")}>
                    <div className={cn("w-2 h-2 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
                  </div>
                  <span className="text-foreground text-xs font-extrabold uppercase tracking-wide">{isVeg ? "Vegetarian" : "Non-Vegetarian"}</span>
                </div>
              )}
              {isBestseller && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg border border-yellow-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 fill-current" /> Bestseller
                </span>
              )}
            </div>

            <h1 className="text-4xl xl:text-5xl font-black text-foreground leading-[1.15] mb-5 tracking-tight">
              {item.itemname}
            </h1>

            <div className="flex items-center gap-5 text-muted-foreground text-sm font-bold mb-6">
              <span className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg text-yellow-800 border border-yellow-100 shadow-sm">
                <Star className="w-4 h-4 fill-current" /> {rating} Ratings
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg shadow-sm">
                <Clock className="w-4 h-4 text-primary" /> 25-30 mins delivery
              </span>
            </div>

            <div className="flex items-end gap-3 p-5 bg-white rounded-2xl border border-black/5 shadow-sm inline-flex">
              <div className="flex flex-col">
                {hasBasePrice && (
                  <p className="text-sm font-bold text-muted-foreground line-through mb-0.5">
                    {org?.currency || "₹"}{item.basePrice}
                  </p>
                )}
                <p className="text-4xl font-black text-foreground leading-none">
                  {org?.currency || "₹"}{item.sellingPrice || item.basePrice}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
              {/* Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-black/5">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    Select Size/Variation
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {item.variations.map((v: CategoryItemVariation) => {
                      const isActive =
                        selectedVariation === v.variationid ||
                        (!selectedVariation &&
                          item.variationid === v.variationid);
                      return (
                        <div
                          key={v.variationid}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-full border-2 transition-all cursor-pointer group",
                            isActive
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/40 hover:bg-muted/30",
                          )}
                          onClick={() => handleVariationChange(v.variationid)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                isActive
                                  ? "border-primary"
                                  : "border-muted-foreground/30 group-hover:border-primary/50",
                              )}
                            >
                              {isActive && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "font-bold text-lg",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {v.variation_name}
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
                            {org?.currency || "₹"}
                            {v.price}
                          </span>
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
                            <span className="w-1.5 h-5 bg-primary rounded-full" />
                            {group.addongroup_name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium mt-1">
                            {group.min > 0
                              ? `Please select at least ${group.min}`
                              : "Optional"}
                            {group.max > 0 ? ` (Max ${group.max})` : ""}
                          </p>
                        </div>
                        {group.min > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"
                          >
                            Required
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-3 pt-2">
                        {group.items.map((addon: CategoryItemAddonItem) => {
                          const isSelected = (
                            addonSelections[group.addongroupid] || []
                          ).includes(addon.addonitemid);
                          return (
                            <div
                              key={addon.addonitemid}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-[16px] border-2 transition-all cursor-pointer group",
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-border hover:border-primary/40 hover:bg-muted/30",
                              )}
                              onClick={() =>
                                handleAddonChange(
                                  group.addongroupid,
                                  addon.addonitemid,
                                  group.min,
                                  group.max,
                                )
                              }
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-5 h-5 border-2 flex items-center justify-center transition-colors",
                                    group.max === 1
                                      ? "rounded-full"
                                      : "rounded-[6px]",
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-muted-foreground/30 group-hover:border-primary/50",
                                  )}
                                >
                                  {isSelected && (
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      className="w-3.5 h-3.5 text-white"
                                      stroke="currentColor"
                                      strokeWidth="3.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    "font-bold text-[15px]",
                                    isSelected
                                      ? "text-foreground"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {addon.addonitem_name}
                                </span>
                              </div>
                              <span className="font-bold text-foreground">
                                + {org?.currency || "₹"}
                                {addon.addonitem_price}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Information Tabs */}
              <div className="pt-6">
                <ProductInfoTabs product={item as any} />
              </div>

              {/* Recommended Products */}
              <div className="pt-6">
                <RecommendedProducts />
              </div>

              {/* Bottom Bar Desktop embedded in right column */}
              <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-black/5 mt-8 sticky bottom-8">
                {renderAddToCartBar()}
              </div>
            </div>
          </div>
        </div>

      {/* Bottom Bar Mobile */}
      <div
        className="fixed left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-black/5 shadow-[0_-20px_40px_rgba(0,0,0,0.08)] z-50 lg:hidden pb-safe transition-all duration-300"
        style={{ bottom: "var(--floating-nav-height, 0px)" }}
      >
        {renderAddToCartBar()}
      </div>
    </div>
  );
};
