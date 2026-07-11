import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface ProductInfoProps {
 name: string;
 dietryType?: string;
 rating?: number;
 inStock: boolean;
}

export const ProductInfo = ({ name, dietryType, rating, inStock }: ProductInfoProps) => {
 const isVeg = dietryType?.toLowerCase() === 'veg' || dietryType?.toLowerCase() === 'vegan';
 const isNonVeg = dietryType?.toLowerCase() === 'non-veg';

 return (
 <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
 <div>
 <div className="flex items-center gap-3 mb-2">
 {dietryType && (
 <span className={cn(
 "inline-flex items-center justify-center w-5 h-5 rounded-sm border bg-white shadow-sm",
 isVeg ? "border-green-600" : isNonVeg ? "border-red-600" : "border-yellow-500"
 )}>
 <span className={cn(
 "w-2.5 h-2.5 rounded-full",
 isVeg ? "bg-green-600" : isNonVeg ? "bg-red-600" : "bg-yellow-500"
 )} />
 </span>
 )}
 
 {rating ? (
 <span className="flex items-center gap-1 bg-[#16A34A] text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
 <Star className="w-3.5 h-3.5 fill-white" />
 {rating}
 </span>
 ) : (
 <span className="flex items-center gap-1 bg-[#16A34A] text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
 <Star className="w-3.5 h-3.5 fill-white" />
 4.8
 </span>
 )}

 {!inStock && (
 <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
 Out of Stock
 </span>
 )}
 </div>
 <h2 className="text-3xl font-black text-white leading-tight drop-shadow-md">
 {name}
 </h2>
 </div>
 </div>
 );
};
