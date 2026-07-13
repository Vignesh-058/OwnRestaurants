import { Loader2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-background/50 backdrop-blur-sm z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20 relative"
      >
        <Settings className="h-8 w-8 text-primary opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </motion.div>
      <h3 className="text-xl font-black tracking-tight text-foreground mb-2">
        Loading Configuration...
      </h3>
      <p className="text-muted-foreground text-sm font-medium">
        Please wait while we initialize store settings and features.
      </p>
    </div>
  );
};
