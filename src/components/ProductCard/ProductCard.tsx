import React from 'react';
import { cn } from '@/lib/utils';
import { Star, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useWishlist } from '@/hooks/useWishlist';
import type { CategoryItem } from '@/types/category.types';

interface ProductCardProps {
 product: CategoryItem;
 className?: string;
 onClick?: (product: CategoryItem) => void;
}

export const ProductCard = React.memo(({ product, className, onClick }: ProductCardProps) => {
 const currency = useOrganizationStore((state) => state.organization?.currency || '₹');
 const { isInWishlist, toggleWishlist } = useWishlist();
 
 const inWishlist = isInWishlist(product._id);

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
 className={cn(
 "group relative flex flex-col bg-white/78 dark:bg-slate-900/78 backdrop-blur-[22px] rounded-[24px] border border-border/80 dark:border-white/10 shadow-[0_8px_32px_rgba(31,38,135,0.03)] overflow-hidden hover:shadow-[0_12px_40px_rgba(31,38,135,0.08)] hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer",
 className
 )}
 onClick={() => onClick?.(product)}
 >
 {/* Image Container */}
 <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-950">
 <img 
 src={product.imageUrl?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} 
 alt={product.name}
 className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
 loading="lazy"
 />
 
 {/* Gradient Overlay for text readability */}
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

 {/* Top Badges */}
 <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
 {discountDisplay && (
 <div className="bg-primary-gradient text-white text-xs font-extrabold px-3 py-1 rounded-xl shadow-md">
 {discountDisplay}
 </div>
 )}
 {product.trackInventory && product.stockCount && product.stockCount < 10 && product.inStock && (
 <div className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm uppercase tracking-wider">
 Only {product.stockCount} Left!
 </div>
 )}
 </div>

 {/* Favorite Icon */}
 <button 
 className={cn(
 "absolute top-4 right-4 h-8.5 w-8.5 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 shadow-sm",
 inWishlist 
 ? "bg-red-500/10 text-red-500 border border-red-500/20" 
 : "bg-white/90 dark:bg-slate-900/90 text-muted-foreground hover:text-primary hover:bg-white border border-border/80 dark:border-white/5"
 )}
 onClick={(e) => {
 e.stopPropagation();
 toggleWishlist(product);
 }}
 aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
 >
 <Heart className={cn("h-4 w-4 transition-transform duration-300", inWishlist && "fill-current scale-110")} />
 </button>

 {/* Quick View on Hover */}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
 <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full tracking-wide">
 Quick View
 </span>
 </div>
 </div>

 {/* Content */}
 <div className="flex flex-col flex-1 p-5">
 {/* Veg / Non-Veg Icon & Rating */}
 <div className="flex items-center justify-between mb-2">
 <div className="flex items-center gap-2">
 {product.dietryType && (
 <div className={cn(
 "flex items-center justify-center w-4 h-4 rounded-[4px] border",
 isVeg ? "border-green-600" : "border-red-600"
 )}>
 <div className={cn(
 "w-1.5 h-1.5 rounded-full",
 isVeg ? "bg-green-600" : "bg-red-600"
 )} />
 </div>
 )}
 {product.tag && product.tag.length > 0 && (
 <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
 {Array.isArray(product.tag) 
 ? product.tag.map((t: any) => t?.name || t).join(', ') 
 : (product.tag as any)?.name || product.tag}
 </span>
 )}
 </div>
 
 <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/40 text-foreground px-2 py-0.5 rounded-md text-[10px] font-bold">
 <Star className="w-3 h-3 text-amber-400 fill-current" />
 4.5
 </div>
 </div>

 {/* Title & Description */}
 <h3 className="font-extrabold text-base text-foreground line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors">
 {product.name}
 </h3>
 <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-snug flex-1">
 {product.description || 'Deliciously prepared with the finest ingredients.'}
 </p>

 {/* Customization Note */}
 {(product.allowVariation || product.allowAddon) && (
 <div className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1">
 <span className="w-1 h-1 rounded-full bg-primary" /> Customizable
 </div>
 )}

 {/* Price & Action */}
 <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/60 dark:border-white/5">
 <div className="flex flex-col">
 <div className="flex items-center gap-2">
 <span className="text-lg font-black text-foreground">
 {currency}{sellingPrice.toLocaleString()}
 </span>
 {originalPrice > sellingPrice && (
 <span className="text-xs text-muted-foreground line-through">
 {currency}{originalPrice.toLocaleString()}
 </span>
 )}
 </div>
 </div>

 <Button 
 className="rounded-full bg-primary-gradient hover:opacity-95 text-white font-extrabold px-5 py-2 h-9 text-xs shadow-sm transition-all duration-300"
 disabled={!product.inStock}
 onClick={(e) => {
 e.stopPropagation();
 onClick?.(product);
 }}
 >
 {product.inStock ? (
 <span className="flex items-center gap-0.5">
 ADD <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
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
