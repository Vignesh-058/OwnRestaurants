import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { CategoryItem } from '@/types/category.types';
import { cn } from '@/lib/utils';
import { AddToCartButton } from '@/components/ui/add-to-cart-button';
import { Loader2, Minus, Plus, Star, ImageOff } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useCreateCart } from '@/hooks/cart/useCreateCart';
import { useDeleteCart } from '@/hooks/cart/useDeleteCart';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';
import { getCartAddressPayload } from '@/utils/cartPayload';
import { useAddressFlow } from '@/hooks/cart/useAddressFlow';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardProps {
  product: CategoryItem;
  className?: string;
  onClick?: (product: CategoryItem) => void;
  layout?: 'vertical' | 'horizontal';
}

export const ProductCard = React.memo(({ product, className, onClick: _onClick, layout = 'vertical' }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems) || [];
  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');
  
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
  const { mutate: createCart, isPending: isCreating } = useCreateCart();
  const { mutate: removeItem, isPending: isRemoving } = useDeleteCart();
  const { orderId, orderType, tableInfo, optimisticSetQuantity, openDrawer, preBookingId: storePreBookingId, preOrderDate: storePreOrderDate, preOrderTime: storePreOrderTime, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { handleAddressAndProceed } = useAddressFlow();
  const [searchParams] = useSearchParams();

  const isAdding = isUpdating || isCreating;

  const matchingCartItems = cartItems.filter((item) => {
    return item.product_retailer_id === product._id;
  });
  


  const totalQuantity = matchingCartItems.reduce((sum, item) => sum + item.quantity, 0);

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

    if (!selectedOutlet) {
      toast.error("Please select an outlet first.");
      return;
    }

    const cartCurrency = currency === '₹' ? 'INR' : currency;

    // Build existing items payload
    let finalOrderId = orderId;
    let finalExistingItems = cartItems.map(c => ({
      itemId: c.product_retailer_id,
      quantity: c.quantity,
      variationId: c.variationId || "",
      addOnDetails: c.addons || [],
      currency: cartCurrency
    }));

    const urlPreBookingId = searchParams.get('preBookingId');
    const urlPreOrderDate = searchParams.get('preOrderDate');
    const urlPreOrderTime = searchParams.get('preOrderTime');

    if (urlPreBookingId) {
      const isDifferentPreBooking = storePreBookingId !== urlPreBookingId || storePreOrderDate !== urlPreOrderDate || storePreOrderTime !== urlPreOrderTime;
      if (cartItems.length > 0 && (!storePreBookingId || isDifferentPreBooking)) {
        clearCart();
        finalOrderId = null;
        finalExistingItems = [];
      }
    }

    const matchingIndex = finalExistingItems.findIndex(i => 
      i.itemId === product._id && (i.variationId === "" || !i.variationId)
    );

    if (matchingIndex !== -1) {
      finalExistingItems[matchingIndex].quantity += 1;
    } else {
      finalExistingItems.push({
        itemId: product._id,
        quantity: 1,
        variationId: "",
        addOnDetails: [],
        currency: cartCurrency
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

      console.log("=== CART UPDATE: ProductCard handleQuickAdd ===");
      console.log("addressPayload:", addressPayload);
      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      optimisticSetQuantity(product, 1);

      if (finalOrderId) {
        updateCart(payload, {
          onSuccess: () => {
            toast.success("Product added to cart.");
            if (urlPreBookingId) openDrawer();
          }
        });
      } else {
        createCart(payload, {
          onSuccess: () => {
            toast.success("Product added to cart.");
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
        itemid: (lastItem._id && !lastItem._id.startsWith('temp-')) ? lastItem._id : lastItem.product_retailer_id,
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

      const currentOrderType = orderType || 'Door Delivery';

      const proceedWithUpdate = () => {
        const addressPayload = getCartAddressPayload();

        const payload: any = {
          items: updatedItems.map(c => ({
            itemId: c.product_retailer_id,
            quantity: c.quantity,
            variationId: c.variationId || "",
            addOnDetails: c.addons || [],
            currency: cartCurrency
          })),
          deliveryType: currentOrderType,
          orderType: currentOrderType,
          customerName: user?.name || 'Guest',
          customerPhoneNo: user?.phone || '0000000000',
          instruction: '',
          outletId: selectedOutlet._id,
          ...addressPayload,
        };
        if (orderId) payload.orderId = orderId;
        
        console.log("=== CART UPDATE: ProductCard handleDecrement ===");
        console.log("addressPayload:", addressPayload);
        console.log("Final Payload:", JSON.stringify(payload, null, 2));

        optimisticSetQuantity(product, newQty);
        if (orderId) {
          updateCart(payload, {
            onSuccess: () => {
              toast.success("Cart updated.");
            }
          });
        } else {
          createCart(payload, {
            onSuccess: () => {
              toast.success("Cart updated.");
            }
          });
        }
      };

      if (currentOrderType === 'Door Delivery') {
        handleAddressAndProceed(proceedWithUpdate);
      } else {
        proceedWithUpdate();
      }
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

    const currentOrderType = orderType || 'Door Delivery';

    const proceedWithUpdate = () => {
      const addressPayload = getCartAddressPayload();

      const payload: any = {
        items: updatedItems.map(c => ({
          itemId: c.product_retailer_id,
          quantity: c.quantity,
          variationId: c.variationId || "",
          addOnDetails: c.addons || [],
          currency: cartCurrency
        })),
        deliveryType: currentOrderType,
        orderType: currentOrderType,
        customerName: user?.name || 'Guest',
        customerPhoneNo: user?.phone || '0000000000',
        instruction: '',
        outletId: selectedOutlet._id,
        ...addressPayload,
      };
      if (orderId) payload.orderId = orderId;
      
      console.log("=== CART UPDATE: ProductCard handleIncrement ===");
      console.log("addressPayload:", addressPayload);
      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      optimisticSetQuantity(product, newQty);
      if (orderId) {
        updateCart(payload, {
          onSuccess: () => {
            toast.success("Cart updated.");
          }
        });
      } else {
        createCart(payload, {
          onSuccess: () => {
            toast.success("Cart updated.");
          }
        });
      }
    };

    if (currentOrderType === 'Door Delivery') {
      handleAddressAndProceed(proceedWithUpdate);
    } else {
      proceedWithUpdate();
    }
  };

  return (
    <div
      className={cn(
        "group relative bg-card shadow hover:shadow-lg hover:-translate-y-1 border border-border hover:border-primary overflow-hidden transition-all duration-200 cursor-pointer",
        layout === 'vertical' 
          ? "flex flex-col w-full h-full rounded-2xl" 
          : "flex flex-row w-full h-[130px] sm:h-[150px] rounded-xl items-center",
        className,
      )}
      onClick={() => _onClick && _onClick(product)}
    >
      {/* 1. Large Product Image */}
      <div className={cn(
        "relative shrink-0 bg-muted overflow-hidden",
        layout === 'vertical' 
          ? "w-full aspect-[4/3] rounded-t-2xl" 
          : "w-[130px] sm:w-[150px] h-full rounded-l-xl"
      )}>
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground gap-2">
            <ImageOff className="w-8 h-8 opacity-20" />
            <span className="text-xs font-medium opacity-50">No Image</span>
          </div>
        ) : (
          <img
            src={product.imageUrl?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105",
              !imageLoaded ? "opacity-0" : "opacity-100"
            )}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImageError(true); setImageLoaded(true); }}
          />
        )}

        {/* Top Gradient for text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent h-12 pointer-events-none" />

        {/* Discount Badge (Top Left) */}
        {discountDisplay && (
          <div className="absolute top-0 left-0 z-10 bg-[#FF6B00] text-white text-[12px] font-bold px-3.5 py-1.5 rounded-br-[12px] shadow-sm flex items-center tracking-wide">
            {discountDisplay}
          </div>
        )}
        
        {/* Bestseller Badge (Top Right) */}
        {(product.bestseller || (product.tag && product.tag.includes('Bestseller'))) && (
           <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-yellow-900 text-[10px] uppercase font-black px-2 py-1 rounded-md shadow-sm flex items-center">
             Bestseller
           </div>
        )}

        {/* Veg/Non-Veg Indicator (Bottom Left of Image) */}
        <div className="absolute bottom-3 left-3 z-10 bg-white p-1 rounded shadow-sm flex items-center justify-center">
          <div
            className={cn(
              "flex items-center justify-center w-3 h-3 border rounded-[2px]",
              isVeg ? "border-green-600" : "border-red-600"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
          </div>
        </div>
      </div>

      {/* 2. Product Information & Actions */}
      <div className={cn(
        "flex flex-col flex-1 h-full",
        layout === 'vertical' ? "p-4" : "p-3 sm:p-4 justify-between"
      )}>
        
        {/* Title */}
        <h3 className={cn(
          "font-extrabold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-1.5",
          layout === 'vertical' ? "text-[16px]" : "text-[15px] sm:text-[17px]"
        )}>
          {product.name}
        </h3>
        
        {/* Rating & Secondary Info */}
        <div className="flex items-center gap-2 mb-2">
          {product.rating && (
            <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[12px] font-bold text-foreground">
              <Star className="w-3.5 h-3.5 fill-[#F4B400] text-[#F4B400]" />
              {product.rating}
            </div>
          )}
          {descText && (
            <span className="text-muted-foreground text-[12px] font-medium line-clamp-1 flex-1">
              {descText}
            </span>
          )}
        </div>

        <div className="flex-1" />

        {/* Bottom Row: Price & Add to Cart */}
        <div className={cn(
          "flex items-center justify-between mt-auto pt-2",
          layout === 'vertical' ? "" : ""
        )}>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-extrabold text-foreground leading-none">
                {currency}{sellingPrice.toLocaleString()}
              </span>
              {originalPrice > sellingPrice && (
                <span className="text-[13px] font-semibold text-muted-foreground line-through leading-none">
                  {currency}{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="w-[100px] sm:w-[110px] h-[36px] sm:h-[40px] shrink-0 ml-2">
            <AddToCartButton
              quantity={totalQuantity}
              onAdd={handleQuickAdd}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              isLoading={isAdding || isRemoving}
              disabled={!product.active}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
