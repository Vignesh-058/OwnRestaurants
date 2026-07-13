import { Loader2, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export const StoreStatusLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background/50 backdrop-blur-sm z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20 relative"
      >
        <Store className="h-8 w-8 text-primary opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </motion.div>
      <h3 className="text-xl font-black tracking-tight text-foreground mb-2">
        Checking Store Status...
      </h3>
      <p className="text-muted-foreground text-sm font-medium">
        Please wait while we verify if the store is currently accepting orders.
      </p>
    </div>
  );
};
