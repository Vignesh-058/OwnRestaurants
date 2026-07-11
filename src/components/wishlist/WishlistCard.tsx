import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrganizationStore } from '@/store/OrganizationStore';
import type { CategoryItem } from '@/types/category.types';

interface WishlistCardProps {
 product: CategoryItem;
 onRemove: (id: string) => void;
 onClick?: (product: CategoryItem) => void;
}

export const WishlistCard = React.memo(({ product, onRemove, onClick }: WishlistCardProps) => {
 const currency = useOrganizationStore((state) => state.organization?.currency || '₹');

 const hasDiscount = product.discount && product.discount.value;
 
 let discountDisplay = null;
 let originalPrice = product.basePrice;
 let sellingPrice = product.sellingPrice;

 if (hasDiscount && product.discount) {
 if (product.discount.value.getDiscountPercent > 0) {
 discountDisplay = `${product.discount.value.getDiscountPercent}% OFF`;
 } else if (product.discount.value.amount > 0) {
 discountDisplay = `${currency}${product.discount.value.amount} OFF`;
 }
 }

 if (!discountDisplay && originalPrice > sellingPrice) {
 const calculatedPercent = Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
 if (calculatedPercent > 0) {
 discountDisplay = `${calculatedPercent}% OFF`;
 }
 }

 const isVeg = product.dietryType?.toLowerCase() === 'veg' || product.dietryType?.toLowerCase() === 'vegan';

 return (
 <div 
 className="group relative flex flex-col bg-[#FFFFFF] rounded-[24px] border border-[#E5E7EB] dark:border-white/10 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer"
 onClick={() => onClick?.(product)}
 >
 {/* Image Container */}
 <div className="relative aspect-[4/3] overflow-hidden bg-background dark:bg-slate-900">
 <img 
 src={product.imageUrl?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} 
 alt={product.name}
 className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
 loading="lazy"
 />
 
 {/* Top Badges */}
 <div className="absolute top-4 left-4 flex flex-col gap-2">
 {discountDisplay && (
 <div className="bg-[#0C6CEA] text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
 {discountDisplay}
 </div>
 )}
 </div>

 {/* Remove Button */}
 <button 
 className="absolute top-4 right-4 h-8 w-8 rounded-full bg-red-50 text-red-500 backdrop-blur-md flex items-center justify-center hover:bg-red-500 hover:text-white shadow-sm transition-all duration-300"
 onClick={(e) => {
 e.stopPropagation();
 onRemove(product._id);
 }}
 aria-label="Remove from wishlist"
 >
 <Trash2 className="h-4 w-4" />
 </button>
 </div>

 {/* Content */}
 <div className="flex flex-col flex-1 p-5">
 <div className="flex items-center justify-between mb-2">
 {product.dietryType && (
 <div className={cn(
 "flex items-center justify-center w-4 h-4 rounded-[4px] border",
 isVeg ? "border-[#16A34A]" : "border-red-600"
 )}>
 <div className={cn(
 "w-2 h-2 rounded-full",
 isVeg ? "bg-[#16A34A]" : "bg-red-600"
 )} />
 </div>
 )}
 <div className="flex items-center gap-1 bg-[#16A34A] text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
 <Star className="w-3 h-3 fill-white" />
 4.5
 </div>
 </div>

 <h3 className="font-bold text-lg text-[#111827] dark:text-white line-clamp-1 leading-tight mb-1 group-hover:text-[#0C6CEA] transition-colors">
 {product.name}
 </h3>
 <p className="text-sm text-[#6B7280] line-clamp-1 mb-4">
 {product.category || 'Category'}
 </p>

 <div className="mt-auto flex items-center justify-between pt-2">
 <div className="flex flex-col">
 <div className="flex items-center gap-2">
 <span className="text-xl font-bold text-[#111827] dark:text-white">
 {currency}{sellingPrice.toLocaleString()}
 </span>
 {originalPrice > sellingPrice && (
 <span className="text-sm text-[#6B7280] line-through">
 {currency}{originalPrice.toLocaleString()}
 </span>
 )}
 </div>
 </div>

 <Button 
 className="rounded-full bg-[#0C6CEA]/10 hover:bg-[#0C6CEA] text-[#0C6CEA] hover:text-white font-bold px-6 py-2 h-10 shadow-none transition-all duration-300"
 disabled={!product.inStock}
 onClick={(e) => {
 e.stopPropagation();
 onClick?.(product);
 }}
 >
 {product.inStock ? (
 <span className="flex items-center gap-2">
 ADD <ShoppingCart className="h-4 w-4 hidden sm:block" />
 </span>
 ) : (
 'OUT'
 )}
 </Button>
 </div>
 </div>
 </div>
 );
});

WishlistCard.displayName = 'WishlistCard';

// Dummy icon for import that might be missing above
import { ShoppingCart } from 'lucide-react';
