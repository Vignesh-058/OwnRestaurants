import { useState } from 'react';
import { ShoppingBag, Trash2, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantitySelector } from './QuantitySelector';
import { CartConfirmModal } from './CartConfirmModal';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/cart.types';

const MAX_INSTRUCTION_LENGTH = 250;

interface CartItemProps {
  item: CartItemType;
  currency: string;
  onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
  onRemove: (item: CartItemType) => void;
  isUpdating: boolean;
}

type ModalType = 'remove' | null;

export const CartItem = ({
  item,
  currency,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemProps) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [instruction, setInstruction] = useState((item as any).instruction || '');
  
  const sellingPrice = item.item_price || 0;
  const itemTotal = sellingPrice * item.quantity;
  const isInStock = item.stockStatus !== 'Out of Stock';

  const handleConfirmRemove = () => {
    setIsModalLoading(true);
    try { onRemove(item); setActiveModal(null); }
    finally { setIsModalLoading(false); }
  };


  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, scale: 0.97 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={cn(
          'bg-card rounded-[18px] border border-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden',
          !isInStock && 'opacity-60',
        )}
      >
        {/* ── Main Row ── */}
        <div className="flex gap-3 p-4">

          {/* Product Image — 90×90 */}
          <div className="relative shrink-0 w-[90px] h-[90px] rounded-xl overflow-hidden bg-muted border border-border">
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground/30" />
            </div>
            {/* Veg/Non-veg indicator */}
            <span className={cn(
              'absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded-sm border-[1.5px] flex items-center justify-center bg-card/80 backdrop-blur-sm',
              isInStock ? 'border-green-600' : 'border-red-600',
            )}>
              <span className={cn('w-1.5 h-1.5 rounded-full', isInStock ? 'bg-green-600' : 'bg-red-600')} />
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">

            {/* Top: name + remove button */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-extrabold text-[16px] text-foreground leading-tight line-clamp-2 mb-0.5">
                  {item.name}
                </h3>
                {item.variationId && (
                  <p className="text-[13px] text-muted-foreground font-medium mb-1 line-clamp-1">Variation selected</p>
                )}
                {item.addons && item.addons.length > 0 && (
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-[4px] inline-block mb-1">
                    +{item.addons.length} add-on{item.addons.length > 1 ? 's' : ''}
                  </span>
                )}
                {!isInStock && (
                  <p className="text-[11px] font-bold text-destructive uppercase tracking-wide mt-0.5">Out of Stock</p>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                aria-label="Remove item"
                onClick={() => setActiveModal('remove')}
                disabled={isUpdating}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-destructive/10 transition-colors group disabled:opacity-40 shrink-0 -mt-1 -mr-1"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </button>
            </div>

            {/* Bottom: quantity + price */}
            <div className="flex items-center justify-between mt-2">
              <QuantitySelector
                quantity={item.quantity}
                onIncrease={() => onUpdateQuantity(item, item.quantity + 1)}
                onDecrease={() => onUpdateQuantity(item, item.quantity - 1)}
                disabled={isUpdating || !isInStock}
                size="sm"
              />

              <div className="text-right">
                <p className="text-[18px] font-extrabold text-primary leading-none tabular-nums">
                  {currency}{itemTotal.toLocaleString()}
                </p>
                {item.quantity > 1 && (
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">
                    {currency}{sellingPrice.toLocaleString()} each
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Cooking Instructions Accordion ── */}
        <div className="border-t border-border">
          <button
            type="button"
            onClick={() => setIsInstructionOpen(p => !p)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors group"
            aria-expanded={isInstructionOpen}
          >
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
              <UtensilsCrossed className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[12px] font-semibold">
                Cooking Instructions
                <span className="ml-1 font-normal opacity-70">(Optional)</span>
              </span>
              {instruction && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
            </div>
            <span className="text-muted-foreground/50 group-hover:text-primary transition-colors">
              {isInstructionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isInstructionOpen && (
              <motion.div
                key="instr"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-0.5">
                  <div className="relative">
                    <textarea
                      value={instruction}
                      onChange={e => {
                        if (e.target.value.length <= MAX_INSTRUCTION_LENGTH) setInstruction(e.target.value);
                      }}
                      placeholder="E.g. Less spicy, No onion, Extra crispy, Separate packing..."
                      rows={2}
                      maxLength={MAX_INSTRUCTION_LENGTH}
                      className="w-full bg-background border border-border rounded-[12px] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                    <span className={cn(
                      'absolute bottom-3 right-4 text-[11px] font-medium tabular-nums pointer-events-none',
                      instruction.length >= MAX_INSTRUCTION_LENGTH ? 'text-destructive'
                        : instruction.length > MAX_INSTRUCTION_LENGTH * 0.8 ? 'text-yellow-500'
                          : 'text-muted-foreground/50',
                    )}>
                      {instruction.length}/{MAX_INSTRUCTION_LENGTH}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modals */}
      <CartConfirmModal
        isOpen={activeModal === 'remove'}
        onClose={() => !isModalLoading && setActiveModal(null)}
        onConfirm={handleConfirmRemove}
        variant="remove"
        itemName={item.name}
        isLoading={isModalLoading}
      />

    </>
  );
};
