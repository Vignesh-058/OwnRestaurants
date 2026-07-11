import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useSettings } from '@/hooks/queries/useSettings';
import { useStoreStatus } from '@/hooks/queries/useStoreStatus';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Store } from 'lucide-react';
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const StoreConfig = () => {
 const organization = useOrganizationStore((state) => state.organization);
 const { outlets, selectedOutlet, setSelectedOutlet, deliveryMode, setDeliveryMode } = useOutletStore();
 
 const belongsTo = organization?._id || '';
 const outletId = selectedOutlet?._id || '';

 const { data: settings } = useSettings(belongsTo, outletId);
 const { data: storeStatus } = useStoreStatus(belongsTo, outletId);

 // Derive available modes
 const isDeliveryEnabled = storeStatus?.deliveryAvailable && settings?.checkOutSettings?.delivery;
 const isPickupEnabled = storeStatus?.pickupAvailable && settings?.checkOutSettings?.pickup;

 // Auto-set delivery mode if not set and options exist
 if (!deliveryMode && isDeliveryEnabled) {
 setDeliveryMode('delivery');
 } else if (!deliveryMode && isPickupEnabled && !isDeliveryEnabled) {
 setDeliveryMode('pickup');
 }

 return (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.2 }}
 className="w-full max-w-7xl mx-auto px-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
 >
 
 {/* Delivery Mode Selector - Premium Segmented Control */}
 <div className="flex bg-muted/60 p-1.5 rounded-full w-full sm:w-[320px] shadow-inner relative border">
 <div 
 className="absolute inset-y-1.5 w-[calc(50%-0.375rem)] bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all duration-300 ease-spring"
 style={{ 
 left: deliveryMode === 'delivery' ? '0.375rem' : 'calc(50% + 0.1875rem)',
 }}
 />
 
 <Button
 variant="ghost"
 disabled={!isDeliveryEnabled}
 className={cn(
 "flex-1 rounded-full px-6 flex items-center justify-center gap-2 transition-colors relative z-10 hover:bg-transparent",
 deliveryMode === 'delivery' ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
 )}
 onClick={() => setDeliveryMode('delivery')}
 >
 <Navigation className="h-4 w-4" />
 Delivery
 </Button>
 <Button
 variant="ghost"
 disabled={!isPickupEnabled}
 className={cn(
 "flex-1 rounded-full px-6 flex items-center justify-center gap-2 transition-colors relative z-10 hover:bg-transparent",
 deliveryMode === 'pickup' ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
 )}
 onClick={() => setDeliveryMode('pickup')}
 >
 <MapPin className="h-4 w-4" />
 Pickup
 </Button>
 </div>

 {/* Outlet Selector (Only if multiple outlets) */}
 {outlets.length > 1 && (
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="outline" className={cn("rounded-full flex items-center gap-2 w-full sm:w-auto", !selectedOutlet && "border-primary text-primary bg-primary/5 hover:bg-primary/10")}>
 <Store className="h-4 w-4 text-primary" />
 <span className="truncate max-w-[200px]">
 {selectedOutlet ? selectedOutlet.outletName : 'Select Store Location'}
 </span>
 </Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-[240px] rounded-2xl">
 {outlets.map((outlet) => (
 <DropdownMenuItem
 key={outlet._id}
 onClick={() => setSelectedOutlet(outlet)}
 className={cn(
 "cursor-pointer rounded-xl my-1",
 selectedOutlet?._id === outlet._id && "bg-primary/10 text-primary font-medium"
 )}
 disabled={!outlet.isActive}
 >
 {outlet.outletName}
 </DropdownMenuItem>
 ))}
 </DropdownMenuContent>
 </DropdownMenu>
 )}

 </motion.div>
 );
};
