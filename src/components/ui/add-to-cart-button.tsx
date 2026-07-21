import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AddToCartButtonProps {
  quantity: number;
  onAdd: (e: React.MouseEvent) => void;
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AddToCartButton = React.forwardRef<HTMLDivElement, AddToCartButtonProps>(
  ({ quantity, onAdd, onIncrement, onDecrement, isLoading, disabled, className }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("relative w-full h-[48px] md:h-[52px]", className)} 
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {quantity > 0 ? (
            <motion.div
              key="quantity-selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-between bg-white rounded-[10px] border border-primary shadow-sm overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDecrement}
                disabled={isLoading || disabled}
                className="h-full aspect-square flex items-center justify-center text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 shrink-0"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
              </motion.button>
              
              <span className="text-[15px] font-bold text-primary select-none flex-1 text-center">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto text-primary" />
                ) : (
                  quantity
                )}
              </span>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onIncrement}
                disabled={isLoading || disabled}
                className="h-full aspect-square flex items-center justify-center text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 shrink-0"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="add-button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={onAdd}
              disabled={isLoading || disabled}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute inset-0 w-full h-full flex items-center justify-center gap-1.5 rounded-[10px] bg-white border border-primary text-primary font-bold text-[14px] md:text-[15px] shadow-sm hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Add</span>
                  <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AddToCartButton.displayName = 'AddToCartButton';
