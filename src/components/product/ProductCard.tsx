import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/CartStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { CategoryItem } from '@/types/category.types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateCart } from '@/hooks/cart/useUpdateCart';
import { useCreateCart } from '@/hooks/cart/useCreateCart';
import { useDeleteCart } from '@/hooks/cart/useDeleteCart';
import { useAuthStore } from '@/store/AuthStore';
import { useOutletStore } from '@/store/OutletStore';
import { getCartAddressPayload } from '@/utils/cartPayload';
import { useAddressFlow } from '@/hooks/cart/useAddressFlow';

interface ProductCardProps {
  product: CategoryItem;
  className?: string;
  onClick?: (product: CategoryItem) => void;
}

export const ProductCard = React.memo(({ product, className, onClick: _onClick }: ProductCardProps) => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems) || [];
  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');
  
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCart();
  const { mutate: createCart, isPending: isCreating } = useCreateCart();
  const { mutate: removeItem, isPending: isRemoving } = useDeleteCart();
  const { orderId, orderType, optimisticSetQuantity } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const { handleAddressAndProceed } = useAddressFlow();

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
    const existingItems = cartItems.map(c => ({
      itemId: c.product_retailer_id,
      quantity: c.quantity,
      variationId: c.variationId || "",
      addOnDetails: c.addons || [],
      currency: cartCurrency
    }));

    const matchingIndex = existingItems.findIndex(i => 
      i.itemId === product._id && (i.variationId === "" || !i.variationId)
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

    const currentOrderType = orderType || 'Door Delivery';

    const proceedWithAdd = () => {
      const addressPayload = getCartAddressPayload();

      const payload: any = {
        items: existingItems,
        deliveryType: currentOrderType,
        orderType: currentOrderType,
        customerName: user?.name || 'Guest',
        customerPhoneNo: user?.phone || '0000000000',
        instruction: '',
        outletId: selectedOutlet._id,
        ...addressPayload,
      };
      if (orderId) payload.orderId = orderId;

      console.log("=== CART UPDATE: ProductCard handleQuickAdd ===");
      console.log("addressPayload:", addressPayload);
      console.log("Final Payload:", JSON.stringify(payload, null, 2));

      optimisticSetQuantity(product, 1);

      if (orderId) {
        updateCart(payload, {
          onSuccess: () => {
            toast.success("Product added to cart.");
          }
        });
      } else {
        createCart(payload, {
          onSuccess: () => {
            toast.success("Product added to cart.");
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
        itemid: lastItem._id || lastItem.product_retailer_id,
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
        "group relative flex flex-col w-full h-full min-h-[280px] sm:min-h-[300px] lg:min-h-[340px] premium-card overflow-hidden cursor-default",
        className,
      )}
    >
      {/* 1. Large Product Image (Responsive Height) */}
      <div className="relative w-full h-[150px] sm:h-[170px] lg:h-[200px] shrink-0 bg-muted overflow-hidden">
        <img
          src={product.imageUrl?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Left: Veg/Non-Veg Badge */}
        {product.dietryType && (
          <div className="absolute top-3 left-3 z-10 flex items-center justify-center w-7 h-7 rounded-md bg-card/90 backdrop-blur-md shadow-sm border border-border">
            <div
              className={cn(
                "flex items-center justify-center w-3.5 h-3.5 border-[1.5px] rounded-[3px]",
                isVeg ? "border-green-600" : "border-red-600"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-xl", isVeg ? "bg-green-600" : "bg-red-600")} />
            </div>
          </div>
        )}

        {/* Top Right: Discount & Bestseller */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">

          {discountDisplay && (
            <div className="bg-primary text-primary-foreground text-[11px] font-extrabold px-2.5 py-1.5 rounded-md shadow-sm flex items-center gap-1 tracking-wide">
              {discountDisplay}
            </div>
          )}
        </div>
      </div>

      {/* 2. Product Information & Actions */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 lg:p-5">
        {/* Title */}
        <h3 className="font-extrabold text-[17px] text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-[13px] font-bold text-muted-foreground">{product.rating}</span>
          </div>
        )}
        
        {/* Description */}
        {descText && (
          <p className="text-muted-foreground font-medium text-[13px] line-clamp-2 mt-2 leading-relaxed">
            {descText}
          </p>
        )}

        <div className="flex-1" />

        {/* Price & Add Button Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          {/* Price Column */}
          <div className="flex flex-col">
            <span className="text-[18px] font-extrabold text-foreground leading-none tracking-tight">
              {currency}{sellingPrice.toLocaleString()}
            </span>
            {originalPrice > sellingPrice && (
              <span className="text-[13px] font-medium text-muted-foreground line-through leading-none mt-1.5">
                {currency}{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add Button / Quantity Selector */}
          <div className="relative h-[38px] lg:h-[42px] w-[105px] lg:w-[115px] shrink-0" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              {totalQuantity > 0 ? (
                <motion.div
                  key="quantity"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-between bg-card rounded-full p-1 border border-primary shadow-sm"
                >
                  <button
                    onClick={handleDecrement}
                    disabled={isAdding || isRemoving}
                    className="w-[30px] h-[30px] lg:w-[34px] lg:h-[34px] flex items-center justify-center rounded-full bg-accent text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4 stroke-[3]" />
                  </button>
                  <span className="text-[14px] lg:text-[15px] font-extrabold text-primary select-none flex-1 text-center">
                    {totalQuantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={isAdding || isRemoving}
                    className="w-[30px] h-[30px] lg:w-[34px] lg:h-[34px] flex items-center justify-center rounded-full bg-accent text-primary transition-colors duration-200 hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Button
                    className="w-full h-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[14px] shadow-sm hover:shadow-md transition-all duration-300 border-0"
                    onClick={handleQuickAdd}
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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
});

ProductCard.displayName = 'ProductCard';
