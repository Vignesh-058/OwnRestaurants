import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Store, Navigation, Shield, X } from 'lucide-react';
import { useLocationStore } from '@/store/LocationStore';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLocationModalStore } from '@/store/LocationModalStore';

export const LocationPermissionModal = () => {
  const permissionGranted = useLocationStore((state) => state.permissionGranted);
  const setPermissionStatus = useLocationStore((state) => state.setPermissionStatus);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  const setLocation = useLocationStore((state) => state.setLocation);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openLocationModal = useLocationModalStore((state) => state.openModal);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    if (isAuthenticated && permissionGranted === null) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, permissionGranted]);

  const handleAllowLocation = () => {
    setIsLoading(true);

    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by your browser');
      setPermissionStatus(false);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    console.log('[DEBUG] Requesting Browser Geolocation...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[DEBUG] Location Permission Granted');
        console.log(`[DEBUG] Current Coordinates: Lat ${position.coords.latitude}, Lng ${position.coords.longitude}`);
        clearLocation();
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          locationLoaded: false,
        });
        setIsOpen(false);
        setIsLoading(false);
      },
      (error) => {
        console.error('[DEBUG] Geolocation error:', error);
        console.log('[DEBUG] Location Permission Denied/Failed');
        toast.error(
          error.code === 1 ? 'Location permission denied by browser.' :
          error.code === 2 ? 'Location information is unavailable.' :
          'Location request timed out.'
        );
        setPermissionStatus(false);
        setIsLoading(false);
        setIsDenied(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSkip = () => {
    setPermissionStatus(false);
    setLocation({ locationLoaded: true });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[450px] bg-slate-900 border border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-[24px] overflow-hidden p-8 sm:p-10 flex flex-col items-center"
          >
            <button 
              onClick={handleSkip}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 h-8 w-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight mb-3">Enable Location</h2>
              <p className="text-[14.5px] text-slate-400 font-medium leading-relaxed">
                Allow location access to discover nearby restaurants and provide accurate delivery estimates.
              </p>
            </div>

            <div className="w-full space-y-5 mb-10 text-left">
              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 transition-transform">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Store className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-0.5">Find nearby outlets</h4>
                  <p className="text-[13px] text-slate-400 font-medium">See exactly what's available in your area.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 transition-transform">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Navigation className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-0.5">Accurate delivery</h4>
                  <p className="text-[13px] text-slate-400 font-medium">Get precise delivery times and tracking.</p>
                </div>
              </motion.div>
              
              <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4 transition-transform">
                <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Shield className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-0.5">Privacy assured</h4>
                  <p className="text-[13px] text-slate-400 font-medium">We only use this to improve your experience.</p>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {isDenied ? (
                <>
                  <p className="text-sm text-red-400 text-center font-medium mb-2">Enable location to continue or select an address.</p>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleAllowLocation}
                      disabled={isLoading}
                      className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white text-[16px] font-bold shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] disabled:opacity-50 transition-all relative overflow-hidden"
                    >
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Retry Location Access'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        openLocationModal();
                      }}
                      disabled={isLoading}
                      className="w-full h-[56px] rounded-2xl border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white text-slate-300 font-bold text-[15px] transition-all"
                    >
                      Enter Address Manually
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={handleAllowLocation}
                      disabled={isLoading}
                      className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white text-[16px] font-bold shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] disabled:opacity-50 transition-all relative overflow-hidden"
                    >
                      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Allow Location Access'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline"
                      onClick={handleSkip}
                      disabled={isLoading}
                      className="w-full h-[56px] rounded-2xl border-slate-700 bg-transparent hover:bg-slate-800 hover:text-white text-slate-300 font-bold text-[15px] transition-all"
                    >
                      Not Now
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
