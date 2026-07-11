import React from "react";
import { cn } from "@/lib/utils";
import { Star, Plus, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganizationStore } from "@/store/OrganizationStore";
import { useWishlist } from "@/hooks/useWishlist";
import type { CategoryItem } from "@/types/category.types";

interface ProductCardProps {
 product: CategoryItem;
 className?: string;
 onClick?: (product: CategoryItem) => void;
}

export const ProductCard = React.memo(
 ({ product, className, onClick }: ProductCardProps) => {
 const currency = useOrganizationStore(
 (state) => state.organization?.currency || "₹",
 );
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
 const calculatedPercent = Math.round(
 ((originalPrice - sellingPrice) / originalPrice) * 100,
 );
 if (calculatedPercent > 0) {
 discountDisplay = `${calculatedPercent}% OFF`;
 }
 }

 const isVeg =
 product.dietryType?.toLowerCase() === "veg" ||
 product.dietryType?.toLowerCase() === "vegan";
 const rating = product.rating || 4.5;
 const isBestseller = product.bestseller || false;

 return (
 <div
 className={cn(
 "group relative flex flex-row bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[24px] border border-border/60 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer w-full p-4 gap-4 md:gap-5",
 className,
 )}
 onClick={() => onClick?.(product)}
 >
 {/* Left Side: Content */}
 <div className="flex flex-col flex-1 min-w-0 justify-center">
 
 {/* Top Indicators: Veg/NonVeg, Bestseller, Tag */}
 <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
 {product.dietryType && (
 <div
 className={cn(
 "flex items-center justify-center w-4 h-4 rounded-[4px] border shrink-0",
 isVeg ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50"
 )}
 >
 <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")} />
 </div>
 )}
 
 {isBestseller && (
 <span className="text-[9px] uppercase tracking-wider font-extrabold text-orange-600 bg-orange-100 dark:bg-orange-950/40 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
 <Star className="h-2.5 w-2.5 fill-current" /> Bestseller
 </span>
 )}

 {product.tag && product.tag.length > 0 && (
 <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0 line-clamp-1">
 {Array.isArray(product.tag) 
 ? product.tag.map((t: any) => t?.name || t).join(', ') 
 : (product.tag as any)?.name || product.tag}
 </span>
 )}
 </div>

 {/* Title */}
 <h3 className="font-extrabold text-base md:text-lg text-foreground line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors pr-2">
 {product.name}
 </h3>

 {/* Pricing */}
 <div className="flex items-center gap-2 mb-2">
 <span className="text-sm md:text-base font-black text-foreground leading-none tracking-tight">
 {currency}{sellingPrice.toLocaleString()}
 </span>
 {originalPrice > sellingPrice && (
 <span className="text-xs font-semibold text-muted-foreground line-through decoration-muted-foreground/50">
 {currency}{originalPrice.toLocaleString()}
 </span>
 )}
 </div>

 {/* Rating & Time */}
 <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
 <div className="flex items-center gap-0.5 bg-green-600/10 text-green-700 dark:text-green-500 px-1.5 py-0.5 rounded-md">
 <Star className="w-3 h-3 fill-current" />
 <span className="font-bold">{rating}</span>
 </div>
 <span>•</span>
 <div className="flex items-center gap-1">
 <Clock className="w-3 h-3 opacity-70" /> 
 <span>25-30 min</span>
 </div>
 </div>

 {/* Description */}
 {product.description && (
 <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
 {product.description}
 </p>
 )}

 {/* Customization Flag */}
 {(product.allowVariation || product.allowAddon) && (
 <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-auto flex items-center gap-1 opacity-70">
 <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Customizable
 </div>
 )}
 </div>

 {/* Right Side: Image & Actions */}
 <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] shrink-0 self-center md:self-start flex flex-col items-center">
 
 <div className="w-full h-full rounded-2xl overflow-hidden bg-muted relative shadow-sm border border-border/50">
 <img
 src={product.imageUrl?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80"}
 alt={product.name}
 className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
 
 {/* Discount Overlay */}
 {discountDisplay && (
 <div className="absolute bottom-0 left-0 right-0 text-center pb-5 pt-3 bg-gradient-to-t from-black/80 to-transparent">
 <span className="text-white text-[10px] font-black tracking-wider uppercase drop-shadow-md">
 {discountDisplay}
 </span>
 </div>
 )}
 </div>

 {/* Absolute Wishlist Button */}
 <button
 className={cn(
 "absolute -top-2 -right-2 h-7 w-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 z-10 shadow-sm border",
 inWishlist
 ? "bg-red-50 text-red-500 border-red-200 dark:bg-red-500/10 dark:border-red-500/20"
 : "bg-white dark:bg-slate-800 text-muted-foreground hover:text-primary hover:scale-110 border-border"
 )}
 onClick={(e) => {
 e.stopPropagation();
 toggleWishlist(product);
 }}
 >
 <Heart className={cn("h-3.5 w-3.5 transition-transform duration-300", inWishlist && "fill-current scale-110")} />
 </button>

 {/* Floating ADD Button */}
 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] z-20">
 <Button
 className="w-full rounded-xl bg-white dark:bg-slate-800 text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-slate-700 font-black border border-green-600/20 shadow-md h-9 text-xs transition-all uppercase tracking-wide hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
 disabled={!product.inStock}
 onClick={(e) => {
 e.stopPropagation();
 onClick?.(product);
 }}
 >
 {product.inStock ? (
 <span className="flex items-center gap-1">
 ADD <Plus className="h-3 w-3 stroke-[3]" />
 </span>
 ) : (
 <span className="text-muted-foreground">OUT</span>
 )}
 </Button>
 </div>
 </div>
 </div>
 );
 },
);
