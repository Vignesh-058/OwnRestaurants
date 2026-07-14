import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Navigation, CheckCircle2, Store } from 'lucide-react';
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
    console.log('[SELECTED OUTLET]', outlet);
    setSelectedOutlet(outlet);
    closeModal();
  };

  const requestBrowserLocation = useRequestBrowserLocation();

  const handleRetryLocation = () => {
    closeModal();
    requestBrowserLocation();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-slate-900 border border-white/10 w-full sm:max-w-[520px] rounded-t-[24px] sm:rounded-[24px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh] relative"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                  Select Restaurant
                </h2>
                <p className="text-[14px] text-slate-400 font-medium mt-1 leading-tight">
                  Choose an outlet near your location
                </p>
              </div>
            </div>
            <button 
              onClick={closeModal}
              className="h-10 w-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {outlets && outlets.length > 0 ? (
              <div className="space-y-4">
                {outlets.map((outlet) => {
                  const isSelected = selectedOutlet?._id === outlet._id;
                  const distanceStr = outlet.distance ? `${outlet.distance.toFixed(1)} km` : 'Near you';
                  
                  return (
                    <motion.button 
                      key={outlet._id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOutlet(outlet)}
                      className={cn(
                        "w-full text-left p-5 rounded-[18px] transition-all flex items-start gap-4 group relative overflow-hidden",
                        isSelected 
                          ? "bg-[#FF6B00]/10 border border-[#FF6B00] shadow-md" 
                          : "bg-slate-800/80 border border-white/10 hover:border-white/20 hover:shadow-lg hover:bg-slate-800/90",
                        !outlet.isActive && "opacity-75 grayscale"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-[#FF6B00]">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      
                      <div className={cn(
                        "mt-0.5 p-3 rounded-full transition-colors shrink-0",
                        isSelected ? "bg-[#FF6B00]/20 text-[#FF6B00]" : "bg-slate-800 text-slate-400 group-hover:text-white"
                      )}>
                        <Store className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={cn(
                            "font-bold text-[11px] tracking-widest px-2.5 py-0.5 rounded-full uppercase border",
                            outlet.isActive 
                              ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" 
                              : "text-red-400 bg-red-400/10 border-red-400/20"
                          )}>
                            {outlet.isActive ? 'Open' : 'Closed'}
                          </span>
                          
                          <span className="font-bold text-[11px] tracking-widest text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full uppercase border border-white/5 flex items-center gap-1">
                            <Navigation className="w-3 h-3" />
                            {distanceStr}
                          </span>
                        </div>
                        
                        <span className="font-semibold text-[18px] text-white block mb-1.5 leading-tight">
                          {outlet.outletName}
                        </span>
                        
                        <span className="text-[14px] font-medium text-slate-400 leading-relaxed line-clamp-2 mb-3">
                          {outlet.outletDetails?.address || outlet.outletDetails?.city}
                        </span>
                        
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#FF6B00] pt-2 border-t border-white/10">
                          <Clock className="w-4 h-4" />
                          <span>ETA: {outlet.eta || '30-45 mins'}</span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-slate-800/30 rounded-[18px] border border-white/10 flex flex-col items-center shadow-inner">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-slate-500" />
                </div>
                <h4 className="text-[18px] font-bold text-white mb-2">No nearby outlets available.</h4>
                <p className="text-[14px] text-slate-400 font-medium mb-6 leading-relaxed">
                  We couldn't find any active outlets near your current address. Try changing your address to see available restaurants.
                </p>
                <Button 
                  onClick={handleRetryLocation}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E85D00] hover:from-[#E85D00] hover:to-[#CC5200] text-white font-bold shadow-md transition-all"
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
