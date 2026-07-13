import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceSummaryProps {
 totalPrice: number;
 quantity: number;
 onQuantityChange: (q: number | ((prev: number) => number)) => void;
 onAddToCart: () => void;
 isValid: boolean;
 isLoading?: boolean;
 inStock: boolean;
 currency: string;
}

export const PriceSummary = ({
 totalPrice,
 quantity,
 onQuantityChange,
 onAddToCart,
 isValid,
 isLoading,
 inStock,
 currency
}: PriceSummaryProps) => {
 return (
 <div className="bg-[#F8FAFC] p-4 sm:p-5 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-[#F1F5F9] rounded-t-[24px] sm:rounded-t-[32px] relative z-20">
 {!inStock && (
 <div className="bg-red-50 text-red-600 text-[14px] font-bold py-2.5 px-4 rounded-xl text-center border border-red-100">
 Currently Out of Stock
 </div>
 )}
 
 <div className="flex items-center justify-between gap-3 sm:gap-4">
 {/* Dark Quantity Control */}
 <div className={cn(
 "flex items-center bg-[#111827] rounded-[16px] h-[56px] px-2 shrink-0 transition-opacity",
 !inStock && "opacity-50 pointer-events-none"
 )}>
 <button
 onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
 disabled={quantity <= 1 || !inStock}
 className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] disabled:opacity-50 transition-colors"
 >
 <Minus className="w-5 h-5" />
 </button>
 
 <div className="w-[32px] flex items-center justify-center overflow-hidden">
 <AnimatePresence mode="popLayout">
 <motion.span
 key={quantity}
 initial={{ y: -20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 20, opacity: 0 }}
 transition={{ type: "spring", stiffness: 300, damping: 25 }}
 className="text-[18px] font-black text-white"
 >
 {quantity}
 </motion.span>
 </AnimatePresence>
 </div>

 <button
 onClick={() => onQuantityChange(quantity + 1)}
 disabled={!inStock}
 className="w-[40px] h-[40px] flex items-center justify-center rounded-[12px] text-[#9CA3AF] hover:text-white hover:bg-[#1F2937] disabled:opacity-50 transition-colors"
 >
 <Plus className="w-5 h-5" />
 </button>
 </div>

 {/* Add to Cart Button */}
 <Button 
 className={cn(
 "flex-1 h-[56px] w-full rounded-[16px] text-[16px] font-bold shadow-[0_8px_20px_rgba(255,107,0,0.25)] transition-all duration-300 border-0",
 isValid && inStock
 ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A33] hover:from-[#E65C00] hover:to-[#FF6B00] text-white hover:shadow-[0_12px_25px_rgba(255,107,0,0.35)] hover:-translate-y-0.5" 
 : "bg-[#E5E7EB] text-[#9CA3AF] shadow-none hover:shadow-none"
 )}
 disabled={!isValid || !inStock || isLoading}
 onClick={onAddToCart}
 >
 {isLoading ? (
 <Loader2 className="w-6 h-6 animate-spin" />
 ) : (
 <div className="flex items-center justify-center gap-2.5">
 <span>Add item</span>
 <span className="w-1 h-1 rounded-full bg-white/60" />
 <span>{currency}{totalPrice.toLocaleString()}</span>
 </div>
 )}
 </Button>
 </div>
 </div>
 );
};
