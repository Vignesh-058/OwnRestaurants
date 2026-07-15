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
      className="bg-white border-b border-[#E5E7EB] shadow-sm sticky top-[72px] z-30 hidden md:block"
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 lg:px-12 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm md:text-base">
          
          {/* Address */}
          <div className="flex items-center gap-2 text-[#475569] flex-1 min-w-[200px]">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Delivering To</span>
              <span className="font-medium text-[#111827] truncate max-w-[200px] md:max-w-[300px]" title={displayAddress}>
                {displayAddress}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-1">
            {/* Delivery Time */}
            <div className="flex items-center gap-2 text-[#475569]">
              <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Estimated Time</span>
                <span className="font-medium text-[#111827]">{deliveryTime}</span>
              </div>
            </div>

            {/* Delivery Type */}
            <div className="flex items-center gap-2 text-[#475569]">
              <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                {type === 'Self Pickup' ? <Navigation className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Order Type</span>
                <span className="font-medium text-[#111827]">{type}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-[#475569]">
              <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                <Star className="w-4 h-4 fill-[#F59E0B]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Store Rating</span>
                <div className="flex items-center gap-1 font-medium text-[#111827]">
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
