import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { useOutletStore } from '@/store/OutletStore';
import { useSettingsStore } from '@/store/SettingsStore';
import { useActivePreBooking } from '@/hooks/queries/usePreBooking';
import { Calendar, Clock, ChevronRight, Star, Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { ActivePreBookingCampaign } from '@/types/prebooking.types';

const formatTime12Hour = (timeStr: string) => {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  if (!hourStr || !minStr) return timeStr;
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour.toString().padStart(2, '0')}:${minStr} ${ampm}`;
};

export const PreBookingCampaigns = () => {
  const navigate = useNavigate();
  const org = useOrganizationStore((state) => state.organization);
  const selectedOutlet = useOutletStore((state) => state.selectedOutlet);
  const settings = useSettingsStore((state) => state.settings);

  const { data: activePreBookingRes, isLoading } = useActivePreBooking(
    { belongsTo: org?._id || '', outletId: selectedOutlet?._id || '' },
    !!settings?.preBookingEnabled
  );

  const campaigns = activePreBookingRes?.data || [];

  const [selectedCampaign, setSelectedCampaign] = useState<ActivePreBookingCampaign | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Clear selections when the selected outlet changes
  useEffect(() => {
    setSelectedCampaign(null);
    setScheduleDate('');
    setScheduleTime('');
  }, [selectedOutlet?._id]);

  if (!settings?.preBookingEnabled || isLoading || campaigns.length === 0) {
    return null;
  }

  const handleContinue = () => {
    if (selectedCampaign && scheduleDate && scheduleTime) {
      navigate(`/pre-book-page?preBookingId=${selectedCampaign.preBookingId}&preOrderDate=${scheduleDate}&preOrderTime=${scheduleTime}`);
      setSelectedCampaign(null);
      setScheduleDate('');
      setScheduleTime('');
    }
  };

  return (
    <>
      <div id="prebooking-section" className="w-full px-4 md:px-0 max-w-7xl mx-auto my-6 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Special Pre-Orders</h2>
            <p className="text-sm text-muted-foreground mt-1">Book ahead for exclusive menus and events</p>
          </div>
        </div>
        
        {campaigns.length === 0 ? (
          <div className="w-full text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm font-medium">No active pre-order campaigns available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <motion.div 
                key={campaign.preBookingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative flex flex-col bg-card rounded-[20px] overflow-hidden border border-border shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {/* Hero Image Section */}
                <div className="relative w-full h-[200px] overflow-hidden shrink-0">
                  <img 
                    src={campaign.image || '/placeholder-food.jpg'} 
                    alt={campaign.preBookingName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                    <Flame className="w-3 h-3" />
                    LIMITED OFFER
                  </div>
                  {/* Gradient Overlay & Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h3 className="font-bold text-white text-lg leading-tight drop-shadow-sm line-clamp-1">
                      {campaign.preBookingName}
                    </h3>
                  </div>
                </div>

                {/* Campaign Information */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-[15px] font-semibold text-foreground mb-1 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-primary" /> Special Pre-Order
                    </h4>
                    <p className="text-[14px] text-muted-foreground line-clamp-2">
                      {campaign.description || 'Exclusive pre-booking menu. Reserve your favourite dishes before they sell out.'}
                    </p>
                  </div>

                  {/* Information Chips */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-medium text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Pre-Booking
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-medium text-muted-foreground">
                      <Clock className="w-3 h-3" /> Scheduled Order
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border text-[11px] font-medium text-muted-foreground">
                      <Star className="w-3 h-3 text-yellow-500" /> Exclusive Menu
                    </span>
                  </div>

                  {/* Action Section */}
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="line-clamp-1">Available for Limited Time</span>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setScheduleDate('');
                        setScheduleTime('');
                      }}
                      className="shrink-0 bg-primary hover:bg-primary text-primary-foreground rounded-full px-5 h-9 font-semibold text-sm shadow-md hover:shadow-primary/30 group-hover:shadow-primary/40 transition-all duration-300 flex items-center gap-2"
                    >
                      Explore Menu <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent className="w-[95vw] max-w-[560px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-border shrink-0">
            <DialogTitle>Schedule your Pre-order</DialogTitle>
            <DialogDescription>
              Select an available date and time for {selectedCampaign?.preBookingName}.
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="overflow-y-auto p-6 space-y-6 flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <label className="text-base font-bold text-foreground">Select Date</label>
                </div>
                {selectedCampaign.availableDates?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No dates available.</p>
                ) : (
                  <Select 
                    value={scheduleDate} 
                    onValueChange={(val) => {
                      setScheduleDate(val);
                      setScheduleTime('');
                    }}
                  >
                    <SelectTrigger className="w-full h-12 text-base rounded-xl border-border bg-card hover:bg-muted/50 transition-colors">
                      <SelectValue placeholder="Choose Date" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-[40vh] overflow-y-auto">
                      {selectedCampaign.availableDates.map((dateStr) => {
                        const isAvailable = !selectedCampaign.unAvailableDates?.includes(dateStr);
                        const dateObj = new Date(dateStr);
                        const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                        const weekday = dateObj.toLocaleDateString('en-GB', { weekday: 'short' });
                        return (
                          <SelectItem 
                            key={dateStr} 
                            value={dateStr}
                            disabled={!isAvailable}
                            className="py-3 text-base cursor-pointer rounded-lg"
                          >
                            {formattedDate} ({weekday})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {scheduleDate && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-border">
                   <div className="flex items-center gap-2">
                     <Clock className="w-5 h-5 text-primary" />
                     <label className="text-base font-bold text-foreground">Select Time</label>
                   </div>
                   {selectedCampaign.timeSlots?.length === 0 ? (
                     <p className="text-sm text-muted-foreground">No slots available.</p>
                   ) : (
                     <Select 
                       value={scheduleTime} 
                       onValueChange={(val) => setScheduleTime(val)}
                     >
                       <SelectTrigger className="w-full h-12 text-base rounded-xl border-border bg-card hover:bg-muted/50 transition-colors">
                         <SelectValue placeholder="Choose Time" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl max-h-[40vh] overflow-y-auto">
                         {selectedCampaign.timeSlots.map((slotTime) => (
                           <SelectItem 
                             key={slotTime} 
                             value={slotTime}
                             className="py-3 text-base cursor-pointer rounded-lg"
                           >
                             {formatTime12Hour(slotTime)}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   )}
                 </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border bg-background shrink-0 rounded-b-lg">
            <Button variant="outline" onClick={() => setSelectedCampaign(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleContinue} 
              disabled={!scheduleDate || !scheduleTime}
            >
              Continue to Menu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
