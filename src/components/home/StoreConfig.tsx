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

  if (!isDeliveryEnabled && !isPickupEnabled) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full flex flex-col items-center justify-center pt-6 pb-2"
    >
      {/* Delivery Mode Selector - Premium Segmented Control */}
      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full w-full max-w-[340px] shadow-sm relative border border-black/5 dark:border-white/5 h-[48px]">
        {isDeliveryEnabled && isPickupEnabled ? (
          <>
            <div 
              className="absolute inset-y-1 w-[calc(50%-0.25rem)] bg-primary rounded-full shadow-md transition-all duration-300 ease-out"
              style={{ 
                left: deliveryMode === 'delivery' ? '0.25rem' : 'calc(50% + 0.25rem)',
              }}
            />
            
            <button
              disabled={!isDeliveryEnabled}
              className={cn(
                "flex-1 rounded-full px-4 flex items-center justify-center transition-colors relative z-10 text-[14px] font-bold tracking-wide",
                deliveryMode === 'delivery' ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
              onClick={() => setDeliveryMode('delivery')}
            >
              Door Delivery
            </button>
            <button
              disabled={!isPickupEnabled}
              className={cn(
                "flex-1 rounded-full px-4 flex items-center justify-center transition-colors relative z-10 text-[14px] font-bold tracking-wide",
                deliveryMode === 'pickup' ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
              onClick={() => setDeliveryMode('pickup')}
            >
              Self Pickup
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[14px] font-bold tracking-wide text-white bg-primary rounded-full shadow-md">
            {isDeliveryEnabled ? 'Door Delivery' : 'Self Pickup'}
          </div>
        )}
      </div>

      {/* Outlet Selector (Only if multiple outlets) */}
      {outlets.length > 1 && (
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn("rounded-full flex items-center gap-2", !selectedOutlet && "border-primary text-primary bg-primary/5 hover:bg-primary/10")}>
                <Store className="h-4 w-4 text-primary" />
                <span className="truncate max-w-[200px]">
                  {selectedOutlet ? selectedOutlet.outletName : 'Select Store Location'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[240px] rounded-2xl">
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
        </div>
      )}
    </motion.div>
  );
};
