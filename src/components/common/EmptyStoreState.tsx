import { MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLocationModalStore } from '@/store/LocationModalStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const EmptyStoreState = () => {
 const openLocationModal = useLocationModalStore((state) => state.openModal);
 const queryClient = useQueryClient();

 const handleRetry = () => {
 toast.promise(
 queryClient.refetchQueries({ queryKey: ['outlets'] }),
 {
 loading: 'Retrying outlet fetch...',
 success: 'Outlets status updated!',
 error: 'Retry failed. Please choose another location.',
 }
 );
 };

 return (
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.5, ease: 'easeOut' }}
 className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
 >
 <motion.div 
 initial={{ y: 20 }}
 animate={{ y: 0 }}
 transition={{ delay: 0.2, duration: 0.4 }}
 className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-primary/20"
 >
 <MapPin className="h-10 w-10 text-primary animate-pulse" />
 </motion.div>
 <motion.h3 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.3 }}
 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3"
 >
 No nearby outlets available.
 </motion.h3>
 <motion.p 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.4 }}
 className="text-muted-foreground max-w-md mb-8 text-base font-semibold leading-relaxed"
 >
 We couldn't find any active outlets near your current address. Try changing your address or updating your location settings.
 </motion.p>
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
 >
 <Button onClick={openLocationModal} variant="default" className="rounded-full px-6 h-12 font-bold shadow-md shadow-primary/20">
 Change Location
 </Button>
 <Button onClick={openLocationModal} variant="outline" className="rounded-full px-6 h-12 font-bold">
 Choose Another Address
 </Button>
 <Button onClick={handleRetry} variant="ghost" className="rounded-full px-5 h-12 font-bold gap-2 text-muted-foreground hover:text-foreground">
 <RefreshCw className="h-4 w-4" />
 Retry
 </Button>
 </motion.div>
 </motion.div>
 );
};
