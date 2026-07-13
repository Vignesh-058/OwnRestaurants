import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/CartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { CategoryItem } from '@/types/category.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, Check, Minus, Plus, Star, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useDeleteCart } from '@/hooks/cart/useDeleteCart';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';

interface ProductCardProps {
  product: CategoryItem;
  className?: string;
  onClick?: (product: CategoryItem) => void;
}

export const ProductCard = ({ product, className, onClick }: ProductCardProps) => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems) || [];
  const { wishlistItems, toggleWishlist: storeToggleWishlist } = useWishlist();
  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');
  
  const { mutate: updateCart, isPending: isAdding } = useUpdateCart();
  const { mutate: removeItem, isPending: isRemoving } = useDeleteCart();
  const { orderId, orderType, optimisticSetQuantity } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  const matchingCartItems = cartItems.filter((item) => {
    const itemMatch = item.itemid?._id === product._id || 
      (typeof item.itemid === 'string' && item.itemid === product._id);
    return itemMatch;
  });
  
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("Cart Sync Log - Items:", cartItems.map(c => ({ id: c.itemid?._id || c.itemid, qty: c.quantity })), "Product ID:", product._id);
    }
  }, [cartItems, product._id]);

  const totalQuantity = matchingCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const inWishlist = wishlistItems.some((item) => item._id === product._id);

  // Use defaultSellingPrice if variations exist, fallback to sellingPrice
  const sellingPrice = Number(product.defaultSellingPrice || product.sellingPrice || product.price || 0);
  const originalPrice = Number(product.defaultBasePrice || product.basePrice || sellingPrice);
  
  // Calculate discount percentage if original price is greater than selling price
  let discountDisplay = '';
  if (originalPrice > sellingPrice && originalPrice > 0) {
    const discountPercent = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
    discountDisplay = `${discountPercent}% OFF`;
  }
  
  const isVeg = product.dietryType?.toLowerCase() === 'veg';

  const descText = product.description 
    ? product.description.replace(/<[^>]*>?/gm, '').trim() 
    : '';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const hasVariations = product.variations && product.variations.length > 0;
    if (hasVariations) {
      onClick?.(product);
      return;
    }

    if (!selectedOutlet) {
      toast.error("Please select an outlet first.");
      return;
    }

    const cartCurrency = currency === '₹' ? 'INR' : currency;

    // Build existing items payload
    const existingItems = cartItems.map(c => ({
      itemId: (c.itemid as any)._id || (c.itemid as any).itemid || c.itemid,
      quantity: c.quantity,
      variationId: c.variation_id?._id || "",
      addOnDetails: c.addons || [],
      currency: cartCurrency
    }));

    const matchingIndex = existingItems.findIndex(i => 
      i.itemId === product._id && i.variationId === ""
    );

    if (matchingIndex !== -1) {
      existingItems[matchingIndex].quantity += 1;
    } else {
      existingItems.push({
        itemId: product._id,
        quantity: 1,
        variationId: "",
        addOnDetails: [],
        currency: cartCurrency
      });
    }

    const payload: any = {
      items: existingItems,
      deliveryType: orderType || 'Door Delivery',
      orderType: orderType || 'Door Delivery',
      customerName: user?.name || 'Guest',
      customerPhoneNo: user?.phone || '0000000000',
      instruction: '',
      outletId: selectedOutlet._id,
    };
    if (orderId) payload.orderId = orderId;

    optimisticSetQuantity(product, 1);

    updateCart(payload, {
      onSuccess: () => {
        toast.success("Product added to cart.");
      }
    });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (matchingCartItems.length === 0 || !selectedOutlet) return;
    
    const lastItem = matchingCartItems[matchingCartItems.length - 1];
    const newQty = lastItem.quantity - 1;

    if (newQty <= 0) {
      optimisticSetQuantity(product, 0);
      removeItem({
        outletId: selectedOutlet._id,
        orderId: orderId || '',
        itemid: lastItem._id || lastItem.itemid?._id,
        customerPhoneNo: user?.phone || '0000000000',
        customerName: user?.name || 'Guest'
      }, {
        onSuccess: () => {
          toast.success("Product removed from cart.");
        }
      });
    } else {
      const cartCurrency = currency === '₹' ? 'INR' : currency;
      const updatedItems = cartItems.map(c => {
        if (c._id === lastItem._id) {
          return { ...c, quantity: newQty };
        }
        return c;
      });

      const payload: any = {
        items: updatedItems.map(c => ({
          itemId: (c.itemid as any)._id || (c.itemid as any).itemid || c.itemid,
          quantity: c.quantity,
          variationId: c.variation_id?._id || "",
          addOnDetails: c.addons || [],
          currency: cartCurrency
        })),
        deliveryType: orderType || 'Door Delivery',
        orderType: orderType || 'Door Delivery',
        customerName: user?.name || 'Guest',
        customerPhoneNo: user?.phone || '0000000000',
        instruction: '',
        outletId: selectedOutlet._id,
      };
      if (orderId) payload.orderId = orderId;
      
      optimisticSetQuantity(product, newQty);
      updateCart(payload);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (matchingCartItems.length === 0 || !selectedOutlet) return;

    const lastItem = matchingCartItems[matchingCartItems.length - 1];
    const newQty = lastItem.quantity + 1;
    const cartCurrency = currency === '₹' ? 'INR' : currency;

    const updatedItems = cartItems.map(c => {
      if (c._id === lastItem._id) {
        return { ...c, quantity: newQty };
      }
      return c;
    });

    const payload: any = {
      items: updatedItems.map(c => ({
        itemId: (c.itemid as any)._id || (c.itemid as any).itemid || c.itemid,
        quantity: c.quantity,
        variationId: c.variation_id?._id || "",
        addOnDetails: c.addons || [],
        currency: cartCurrency
      })),
      deliveryType: orderType || 'Door Delivery',
      orderType: orderType || 'Door Delivery',
      customerName: user?.name || 'Guest',
      customerPhoneNo: user?.phone || '0000000000',
      instruction: '',
      outletId: selectedOutlet._id,
    };
    if (orderId) payload.orderId = orderId;
    
    optimisticSetQuantity(product, newQty);
    updateCart(payload);
  };

  const toggleWishlist = (product: CategoryItem) => {
    storeToggleWishlist(product);
    toast.success(
      inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      { description: product.name }
    );
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col w-full h-full min-h-[340px] bg-white rounded-[16px] border border-[#ECECEC] shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)] hover:-translate-y-[6px] transition-all duration-300 overflow-hidden cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(product)}
    >
      {/* 1. Large Product Image (Compact Height 200px) */}
      <div className="relative w-full h-[200px] shrink-0 bg-[#F8F9FA] overflow-hidden">
        <img
          src={product.imageUrl?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Left: Veg/Non-Veg Badge */}
        {product.dietryType && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center justify-center w-6 h-6 rounded bg-white/90 backdrop-blur-sm shadow-sm">
            <div
              className={cn(
                "flex items-center justify-center w-3.5 h-3.5 border-[1.5px] rounded-[3px]",
                isVeg ? "border-green-600" : "border-red-600"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
            </div>
          </div>
        )}

        {/* Top Right: Wishlist Heart & Discount & Bestseller */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="w-[34px] h-[34px] rounded-full bg-white/90 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
          >
            <Heart 
              className={cn("w-4 h-4 transition-colors duration-300", inWishlist ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-[#64748B]')} 
            />
          </button>
          
          {discountDisplay && (
            <div className="bg-[#FF6B00] text-white text-[11px] font-bold px-2 py-1 rounded-[6px] shadow-sm flex items-center gap-1">
              {discountDisplay}
            </div>
          )}
        </div>
      </div>

      {/* 2. Product Information & Actions */}
      <div className="flex flex-col flex-1 p-3.5 md:p-4">
        {/* Title */}
        <h3 className="font-semibold text-[18px] text-[#111827] line-clamp-2 leading-[22px] group-hover:text-[#FF6B00] transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
            <span className="text-[12px] font-bold text-[#4B5563]">{product.rating}</span>
          </div>
        )}
        
        {/* Description */}
        {descText && (
          <p className="text-[#6B7280] font-medium text-[12px] line-clamp-1 mt-1">
            {descText}
          </p>
        )}

        <div className="flex-1" />

        {/* Price & Add Button Row */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F3F4F6]">
          {/* Price Column */}
          <div className="flex flex-col">
            <span className="text-[20px] font-bold text-[#FF6B00] leading-none tracking-tight">
              {currency}{sellingPrice.toLocaleString()}
            </span>
            {originalPrice > sellingPrice && (
              <span className="text-[12px] font-medium text-[#9CA3AF] line-through leading-none mt-1">
                {currency}{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add Button / Quantity Selector */}
          <div className="relative h-[42px] lg:h-[46px] w-[130px] lg:w-[150px] shrink-0" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              {totalQuantity > 0 ? (
                <motion.div
                  key="quantity"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-between bg-white rounded-full p-1 border-[1.5px] border-[#FFE4E6] shadow-[0_4px_12px_rgba(255,107,0,0.08)]"
                >
                  <button
                    onClick={handleDecrement}
                    disabled={isAdding || isRemoving}
                    className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] flex items-center justify-center rounded-full bg-[#FFF0F2] text-[#FF6B00] transition-colors duration-200 hover:bg-[#FF6B00] hover:text-white disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 lg:w-4.5 lg:h-4.5 stroke-[3]" />
                  </button>
                  <span className="text-[16px] font-semibold text-[#FF6B00] select-none flex-1 text-center">
                    {totalQuantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={isAdding || isRemoving}
                    className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] flex items-center justify-center rounded-full bg-[#FFF0F2] text-[#FF6B00] transition-colors duration-200 hover:bg-[#FF6B00] hover:text-white disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 lg:w-4.5 lg:h-4.5 stroke-[3]" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Button
                    className="w-full h-full rounded-full bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold text-[14px] lg:text-[15px] shadow-[0_4px_12px_rgba(255,107,0,0.18)] hover:shadow-[0_6px_16px_rgba(255,107,0,0.28)] transition-all duration-300 border-0"
                    onClick={handleQuickAdd}
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Add +"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
