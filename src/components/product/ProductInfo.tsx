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
 <div className="absolute bottom-0 left-0 right-0 pt-32 pb-6 px-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end z-10 pointer-events-none">
 <div className="flex items-center gap-3 mb-2.5">
 {dietryType && (
 <div className={cn(
 "flex items-center justify-center w-6 h-6 rounded-full border-[3px] bg-white shrink-0 shadow-lg",
 isVeg ? "border-green-600" : isNonVeg ? "border-red-600" : "border-yellow-500"
 )}>
 <div className={cn(
 "w-2.5 h-2.5 rounded-full",
 isVeg ? "bg-green-600" : isNonVeg ? "bg-red-600" : "bg-yellow-500"
 )} />
 </div>
 )}
 
 {rating ? (
 <div className="flex items-center gap-1.5 bg-[#16A34A] text-white px-2.5 py-1 rounded-[6px] text-[13px] font-bold shadow-lg leading-none">
 <Star className="w-3.5 h-3.5 fill-white" />
 {rating}
 </div>
 ) : (
 <div className="flex items-center gap-1.5 bg-[#16A34A] text-white px-2.5 py-1 rounded-[6px] text-[13px] font-bold shadow-lg leading-none">
 <Star className="w-3.5 h-3.5 fill-white" />
 4.8
 </div>
 )}

 {!inStock && (
 <span className="bg-red-500 text-white px-2.5 py-1 rounded-[6px] text-[13px] font-bold shadow-lg leading-none">
 Out of Stock
 </span>
 )}
 </div>
 <h2 className="text-[32px] sm:text-[40px] font-black text-white leading-tight drop-shadow-xl tracking-tight">
 {name}
 </h2>
 </div>
 );
};
