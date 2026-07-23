import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useStoreStatus } from '@/hooks/queries/useStoreStatus';
import { MapPin, Star, Clock, Utensils, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const OrganizationAndOutletInfo = () => {
  const organization = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const belongsTo = organization?._id || '';
  const outletId = selectedOutlet?._id || '';

  const { data: storeStatus } = useStoreStatus(belongsTo, outletId);
  const isOpen = storeStatus?.storeStatus;

  if (!organization || !selectedOutlet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-4 mb-6"
    >
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xs border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          {organization.logoImage ? (
            <div className="size-14 md:size-16 rounded-full border border-muted shadow-xs overflow-hidden shrink-0 bg-white p-0.5">
              <img 
                src={organization.logoImage} 
                alt={organization.name} 
                className="w-full h-full object-contain rounded-full" 
              />
            </div>
          ) : (
            <div className="size-14 md:size-16 rounded-full border border-muted bg-muted flex items-center justify-center shadow-xs shrink-0">
              <Utensils className="size-7 text-primary" />
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-extrabold text-[#1e1b4b] tracking-tight leading-tight">
              {organization.name || organization.brandName}
            </h1>
            <h2 className="text-xs md:text-sm font-bold text-primary mb-1.5">
              {selectedOutlet.outletName}
            </h2>
            
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
              {selectedOutlet.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span className="truncate max-w-[200px] md:max-w-[300px]">{selectedOutlet.address}</span>
                </div>
              )}
              {storeStatus?.deliveryExpectedTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  <span>{storeStatus.deliveryExpectedTime} mins</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-[#FFF4EB] px-2.5 py-1 rounded-md ml-2">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                <span className="text-[#1e1b4b] font-black text-[12px]">4.8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 relative z-10 w-full md:w-auto mt-4 md:mt-0">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-2",
            isOpen 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isOpen ? "bg-green-500 animate-pulse" : "bg-red-500")} />
            {isOpen ? "Accepting Orders" : "Currently Closed"}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="bg-muted px-4 py-2 rounded-xl text-[13px] font-bold text-foreground border border-border flex items-center gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              Quality Assured
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
