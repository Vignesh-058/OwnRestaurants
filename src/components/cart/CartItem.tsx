import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from './QuantitySelector';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/cart.types';
import { useWishlist } from '@/hooks/useWishlist';

interface CartItemProps {
  item: CartItemType;
  currency: string;
  onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
  onRemove: (item: CartItemType) => void;
  isUpdating: boolean;
}

export const CartItem = ({ item, currency, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) => {
  const isVeg = item.itemid.dietryType?.toLowerCase() === 'veg' || item.itemid.dietryType?.toLowerCase() === 'vegan';
  const isNonVeg = item.itemid.dietryType?.toLowerCase() === 'non-veg';
  const { wishlistItems, addToWishlist } = useWishlist();
  
  const inWishlist = wishlistItems.some(w => w._id === item.itemid._id);

  const handleMoveToWishlist = () => {
    if (!inWishlist) {
      addToWishlist(item.itemid);
    }
    onRemove(item);
  };

  const sellingPrice = item.unitPrice || 0;
  const originalPrice = item.basePrice || sellingPrice;
  let discountDisplay = '';
  if (originalPrice > sellingPrice && originalPrice > 0) {
    const discountPercent = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
    discountDisplay = `${discountPercent}% OFF`;
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-5 bg-white p-5 rounded-[20px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all relative",
      item.stockStatus !== 'In Stock' ? 'opacity-70' : ''
    )}>
      {/* Product Image */}
      <div className="w-[120px] h-[120px] bg-[#F8F9FA] rounded-[16px] overflow-hidden flex-shrink-0 relative border border-[#F3F4F6]">
        {item.itemid.image?.[0] ? (
          <img src={item.itemid.image[0]} alt={item.itemid.itemname} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
            <ShoppingBag className="w-8 h-8 text-[#D1D5DB]" />
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {/* Veg/Non-Veg Badge */}
                {item.itemid.dietryType && (
                  <div className={cn(
                    "flex items-center justify-center w-4 h-4 border-[1.5px] rounded-[3px] shrink-0",
                    isVeg ? "border-green-600" : isNonVeg ? "border-red-600" : "border-yellow-500"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isVeg ? "bg-green-600" : isNonVeg ? "bg-red-600" : "bg-yellow-500"
                    )} />
                  </div>
                )}
                <h3 className="font-bold text-[20px] leading-tight text-[#111827] line-clamp-1">{item.itemid.itemname}</h3>
              </div>
              
              {/* Variant / Addons */}
              {item.variation_id && (
                <p className="text-[14px] font-medium text-[#6B7280] mb-1">{item.variation_id.name}</p>
              )}
              {item.addons && item.addons.length > 0 && (
                <p className="text-[12px] font-medium text-[#FF6B00] bg-[#FFF7ED] inline-block px-2 py-0.5 rounded-[6px] mb-2">
                  + {item.addons.length} Add-ons Included
                </p>
              )}

              {/* Stock Status */}
              <div className="mt-1">
                {item.stockStatus === 'In Stock' ? (
                  <span className="text-[#10B981] text-[12px] font-bold tracking-wide uppercase">In Stock</span>
                ) : (
                  <span className="text-[#EF4444] text-[12px] font-bold tracking-wide uppercase">{item.stockStatus || 'Out of Stock'}</span>
                )}
              </div>
            </div>

            {/* Price Column */}
            <div className="flex flex-col items-end">
              <span className="font-bold text-[24px] text-[#111827] whitespace-nowrap leading-none mb-1">
                {currency}{sellingPrice.toLocaleString()}
              </span>
              {originalPrice > sellingPrice && (
                <span className="text-[14px] font-medium text-[#9CA3AF] line-through leading-none mb-1.5">
                  {currency}{originalPrice.toLocaleString()}
                </span>
              )}
              {discountDisplay && (
                <span className="bg-[#10B981] text-white text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-[4px] shadow-sm">
                  {discountDisplay}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#F3F4F6]">
          <QuantitySelector 
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item, item.quantity - 1)}
            disabled={isUpdating || item.stockStatus !== 'In Stock'}
          />

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="h-9 px-4 text-[#6B7280] border-[#E5E7EB] hover:text-[#111827] hover:border-[#111827] rounded-full text-[13px] font-semibold transition-colors"
              onClick={handleMoveToWishlist}
              disabled={isUpdating}
            >
              <Heart className={cn("w-4 h-4 mr-2", inWishlist && "fill-[#FF6B00] text-[#FF6B00]")} />
              Move to Wishlist
            </Button>
            <Button 
              variant="ghost" 
              className="h-9 px-4 text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#DC2626] rounded-full text-[13px] font-semibold transition-colors"
              onClick={() => onRemove(item)}
              disabled={isUpdating}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
