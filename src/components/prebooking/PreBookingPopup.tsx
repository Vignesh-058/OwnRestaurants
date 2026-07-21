import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useSettingsStore } from '@/store/SettingsStore';
import { useActivePreBooking } from '@/hooks/queries/usePreBooking';
import { X, Calendar, Clock, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PreBookingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const settings = useSettingsStore((state) => state.settings);

  const { data: activePreBookingRes, isLoading } = useActivePreBooking(
    { belongsTo: org?._id || '', outletId: selectedOutlet?._id || '' },
    !!settings?.preBookingEnabled
  );

  const campaigns = activePreBookingRes?.data || [];
  const activeCampaign = campaigns.length > 0 ? campaigns[0] : null;

  useEffect(() => {
    if (!isLoading && activeCampaign && settings?.preBookingEnabled) {
      const hasShown = sessionStorage.getItem('preBookingPopupShown');
      if (!hasShown) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('preBookingPopupShown', 'true');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, activeCampaign, settings?.preBookingEnabled]);

  if (!isOpen || !activeCampaign) return null;

  const handleExplore = () => {
    setIsOpen(false);
    // Give time for modal close animation before scrolling
    setTimeout(() => {
      document.getElementById('prebooking-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[500px] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[201]"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero Banner */}
            <div className="relative w-full h-[240px]">
              <img 
                src={activeCampaign.image || '/placeholder-food.jpg'} 
                alt={activeCampaign.preBookingName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                LIMITED TIME
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-white text-2xl font-bold leading-tight mb-1">
                  {activeCampaign.preBookingName}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Special Pre-Order
                </h2>
                <p className="text-muted-foreground text-sm">
                  Reserve your favourite dishes before they're gone.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Available for limited dates</h4>
                    <p className="text-xs text-muted-foreground">Exclusive pre-booking menu</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Freshly prepared on schedule</h4>
                    <p className="text-xs text-muted-foreground">Pickup or dine exactly when you want</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={handleExplore} 
                  className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  Explore Pre-Order
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
