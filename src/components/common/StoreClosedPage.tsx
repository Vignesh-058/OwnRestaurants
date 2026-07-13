import { Clock, ArrowLeft, Calendar, Wrench, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { Outlet, StoreStatusResponse } from '@/types/organization.types';
import { format } from 'date-fns';

interface StoreClosedPageProps {
  outlet: Outlet;
  storeStatus: StoreStatusResponse;
  onBackToHome: () => void;
}

export const StoreClosedPage = ({ outlet, storeStatus, onBackToHome }: StoreClosedPageProps) => {
  const isOverride = !!storeStatus.manualOverrideType;
  
  const getIcon = () => {
    switch (storeStatus.manualOverrideType?.toLowerCase()) {
      case 'maintenance': return <Wrench className="h-16 w-16 text-orange-500 mb-6" />;
      case 'holiday': return <Calendar className="h-16 w-16 text-primary mb-6" />;
      default: return <Store className="h-16 w-16 text-destructive mb-6" />;
    }
  };

  const getTitle = () => {
    if (isOverride) return storeStatus.manualOverrideType;
    return 'Store Currently Closed';
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* BACK BAR */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-6 w-full">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Choose Another Outlet
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full text-center mt-10 md:mt-0"
      >
        {getIcon()}

        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4 capitalize">
          {getTitle()}
        </h1>

        <p className="text-lg text-muted-foreground font-medium mb-8">
          We're sorry, but <span className="font-bold text-foreground">{outlet.outletName}</span> is not accepting orders at this moment. 
          {isOverride ? ' They are currently unavailable due to manual override.' : ' They have closed for the day or are outside of their working hours.'}
        </p>

        {storeStatus.overrideEndTime && (
          <div className="bg-muted px-6 py-4 rounded-2xl border border-border flex flex-col items-center gap-2 mb-8">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Expected to Reopen</span>
            <span className="text-lg font-black flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {format(new Date(storeStatus.overrideEndTime), 'MMM do, yyyy - h:mm a')}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button 
            onClick={onBackToHome}
            className="rounded-full h-14 px-8 font-black text-lg shadow-md hover:shadow-lg transition-all"
          >
            Explore Other Outlets
          </Button>
        </div>

      </motion.div>
    </div>
  );
};
