import { useOutletStore } from '@/store/OutletStore';
import { Store, MapPin, Navigation, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StoreAnnouncement = () => {
 const storeStatus = useOutletStore((state) => state.storeStatus);
 const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

 if (!storeStatus || !selectedOutlet) return null;

 return (
 <div className={cn(
 "w-full py-2 px-4 text-sm font-medium flex items-center justify-center transition-colors",
 storeStatus.storeOpen ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
 )}>
 <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center">
 <div className="flex items-center gap-1.5">
 <Store className="h-4 w-4" />
 <span>{storeStatus.storeOpen ? 'Store Open' : 'Store Currently Closed'}</span>
 </div>
 
 {storeStatus.storeOpen && (
 <div className="hidden sm:flex items-center gap-6 opacity-80 text-xs">
 {storeStatus.deliveryAvailable && (
 <span className="flex items-center gap-1">
 <Navigation className="h-3 w-3" /> Delivery Available
 </span>
 )}
 {storeStatus.pickupAvailable && (
 <span className="flex items-center gap-1">
 <MapPin className="h-3 w-3" /> Pickup Available
 </span>
 )}
 </div>
 )}

 {!storeStatus.storeOpen && (
 <div className="hidden sm:flex items-center gap-1 opacity-80 text-xs">
 <Info className="h-3 w-3" /> We are currently not accepting new orders.
 </div>
 )}
 </div>
 </div>
 );
};
