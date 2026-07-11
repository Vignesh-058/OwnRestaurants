import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { Variation } from '@/types/product.types';

interface VariationSelectorProps {
 variations?: Variation[];
 selectedVariation: string | null;
 onSelect: (variationId: string) => void;
 currency: string;
}

export const VariationSelector = ({ variations, selectedVariation, onSelect, currency }: VariationSelectorProps) => {
 if (!variations || variations.length === 0) return null;

 return (
 <div className="space-y-4">
 <h3 className="font-bold text-lg text-[#111827] dark:text-white flex justify-between items-center">
 <span>Quantity / Size</span>
 <span className="text-[10px] uppercase tracking-wider bg-[#0C6CEA]/10 text-[#0C6CEA] px-2 py-1 rounded-full font-bold">Required</span>
 </h3>
 <RadioGroup value={selectedVariation || ''} onValueChange={onSelect} className="gap-3">
 {variations.map((v) => (
 <div 
 key={v.variationid} 
 className="flex items-center justify-between p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm hover:border-[#0C6CEA] transition-colors cursor-pointer group"
 onClick={() => onSelect(v.variationid)}
 >
 <div className="flex items-center space-x-3">
 <RadioGroupItem value={v.variationid} id={v.variationid} />
 <Label htmlFor={v.variationid} className="text-base font-semibold text-[#111827] dark:text-white cursor-pointer group-hover:text-[#0C6CEA] transition-colors">
 {v.variation_name}
 </Label>
 </div>
 <span className="font-bold text-[#111827] dark:text-white">{currency}{v.price}</span>
 </div>
 ))}
 </RadioGroup>
 </div>
 );
};
