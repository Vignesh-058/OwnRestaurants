import { ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantitySelector } from './QuantitySelector';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types/cart.types';

interface CartItemProps {
 item: CartItemType;
 currency: string;
 onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
 onRemove: (item: CartItemType) => void;
 isUpdating: boolean;
}

export const CartItem = ({ item, currency, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) => {
 const isVeg = item.itemid.dietryType?.toLowerCase() === 'veg' || item.itemid.dietryType?.toLowerCase() === 'vegan';
 const isNonVeg = item.itemid.dietryType?.toLowerCase() === 'non-veg';

 return (
 <div className="flex gap-4 bg-card p-4 rounded-3xl border border-border shadow-sm items-start hover:shadow-md transition-shadow group">
 <div className="w-24 h-24 sm:w-28 sm:h-28 bg-muted rounded-2xl overflow-hidden flex-shrink-0 relative">
 {item.itemid.image?.[0] ? (
 <img src={item.itemid.image[0]} alt={item.itemid.itemname} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 ) : (
 <div className="w-full h-full flex items-center justify-center bg-secondary/50">
 <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
 </div>
 )}
 </div>
 
 <div className="flex-1 min-w-0 py-1">
 <div className="flex justify-between items-start gap-4 mb-1">
 <div className="flex items-center gap-2">
 {item.itemid.dietryType && (
 <span className={cn(
 "inline-flex items-center justify-center w-4 h-4 rounded-sm border shrink-0 bg-white",
 isVeg ? "border-green-600" : isNonVeg ? "border-red-600" : "border-yellow-500"
 )}>
 <span className={cn(
 "w-2 h-2 rounded-full",
 isVeg ? "bg-green-600" : isNonVeg ? "bg-red-600" : "bg-yellow-500"
 )} />
 </span>
 )}
 <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.itemid.itemname}</h3>
 </div>
 <span className="font-bold text-lg whitespace-nowrap">{currency}{item.totalPrice}</span>
 </div>
 
 {item.variation_id && (
 <p className="text-sm font-semibold text-muted-foreground mb-1">{item.variation_id.name}</p>
 )}
 
 {item.addons && item.addons.length > 0 && (
 <p className="text-xs font-medium text-muted-foreground line-clamp-2 mb-2 bg-secondary/50 inline-block px-2 py-1 rounded-md">
 + {item.addons.length} Addons
 </p>
 )}

 <div className="flex items-center justify-between mt-4">
 <QuantitySelector 
 quantity={item.quantity}
 onIncrease={() => onUpdateQuantity(item, item.quantity + 1)}
 onDecrease={() => onUpdateQuantity(item, item.quantity - 1)}
 disabled={isUpdating}
 />

 <Button 
 variant="ghost" 
 size="icon" 
 className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
 onClick={() => onRemove(item)}
 disabled={isUpdating}
 >
 <Trash2 className="w-4 h-4" />
 </Button>
 </div>
 </div>
 </div>
 );
};
