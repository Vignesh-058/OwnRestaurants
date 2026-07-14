import { useState } from 'react';
import { ShoppingBag, Trash2, Heart, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from './QuantitySelector';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/cart.types';
import { useWishlist } from '@/hooks/useWishlist';

const MAX_INSTRUCTION_LENGTH = 250;

interface CartItemProps {
  item: CartItemType;
  currency: string;
  onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
  onRemove: (item: CartItemType) => void;
  isUpdating: boolean;
}

export const CartItem = ({ item, currency, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) => {
  const { wishlistItems, addToWishlist } = useWishlist();

  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [instruction, setInstruction] = useState('');

  const inWishlist = wishlistItems.some(w => w._id === item.product_retailer_id);

  const handleMoveToWishlist = () => {
    if (!inWishlist) {
      addToWishlist({ _id: item.product_retailer_id } as any);
    }
    onRemove(item);
  };

  const sellingPrice = item.item_price || 0;
  const originalPrice = sellingPrice;
  const discountDisplay = '';

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-[20px] border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden",
      item.stockStatus !== 'In Stock' ? 'opacity-70' : ''
    )}>
      {/* Main card content */}
      <div className="flex flex-col sm:flex-row gap-5 p-5">
        {/* Product Image */}
        <div className="w-[120px] h-[120px] bg-[#F8F9FA] rounded-[16px] overflow-hidden flex-shrink-0 relative border border-[#F3F4F6]">
          <div className="w-full h-full flex items-center justify-center bg-[#F8F9FA]">
            <ShoppingBag className="w-8 h-8 text-[#D1D5DB]" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-[20px] leading-tight text-[#111827] line-clamp-1">{item.name}</h3>
                </div>

                {/* Variant / Addons */}
                {item.variationId && (
                  <p className="text-[14px] font-medium text-[#6B7280] mb-1">Variation</p>
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

      {/* ── Cooking Instructions Accordion ── */}
      <div className="border-t border-[#F3F4F6]">
        {/* Accordion trigger */}
        <button
          type="button"
          onClick={() => setIsInstructionOpen(prev => !prev)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA] transition-colors duration-150 group"
        >
          <div className="flex items-center gap-2 text-[#6B7280] group-hover:text-[#FF6B00] transition-colors duration-150">
            <UtensilsCrossed className="w-4 h-4 shrink-0" />
            <span className="text-[13px] font-semibold">
              Cooking Instructions
              <span className="ml-1.5 text-[12px] font-normal opacity-70">(Optional)</span>
            </span>
            {instruction && (
              <span className="ml-1 w-2 h-2 rounded-full bg-[#FF6B00] shrink-0" title="Instruction added" />
            )}
          </div>
          <span className="text-[#94A3B8] group-hover:text-[#FF6B00] transition-colors duration-150">
            {isInstructionOpen
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />
            }
          </span>
        </button>

        {/* Animated panel */}
        <AnimatePresence initial={false}>
          {isInstructionOpen && (
            <motion.div
              key="instruction-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1">
                <div className="relative">
                  <textarea
                    value={instruction}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_INSTRUCTION_LENGTH) {
                        setInstruction(e.target.value);
                      }
                    }}
                    placeholder="Example: Less spicy, No onion, Extra crispy, Separate packing..."
                    rows={3}
                    maxLength={MAX_INSTRUCTION_LENGTH}
                    className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-[12px] px-4 py-3 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] resize-none focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 transition-all duration-200"
                  />
                  {/* Character count */}
                  <span className={cn(
                    "absolute bottom-3 right-3 text-[11px] font-medium tabular-nums pointer-events-none",
                    instruction.length >= MAX_INSTRUCTION_LENGTH
                      ? "text-[#EF4444]"
                      : instruction.length > MAX_INSTRUCTION_LENGTH * 0.8
                        ? "text-[#F59E0B]"
                        : "text-[#9CA3AF]"
                  )}>
                    {instruction.length}/{MAX_INSTRUCTION_LENGTH}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
