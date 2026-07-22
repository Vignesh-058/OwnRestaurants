import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useActivePreBooking } from '@/hooks/queries/usePreBooking';
import { X, Calendar, Clock, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PreBookingPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);

  // Enable for all outlets whenever org and selectedOutlet are available
  const { data: activePreBookingRes, isLoading } = useActivePreBooking(
    { belongsTo: org?._id || '', outletId: selectedOutlet?._id || '' },
    !!(org?._id && selectedOutlet?._id)
  );

  const campaigns = activePreBookingRes?.data || [];
  const activeCampaign = campaigns.length > 0 ? campaigns[0] : null;

  useEffect(() => {
    if (!isLoading && activeCampaign) {
      const hasShown = sessionStorage.getItem('preBookingPopupShown');
      if (!hasShown) {
        // Trigger popup 60 seconds (1 minute) after user lands on application
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('preBookingPopupShown', 'true');
        }, 60000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, activeCampaign, selectedOutlet?._id]);

  if (!isOpen || !activeCampaign) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('preBookingPopupShown', 'true');
  };

  const handleExplore = () => {
    handleClose();
    // Scroll smoothly to pre-booking section if on home page or navigate
    const el = document.getElementById('prebooking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/?explorePreOrder=true#prebooking-section');
    }
  };

  const campaignTitle = activeCampaign.preBookingName || (activeCampaign as any).name || (activeCampaign as any).title || 'Special Pre-Order Campaign';
  const campaignImage = activeCampaign.image || (activeCampaign as any).imageUrl || '/placeholder-food.jpg';
  const campaignDescription = (activeCampaign as any).description || (activeCampaign as any).shortDescription || 'Reserve your favourite dishes in advance before they sell out!';

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
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[480px] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[201] border border-border/50"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero Banner */}
            <div className="relative w-full h-[220px] bg-muted">
              <img 
                src={campaignImage} 
                alt={campaignTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                LIMITED TIME PRE-ORDER
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-5">
                <h3 className="text-white text-2xl font-black leading-tight drop-shadow-sm">
                  {campaignTitle}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <div className="mb-5">
                <h4 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Special Campaign Details
                </h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {campaignDescription}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-muted/60 rounded-2xl border border-border/40">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">Flexible Pre-Order Dates</h5>
                    <p className="text-[11px] text-muted-foreground">Select your preferred date during booking</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-muted/60 rounded-2xl border border-border/40">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs">Freshly Prepared on Schedule</h5>
                    <p className="text-[11px] text-muted-foreground">Door delivery or self pickup on time</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <Button 
                  onClick={handleExplore} 
                  className="w-full h-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Explore Now
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleClose}
                  className="w-full h-10 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
