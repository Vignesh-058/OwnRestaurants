import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Navigation, CheckCircle2, Store, Bike, ShoppingBag, Utensils } from 'lucide-react';
import { useOutletModalStore } from '@/store/OutletModalStore';
import { useOutletStore } from '@/store/OutletStore';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { useRequestBrowserLocation } from '@/hooks/queries/useLocation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Outlet } from '@/types/organization.types';

export const OutletSelectorModal = () => {
  const { isOpen, closeModal } = useOutletModalStore();
  const openLocationModal = useLocationModalStore((state) => state.openModal);
  
  const outlets = useOutletStore((state) => state.outlets);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const setSelectedOutlet = useOutletStore((state) => state.setSelectedOutlet);

  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    closeModal();
  };

  const requestBrowserLocation = useRequestBrowserLocation();

  const handleRetryLocation = () => {
    closeModal();
    requestBrowserLocation();
  };

  if (!isOpen) return null;

  // Helper for delivery icons
  const getDeliveryIcon = (type: string) => {
    if (type.toLowerCase().includes('door')) return <Bike className="w-3.5 h-3.5" />;
    if (type.toLowerCase().includes('pickup')) return <ShoppingBag className="w-3.5 h-3.5" />;
    return <Utensils className="w-3.5 h-3.5" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        />

        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full md:w-[90%] lg:max-w-[900px] xl:max-w-[1000px] h-[95vh] md:h-auto max-h-[85vh] rounded-t-[24px] md:rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-10 flex flex-col relative"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between shrink-0 bg-white sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex flex-col justify-center">
                <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight leading-tight">
                  Select Restaurant
                </h2>
                <p className="text-[14px] text-[#64748B] font-medium mt-0.5 leading-tight">
                  Choose an outlet near your location
                </p>
              </div>
            </div>
            <button 
              onClick={closeModal}
              className="h-10 w-10 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-full flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 bg-[#F8FAFC]">
            {outlets && outlets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outlets.map((outlet) => {
                  const isSelected = selectedOutlet?._id === outlet._id;
                  const distanceStr = outlet.distance ? `${outlet.distance.toFixed(1)} km` : 'Near you';
                  
                  return (
                    <motion.button 
                      key={outlet._id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOutlet(outlet)}
                      className={cn(
                        "w-full text-left p-4 sm:p-5 rounded-[20px] transition-all flex gap-4 relative overflow-hidden group cursor-pointer border bg-white",
                        isSelected 
                          ? "bg-[#FFF7ED] border-[#FF6B00] shadow-[0_8px_24px_rgba(255,107,0,0.12)] scale-[1.01]" 
                          : "border-[#E2E8F0] hover:border-[#FF6B00]/40 hover:shadow-lg",
                        !outlet.storeStatus && "opacity-75 grayscale"
                      )}
                    >
                      {/* Checkmark Top Right */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-[#FF6B00] rounded-full flex items-center justify-center shadow-sm w-6 h-6">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      {/* Store Icon */}
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                        isSelected ? "bg-[#FF6B00]/10" : "bg-[#F1F5F9] group-hover:bg-[#FF6B00]/5 transition-colors"
                      )}>
                        <Store className={cn("w-6 h-6", isSelected ? "text-[#FF6B00]" : "text-[#64748B] group-hover:text-[#FF6B00]")} />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0 pr-6">
                        {/* Row 1: Name & Status / Distance */}
                        <div className="flex justify-between items-start mb-1 gap-2">
                           <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                              <h3 className="text-[18px] sm:text-[22px] font-bold text-[#0F172A] leading-tight truncate">
                                {outlet.outletName}
                              </h3>
                              <span className={cn(
                                "font-bold text-[10px] tracking-widest px-2 py-0.5 rounded-full uppercase shrink-0",
                                outlet.storeStatus ? "text-[#10B981] bg-[#10B981]/10" : "text-[#EF4444] bg-[#EF4444]/10"
                              )}>
                                {outlet.storeStatus ? 'Open' : 'Closed'}
                              </span>
                           </div>
                           
                           {/* Distance Badge */}
                           <span className="font-bold text-[12px] text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                             <Navigation className="w-3.5 h-3.5 text-[#64748B]" />
                             {distanceStr}
                           </span>
                        </div>
                        
                        {/* Row 2: Address */}
                        <p className="text-[14px] text-[#64748B] font-medium leading-snug line-clamp-2 mb-4">
                          {outlet.outletDetails?.address || outlet.outletDetails?.city || "Address not provided"}
                        </p>
                        
                        {/* Row 3: ETA & Delivery Types */}
                        <div className="flex items-center gap-2 flex-wrap mt-auto">
                          {/* ETA Badge */}
                          <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{outlet.eta || '30-45 mins'}</span>
                          </div>
                          
                          {/* Order Types */}
                          {outlet.orderType && outlet.orderType.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 ml-auto sm:ml-0 sm:border-l sm:border-[#E2E8F0] sm:pl-2">
                              {outlet.orderType.map(type => (
                                <span key={type} className="flex items-center gap-1.5 text-[12px] font-bold tracking-tight px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569]">
                                  {getDeliveryIcon(type)}
                                  {type}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-[24px] border border-[#E2E8F0] flex flex-col items-center shadow-sm">
                <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-5">
                  <MapPin className="w-10 h-10 text-[#94A3B8]" />
                </div>
                <h4 className="text-[18px] font-bold text-[#0F172A] mb-2 text-center">No nearby outlets found</h4>
                <p className="text-[14px] text-[#64748B] font-medium mb-8 leading-relaxed text-center max-w-sm mx-auto">
                  Try changing your location or selecting an address manually to see available restaurants.
                </p>
                <Button 
                  onClick={handleRetryLocation}
                  className="h-12 px-8 rounded-xl bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold shadow-[0_4px_16px_rgba(255,107,0,0.3)] transition-all"
                >
                  Retry Location
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
