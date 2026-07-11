import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { QuantitySelector } from './QuantitySelector';
import { cn } from '@/lib/utils';

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
 <div className="border-t border-[#E5E7EB] dark:border-white/10 bg-white p-4 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
 {!inStock && (
 <div className="bg-red-50 text-red-600 dark:bg-red-900/20 text-sm font-bold py-3 px-4 rounded-2xl text-center border border-red-100 dark:border-red-900/50">
 Currently Out of Stock
 </div>
 )}
 
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
 {/* Quantity Control */}
 <QuantitySelector 
 quantity={quantity} 
 onQuantityChange={onQuantityChange} 
 disabled={!inStock} 
 />

 {/* Add to Cart Button */}
 <Button 
 className={cn(
 "flex-1 h-14 w-full rounded-full text-lg font-bold shadow-xl transition-all duration-300",
 isValid && inStock
 ? "bg-[#0C6CEA] hover:bg-[#0055CC] text-white hover:shadow-2xl hover:-translate-y-1" 
 : "bg-[#E5E7EB] text-[#6B7280] dark:bg-slate-800"
 )}
 disabled={!isValid || !inStock || isLoading}
 onClick={onAddToCart}
 >
 {isLoading ? (
 <Loader2 className="w-6 h-6 animate-spin" />
 ) : (
 <div className="flex items-center justify-center gap-3">
 <span>Add item</span>
 <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
 <span>{currency}{totalPrice.toLocaleString()}</span>
 </div>
 )}
 </Button>
 </div>
 </div>
 );
};
