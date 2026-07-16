import React from 'react';
import { useLocationStore } from '@/store/LocationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { MapPin, Clock, Truck, Star, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeliveryInfoBar = () => {
  const { formattedAddress, address1, city, state } = useLocationStore();
  const { storeStatus, deliveryMode } = useOutletStore();
  const organization = useOrganizationStore((state: any) => state.organization);

  const displayAddress = formattedAddress || (address1 ? `${address1}, ${city}, ${state}` : 'Select Delivery Location');
  const deliveryTime = storeStatus?.deliveryExpectedTime || '30-45 mins';
  const type = deliveryMode === 'pickup' ? 'Self Pickup' : 'Door Delivery';
  const rating = organization?.rating || '4.5';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border-b border-border shadow-sm sticky top-[72px] z-30 hidden md:block backdrop-blur-md bg-background/90"
    >
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-12 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm md:text-base">
          
          {/* Address */}
          <div className="flex items-center gap-3 text-muted-foreground flex-1 min-w-[200px]">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Delivering To</span>
              <span className="font-extrabold text-foreground truncate max-w-[200px] md:max-w-[300px]" title={displayAddress}>
                {displayAddress}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-1">
            {/* Delivery Time */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center text-success">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Estimated Time</span>
                <span className="font-extrabold text-foreground">{deliveryTime}</span>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-full bg-info/10 flex items-center justify-center text-info">
                {type === 'Self Pickup' ? <Navigation className="w-4.5 h-4.5" /> : <Truck className="w-4.5 h-4.5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Order Type</span>
                <span className="font-extrabold text-foreground">{type}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                <Star className="w-4.5 h-4.5 fill-warning" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">Store Rating</span>
                <div className="flex items-center gap-1 font-extrabold text-foreground">
                  {rating}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
};
