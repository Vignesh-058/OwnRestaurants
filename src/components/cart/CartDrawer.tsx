import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Clock, Percent, Info, ChevronRight, Tag, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/CartStore";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useUpdateCart } from "@/hooks/cart/useUpdateCart";
import { useDeleteCart } from "@/hooks/cart/useDeleteCart";
import { useAuthStore } from "@/store/AuthStore";
import { useOutletStore } from "@/store/OutletStore";
import { useLocationStore } from "@/store/LocationStore";
import { useLocationModalStore } from "@/store/LocationModalStore";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CartItem as CartItemType } from "@/types/cart.types";

const AnimatedQuantity = ({ quantity, onIncrease, onDecrease, disabled }: any) => {
  return (
    <div className="flex items-center bg-[#FFF7ED] rounded-[10px] h-[36px] p-1 border border-[#FFEDD5]">
      <button
        onClick={onDecrease}
        disabled={disabled}
        className="w-[28px] h-[28px] flex items-center justify-center rounded-[8px] text-[#FF6B00] hover:bg-[#FFEDD5] disabled:opacity-50 transition-colors"
      >
        <span className="text-[18px] font-medium leading-none mb-0.5">-</span>
      </button>
      
      <div className="w-[32px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={quantity}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-[15px] font-bold text-[#111827]"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <button
        onClick={onIncrease}
        disabled={disabled}
        className="w-[28px] h-[28px] flex items-center justify-center rounded-[8px] text-[#FF6B00] hover:bg-[#FFEDD5] disabled:opacity-50 transition-colors"
      >
        <span className="text-[18px] font-medium leading-none mb-0.5">+</span>
      </button>
    </div>
  );
};

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { isDrawerOpen, closeDrawer, cartItems, orderTotal, deliveryCharge, totalTax, grandTotal, savedAmount, orderId, orderType, updateItemQuantity } = useCartStore();
  const currency = useOrganizationStore((state) => state.organization?.currency || "₹");
  const { user } = useAuthStore();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { wishlistItems, toggleWishlist } = useWishlist();

  const customerPhoneNo = user?.phone || "0000000000";
  const customerName = user?.name || "Guest";

  const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
  const { mutate: removeItem, isPending: isRemoving } = useDeleteCart();
  
  const updateTimeoutRef = useRef<any>(null);

  // Close drawer on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const triggerCartUpdate = (updatedDeliveryType = orderType) => {
    if (!selectedOutlet || !orderId) return;

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const latestCartItems = useCartStore.getState().cartItems;
      const cartCurrency = currency === '₹' ? 'INR' : currency;
      const globalAddressId = useCartStore.getState().addressId;
      const currentLocId = useLocationStore.getState().addressId;
      const currentAddressId = currentLocId || globalAddressId;

      if (updatedDeliveryType === 'Door Delivery' && !currentAddressId) {
        useLocationModalStore.getState().openModal();
        toast.error('Please select a delivery address first.');
        return;
      }

      const payload: any = {
        items: latestCartItems.map((c: any) => ({
          itemId: c.itemid?._id || c.itemid,
          quantity: c.quantity,
          variationId: c.variation_id?._id || "",
          addOnDetails: c.addons || [],
          currency: cartCurrency
        })),
        deliveryType: updatedDeliveryType,
        orderType: updatedDeliveryType,
        customerName: user?.name || 'Guest',
        customerPhoneNo: user?.phone || '0000000000',
        instruction: '',
        outletId: selectedOutlet._id,
        addressId: currentAddressId,
        orderId: orderId || undefined
      };

      console.log("=== CART UPDATE: CartDrawer triggerCartUpdate ===");
      console.log("Selected Address (LocationStore):", useLocationStore.getState());
      console.log("addressId:", currentAddressId);
      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      updateCart(payload);
    }, 600);
  };

  const handleUpdateQuantity = (item: CartItemType, newQuantity: number) => {
    if (!selectedOutlet || !orderId) return;

    if (newQuantity <= 0) {
      handleRemove(item);
      return;
    }

    updateItemQuantity(item._id, newQuantity);
    triggerCartUpdate();
  };

  const handleRemove = (item: CartItemType) => {
    if (!selectedOutlet || !orderId) return;
    
    removeItem({
      outletId: selectedOutlet._id,
      orderId,
      itemid: item._id || (item.itemid as any)._id || (item.itemid as any).itemid,
      customerPhoneNo,
      customerName
    });
  };

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    closeDrawer();
    navigate('/products');
  };

  const FREE_DELIVERY_THRESHOLD = 500;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - grandTotal);
  const progressPercent = Math.min(100, (grandTotal / FREE_DELIVERY_THRESHOLD) * 100);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[4px] z-[100]"
            onClick={closeDrawer}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { ease: "easeInOut", duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col bg-[#FAFAFA] shadow-[-10px_0_40px_rgba(0,0,0,0.08)] w-full md:w-[400px] lg:w-[430px] md:rounded-l-[24px] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white px-6 pt-6 pb-4 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[22px] font-bold text-[#111827] tracking-tight">Shopping Cart ({cartItems.length})</h2>
                  <p className="text-[#6B7280] text-[14px] mt-0.5">You've selected delicious items.</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="w-10 h-10 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              {cartItems.length > 0 && (
                <div className="bg-[#FFF7ED] rounded-[12px] p-3 border border-[#FFEDD5]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[16px]">🛵</span>
                    <p className="text-[13px] font-bold text-[#111827]">
                      {amountToFreeDelivery > 0 ? (
                        <>You're <span className="text-[#FF6B00]">{currency}{amountToFreeDelivery.toLocaleString()}</span> away from Free Delivery</>
                      ) : (
                        <span className="text-[#10B981]">You've unlocked Free Delivery!</span>
                      )}
                    </p>
                  </div>
                  <div className="h-[6px] w-full bg-[#FFE4CC] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-colors duration-300",
                        amountToFreeDelivery === 0 ? "bg-[#10B981]" : "bg-[#FF6B00]"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {cartItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center px-6"
                >
                  <div className="w-[140px] h-[140px] bg-gradient-to-tr from-[#FFF0E5] to-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#FFE4CC]">
                    <ShoppingBag className="w-14 h-14 text-[#FF6B00]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[24px] font-black text-[#111827] mb-2 tracking-tight">Your cart is empty</h3>
                  <p className="text-[#6B7280] text-[15px] mb-8 max-w-[260px] mx-auto">Looks like you haven't added anything yet. Discover our delicious menu.</p>
                  <Button 
                    onClick={handleContinueShopping}
                    className="rounded-full px-8 h-[54px] text-[16px] font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] hover:from-[#E65C00] hover:to-[#FF6B00] text-white shadow-[0_8px_20px_rgba(255,107,0,0.25)] border-0 w-full"
                  >
                    Browse Products
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="p-4 md:p-6 space-y-4"
                >
                  {cartItems.map((item) => {
                    const isVeg = item.itemid.dietryType?.toLowerCase() === 'veg' || item.itemid.dietryType?.toLowerCase() === 'vegan';
                    const isNonVeg = item.itemid.dietryType?.toLowerCase() === 'non-veg';
                    const sellingPrice = item.unitPrice || 0;
                    const originalPrice = item.basePrice || sellingPrice;
                    let discountDisplay = '';
                    if (originalPrice > sellingPrice && originalPrice > 0) {
                      const discountPercent = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
                      discountDisplay = `${discountPercent}% OFF`;
                    }

                    return (
                      <motion.div 
                        variants={itemVariants}
                        layout
                        key={item._id} 
                        className={cn(
                          "flex gap-4 bg-white p-4 rounded-[20px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-[#F1F5F9] relative group",
                          item.stockStatus !== 'In Stock' ? 'opacity-70' : ''
                        )}
                      >
                        {/* Image */}
                        <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] bg-[#F8F9FA] rounded-[16px] overflow-hidden shrink-0 relative">
                          {item.itemid.image?.[0] ? (
                            <img src={item.itemid.image[0]} alt={item.itemid.itemname} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
                              <ShoppingBag className="w-6 h-6 text-[#D1D5DB]" />
                            </div>
                          )}
                          {discountDisplay && (
                            <div className="absolute top-0 left-0 bg-[#FF6B00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-[8px]">
                              {discountDisplay}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col pt-0.5">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col flex-1 pr-2">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  {item.itemid.dietryType && (
                                    <div className={cn(
                                      "flex items-center justify-center w-3.5 h-3.5 border-[1.5px] rounded-[3px] shrink-0",
                                      isVeg ? "border-green-600" : isNonVeg ? "border-red-600" : "border-yellow-500"
                                    )}>
                                      <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-600" : isNonVeg ? "bg-red-600" : "bg-yellow-500")} />
                                    </div>
                                  )}
                                  <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider">
                                    {(item.itemid as any).categoryId?.categoryName || 'Food'}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="font-black text-[16px] text-[#111827] leading-none">
                                    {currency}{sellingPrice.toLocaleString()}
                                  </span>
                                  {originalPrice > sellingPrice && (
                                    <span className="text-[11px] font-medium text-[#9CA3AF] line-through leading-none mt-1">
                                      {currency}{originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <h4 className="font-bold text-[15px] text-[#111827] line-clamp-1 leading-tight">{(item.itemid as any).itemname}</h4>
                              
                              <p className="text-[12px] text-[#6B7280] line-clamp-1 mt-0.5">
                                {(item.itemid as any).description || 'Delicious and freshly prepared just for you.'}
                              </p>

                              {item.variation_id && (
                                <span className="text-[12px] font-medium text-[#6B7280] mt-0.5">{(item.itemid as any).categoryId?.name}</span>
                              )}

                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center gap-1 text-[11px] text-[#111827] font-bold bg-[#F3F4F6] px-1.5 py-0.5 rounded-[4px]">
                                  <span>⭐ 4.8</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-[#6B7280] font-medium bg-[#F3F4F6] px-1.5 py-0.5 rounded-[4px]">
                                  <Clock className="w-3 h-3" />
                                  <span>15 mins</span>
                                </div>
                                {item.stockStatus !== 'In Stock' && (
                                  <span className="text-[11px] font-bold text-red-500">Out of Stock</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between mt-auto pt-3">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleRemove(item)}
                                disabled={isUpdating || isRemoving}
                                className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280] hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                              <button 
                                onClick={() => {
                                  const prodId = (item.itemid as any)._id || (item.itemid as any).itemid;
                                  toggleWishlist(prodId);
                                  handleRemove(item);
                                }}
                                disabled={isUpdating || isRemoving}
                                className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280] hover:text-[#FF6B00] transition-colors"
                              >
                                <Heart className={cn("w-3.5 h-3.5", wishlistItems?.includes((item.itemid as any)._id || (item.itemid as any).itemid) ? "fill-[#FF6B00] text-[#FF6B00]" : "")} /> Save for Later
                              </button>
                            </div>
                            
                            <AnimatedQuantity 
                              quantity={item.quantity}
                              onIncrease={() => handleUpdateQuantity(item, item.quantity + 1)}
                              onDecrease={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={isUpdating || isRemoving || item.stockStatus !== 'In Stock'}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Promo Code Row */}
                  <motion.div variants={itemVariants} className="mt-6 mb-2 flex flex-col gap-2">
                    <button className="w-full flex items-center justify-between p-4 bg-white border border-dashed border-[#CBD5E1] rounded-[16px] hover:border-[#FF6B00] hover:bg-[#FFF7ED] transition-colors group">
                      <div className="flex items-center gap-3 text-[#111827] font-semibold text-[14px]">
                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] group-hover:bg-[#FFEDD5] flex items-center justify-center transition-colors">
                          <Percent className="w-4 h-4 text-[#FF6B00]" />
                        </div>
                        Apply Promo Code
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#FF6B00] transition-colors" />
                    </button>
                    {savedAmount > 0 && (
                      <div className="px-2">
                        <span className="text-[13px] font-bold text-[#10B981]">You saved {currency}{savedAmount.toLocaleString()} today!</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Bill Details */}
                  <motion.div variants={itemVariants} className="bg-white p-5 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#F1F5F9]">
                    <h3 className="font-bold text-[15px] text-[#111827] mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#FF6B00]" />
                      Bill Details
                    </h3>
                    <div className="space-y-3 text-[14px]">
                      <div className="flex justify-between text-[#6B7280]">
                        <span>Item Total</span>
                        <span className="text-[#111827] font-medium">{currency}{orderTotal.toLocaleString()}</span>
                      </div>
                      {savedAmount > 0 && (
                        <div className="flex justify-between text-[#10B981] font-medium">
                          <span>Item Discount</span>
                          <span>-{currency}{savedAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {deliveryCharge > 0 && (
                        <div className="flex justify-between text-[#6B7280]">
                          <span className="flex items-center gap-1">Delivery Charge <Info className="w-3.5 h-3.5" /></span>
                          <span className="text-[#111827] font-medium">{currency}{deliveryCharge.toLocaleString()}</span>
                        </div>
                      )}
                      {totalTax > 0 && (
                        <div className="flex justify-between text-[#6B7280]">
                          <span>Taxes & GST</span>
                          <span className="text-[#111827] font-medium">{currency}{totalTax.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-3 mt-1 border-t border-dashed border-[#E5E7EB] flex justify-between items-center">
                        <span className="font-bold text-[16px] text-[#111827]">Grand Total</span>
                        <span className="font-black text-[20px] text-[#111827]">{currency}{grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>

                </motion.div>
              )}
            </div>

            {/* Bottom Actions */}
            {cartItems.length > 0 && (
              <div className="bg-white p-4 md:px-6 md:pb-6 md:pt-4 shrink-0 shadow-[0_-4px_25px_rgba(0,0,0,0.04)] z-10 border-t border-[#F3F4F6]">
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-[56px] rounded-[16px] text-[16px] font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] hover:from-[#E65C00] hover:to-[#FF6B00] text-white shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,107,0,0.35)] hover:-translate-y-0.5 transition-all duration-300 border-0 flex items-center justify-between px-6"
                    onClick={handleCheckout}
                  >
                    <div className="flex flex-col items-start leading-none text-left">
                      <span className="text-[12px] font-semibold opacity-90 mb-1">{cartItems.length} ITEM{cartItems.length > 1 ? 'S' : ''}</span>
                      <span className="text-[16px] font-black">{currency}{grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      Proceed to Checkout <ChevronRight className="w-5 h-5" />
                    </div>
                  </Button>
                  <Button 
                    variant="ghost"
                    className="w-full h-[48px] rounded-[16px] text-[15px] font-bold text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
