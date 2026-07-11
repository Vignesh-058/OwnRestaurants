import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Store, Shield, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/store/LocationStore';
import { useAuthStore } from '@/store/AuthStore';
import { toast } from 'sonner';

export const LocationPermissionModal = () => {
 const permissionStatus = useLocationStore((state) => state.permissionStatus);
 const setLocation = useLocationStore((state) => state.setLocation);
 const setPermissionStatus = useLocationStore((state) => state.setPermissionStatus);
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 
 const [isOpen, setIsOpen] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
 // Only show if user is logged in and hasn't answered the prompt yet
 if (isAuthenticated && permissionStatus === 'prompt') {
 // Add a small delay so it doesn't jump immediately after login
 const timer = setTimeout(() => setIsOpen(true), 1000);
 return () => clearTimeout(timer);
 }
 }, [isAuthenticated, permissionStatus]);

 const handleAllowLocation = () => {
 setIsLoading(true);

 if (!('geolocation' in navigator)) {
 toast.error('Geolocation is not supported by your browser');
 setPermissionStatus('denied');
 setIsOpen(false);
 setIsLoading(false);
 return;
 }

 navigator.geolocation.getCurrentPosition(
 (position) => {
 setLocation(position.coords.latitude, position.coords.longitude);
 toast.success('Location updated successfully!');
 setIsOpen(false);
 setIsLoading(false);
 },
 (error) => {
 console.error('Geolocation error:', error);
 toast.error(
 error.code === 1 ? 'Location permission denied by browser.' :
 error.code === 2 ? 'Location information is unavailable.' :
 'Location request timed out.'
 );
 setPermissionStatus('denied');
 setIsOpen(false);
 setIsLoading(false);
 },
 {
 enableHighAccuracy: true,
 timeout: 10000,
 maximumAge: 0
 }
 );
 };

 const handleSkip = () => {
 setPermissionStatus('denied');
 setIsOpen(false);
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 transition={{ type: "spring", damping: 25, stiffness: 300 }}
 className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-[32px] overflow-hidden"
 >
 {/* Header Illustration */}
 <div className="h-40 bg-primary/10 flex items-center justify-center relative overflow-hidden">
 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
 <motion.div 
 initial={{ y: 20, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 0.2 }}
 className="h-20 w-20 bg-background rounded-full shadow-lg flex items-center justify-center relative z-10"
 >
 <MapPin className="h-10 w-10 text-primary" />
 <div className="absolute -right-1 -top-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
 <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
 </div>
 </motion.div>
 </div>

 {/* Content */}
 <div className="p-8 flex flex-col items-center text-center">
 <h2 className="text-2xl font-bold text-foreground mb-3">Allow Location Access</h2>
 <p className="text-muted-foreground mb-6">
 To provide you with the best experience, we need your location to show available stores and accurate delivery times.
 </p>

 <div className="w-full space-y-4 mb-8 text-left">
 <div className="flex items-start gap-3">
 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <Store className="h-4 w-4 text-primary" />
 </div>
 <div>
 <h4 className="text-sm font-bold text-foreground">Find nearby outlets</h4>
 <p className="text-xs text-muted-foreground">See exactly what's available in your area.</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <Navigation className="h-4 w-4 text-primary" />
 </div>
 <div>
 <h4 className="text-sm font-bold text-foreground">Accurate delivery</h4>
 <p className="text-xs text-muted-foreground">Get precise delivery times and tracking.</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
 <Shield className="h-4 w-4 text-primary" />
 </div>
 <div>
 <h4 className="text-sm font-bold text-foreground">Privacy assured</h4>
 <p className="text-xs text-muted-foreground">We only use this to improve your experience.</p>
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-3 w-full">
 <Button 
 size="lg" 
 onClick={handleAllowLocation}
 disabled={isLoading}
 className="w-full rounded-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-md"
 >
 {isLoading ? (
 <>
 <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching...
 </>
 ) : (
 'Allow Location Access'
 )}
 </Button>
 <Button 
 variant="ghost" 
 size="lg"
 onClick={handleSkip}
 disabled={isLoading}
 className="w-full rounded-full h-14 text-muted-foreground hover:text-foreground hover:bg-muted"
 >
 Not right now
 </Button>
 </div>
 </div>
 
 <button 
 onClick={handleSkip}
 className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-background/50 hover:bg-background text-foreground backdrop-blur-sm transition-colors"
 >
 <X className="h-4 w-4" />
 </button>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
};
