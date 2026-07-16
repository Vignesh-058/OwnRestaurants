import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuantitySelectorProps {
 quantity: number;
 onQuantityChange: (q: number | ((prev: number) => number)) => void;
 disabled?: boolean;
}

export const QuantitySelector = ({ quantity, onQuantityChange, disabled }: QuantitySelectorProps) => {
 return (
 <div className="flex items-center bg-accent dark:bg-slate-800 rounded-2xl p-1 shadow-inner h-14">
 <Button 
 variant="ghost" 
 size="icon" 
 className="h-12 w-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:bg-white/90 text-muted-foreground hover:text-info transition-colors"
 onClick={() => onQuantityChange(q => Math.max(1, q - 1))}
 disabled={quantity <= 1 || disabled}
 >
 <Minus className="w-5 h-5" />
 </Button>
 <span className="w-14 text-center font-black text-xl text-foreground dark:text-white">{quantity}</span>
 <Button 
 variant="ghost" 
 size="icon" 
 className="h-12 w-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:bg-white/90 text-muted-foreground hover:text-info transition-colors"
 onClick={() => onQuantityChange(q => q + 1)}
 disabled={disabled}
 >
 <Plus className="w-5 h-5" />
 </Button>
 </div>
 );
};
