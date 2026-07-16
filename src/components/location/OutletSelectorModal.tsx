import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Navigation, CheckCircle2, Store, Bike, ShoppingBag, Utensils } from 'lucide-react';
import { useOutletModalStore } from '@/store/OutletModalStore';
import { useOutletStore } from '@/store/OutletStore';
import { useRequestBrowserLocation } from '@/hooks/queries/useLocation';
import { cn } from '@/lib/utils';
import type { Outlet } from '@/types/organization.types';

export const OutletSelectorModal = () => {
  const { isOpen, closeModal } = useOutletModalStore();

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
          className="bg-background w-full md:w-[90%] lg:max-w-[900px] xl:max-w-[1000px] h-[95vh] md:h-auto max-h-[85vh] rounded-t-[24px] md:rounded-[24px] overflow-hidden shadow-2xl z-10 flex flex-col relative"
        >
          {/* Fixed Header */}
          <div className="px-6 py-5 flex items-center justify-between shrink-0 bg-card border-b border-border sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex flex-col justify-center">
                <h2 className="text-[22px] font-black text-foreground tracking-tight leading-tight">
                  Select Restaurant
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1 leading-tight">
                  Choose an outlet near your location
                </p>
              </div>
            </div>
            <button 
              onClick={closeModal}
              className="h-10 w-10 bg-muted hover:bg-muted/80 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-muted/30">
            {outlets && outlets.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        "w-full text-left p-4 rounded-2xl transition-all flex flex-col relative overflow-hidden group cursor-pointer border bg-card h-[170px]",
                        isSelected 
                          ? "border-primary shadow-md ring-1 ring-primary/20 bg-primary/5 scale-[1.01]" 
                          : "border-border/60 hover:border-primary/40 hover:shadow-lg",
                        !outlet.storeStatus && "opacity-75 grayscale"
                      )}
                    >
                      {/* Top Right Distance Badge */}
                      <div className="absolute top-4 right-4 font-bold text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg flex items-center gap-1.5 z-10">
                        <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                        {distanceStr}
                      </div>

                      {/* Header Section */}
                      <div className="flex items-start gap-4 mb-3 pr-20">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                        )}>
                          <Store className="w-6 h-6" />
                        </div>
                        
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[17px] font-bold text-foreground leading-tight truncate">
                              {outlet.outletName}
                            </h3>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            )}
                          </div>
                          <span className={cn(
                            "font-bold text-[11px] tracking-widest px-2.5 py-0.5 rounded-lg uppercase w-fit mt-1.5",
                            outlet.storeStatus ? "text-green-600 bg-green-500/10" : "text-destructive bg-destructive/10"
                          )}>
                            {outlet.storeStatus ? 'Open' : 'Closed'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Address Section */}
                      <p className="text-[13px] text-muted-foreground font-medium leading-snug line-clamp-2">
                        {outlet.outletDetails?.address || outlet.outletDetails?.city || "Address not provided"}
                      </p>
                      
                      {/* Footer Section - Anchored to bottom */}
                      <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border/50 justify-between">
                        {/* ETA */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{outlet.eta || '30-45 mins'}</span>
                        </div>
                        
                        {/* Service Chips */}
                        {outlet.orderType && outlet.orderType.length > 0 && (
                          <div className="flex items-center gap-2 overflow-hidden flex-nowrap shrink-0">
                            {outlet.orderType.slice(0, 2).map((type, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-muted/80 px-2.5 py-1 rounded-lg shrink-0">
                                {getDeliveryIcon(type)}
                                <span className="text-[11px] font-bold text-muted-foreground capitalize truncate">
                                  {type.replace('_', ' ')}
                                </span>
                              </div>
                            ))}
                            {outlet.orderType.length > 2 && (
                              <span className="text-[11px] font-bold text-muted-foreground bg-muted/80 px-2 py-1 rounded-lg shrink-0">
                                +{outlet.orderType.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center px-4">
                <Store className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-black text-foreground mb-2">No Restaurants Found</h3>
                <p className="text-sm text-muted-foreground font-medium mb-6">
                  We couldn't find any outlets delivering to your current location.
                </p>
                <button 
                  onClick={handleRetryLocation}
                  className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                  Change Location
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
