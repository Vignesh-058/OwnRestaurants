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
import { useTables } from '@/hooks/queries/useDineIn';
import { useCartStore } from '@/store/CartStore';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Utensils, ShoppingBag, Truck, Users } from 'lucide-react';
import type { ActivePreBookingCampaign } from '@/types/prebooking.types';

const DEFAULT_TIME_SLOTS = [
  '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00',
  '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00',
  '21:00:00', '22:00:00'
];

const getTimeSlotsToDisplay = (campaignTimeSlots?: string[]) => {
  if (campaignTimeSlots && campaignTimeSlots.length >= 8) {
    return campaignTimeSlots;
  }
  if (campaignTimeSlots && campaignTimeSlots.length > 0) {
    const combined = Array.from(new Set([...campaignTimeSlots, ...DEFAULT_TIME_SLOTS]));
    return combined.sort();
  }
  return DEFAULT_TIME_SLOTS;
};

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

  const availableOrderTypes = selectedOutlet?.orderType?.length
    ? selectedOutlet.orderType
    : ['Door Delivery', 'Self Pickup', 'Dine In'];

  const { data: activePreBookingRes, isLoading } = useActivePreBooking(
    { belongsTo: org?._id || '', outletId: selectedOutlet?._id || '' },
    !!settings?.preBookingEnabled
  );

  const { data: tables = [] } = useTables(selectedOutlet?._id);

  const campaigns = activePreBookingRes?.data || [];

  const [selectedCampaign, setSelectedCampaign] = useState<ActivePreBookingCampaign | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedOrderType, setSelectedOrderType] = useState<string>('');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);

  // Clear selections when the selected outlet changes
  useEffect(() => {
    setSelectedCampaign(null);
    setScheduleDate('');
    setScheduleTime('');
    setSelectedOrderType('');
    setSelectedTableId('');
    setNumberOfGuests(2);
  }, [selectedOutlet?._id]);

  if (!settings?.preBookingEnabled || isLoading || campaigns.length === 0) {
    return null;
  }

  const handleContinue = () => {
    if (!selectedCampaign || !scheduleDate || !scheduleTime) {
      toast.error('Please select an available date and time.');
      return;
    }

    if (!selectedOrderType) {
      toast.error('Please select an order type to continue.');
      return;
    }

    let selectedTable: any = null;
    if (selectedOrderType === 'Dine In') {
      if (!selectedTableId) {
        toast.error('Please select a table for Dine In.');
        return;
      }
      if (!numberOfGuests || numberOfGuests < 1) {
        toast.error('Please enter a valid number of guests.');
        return;
      }
      selectedTable = tables.find(t => t._id === selectedTableId) || { _id: selectedTableId, tableName: `Table ${selectedTableId}` };
    }

    const { setPreBooking, setOrderType, setTableInfo, setNumberOfGuests: setGuests } = useCartStore.getState();

    setPreBooking({
      preBookingId: selectedCampaign.preBookingId,
      preOrderDate: scheduleDate,
      preOrderTime: scheduleTime,
      orderType: selectedOrderType as any,
      tableInfo: selectedTable ? { tableId: selectedTable._id, tableName: selectedTable.tableName } : null,
      numberOfGuests: selectedOrderType === 'Dine In' ? numberOfGuests : null,
    });
    setOrderType(selectedOrderType as any);
    if (selectedTable) {
      setTableInfo({ tableId: selectedTable._id, tableName: selectedTable.tableName });
    }
    if (selectedOrderType === 'Dine In') {
      setGuests(numberOfGuests);
    }

    let targetUrl = `/pre-book-page?preBookingId=${selectedCampaign.preBookingId}&preOrderDate=${scheduleDate}&preOrderTime=${scheduleTime}&orderType=${encodeURIComponent(selectedOrderType)}`;
    if (selectedOrderType === 'Dine In' && selectedTable) {
      targetUrl += `&tableId=${selectedTable._id}&tableName=${encodeURIComponent(selectedTable.tableName)}&numberOfGuests=${numberOfGuests}`;
    }

    navigate(targetUrl);
    setSelectedCampaign(null);
    setScheduleDate('');
    setScheduleTime('');
    setSelectedOrderType('');
    setSelectedTableId('');
    setNumberOfGuests(2);
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
                    <SelectContent className="rounded-xl max-h-[320px] overflow-y-auto">
                      {selectedCampaign.availableDates.map((dateStr) => {
                        const isAvailable = !selectedCampaign.unAvailableDates?.includes(dateStr);
                        const parts = dateStr.split('T')[0].split('-');
                        let formattedDisplay = dateStr;
                        if (parts.length === 3) {
                          const [year, month, day] = parts;
                          const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                          const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                          formattedDisplay = `${day}-${month}-${year} (${weekday})`;
                        }
                        return (
                          <SelectItem 
                            key={dateStr} 
                            value={dateStr}
                            disabled={!isAvailable}
                            className="py-3 text-base cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                          >
                            {formattedDisplay}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {scheduleDate && (() => {
                const slotsToDisplay = getTimeSlotsToDisplay(selectedCampaign.timeSlots);
                return (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <label className="text-base font-bold text-foreground">Select Time</label>
                    </div>
                    {slotsToDisplay.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No slots available.</p>
                    ) : (
                      <Select 
                        value={scheduleTime} 
                        onValueChange={(val) => setScheduleTime(val)}
                      >
                        <SelectTrigger className="w-full h-12 text-base rounded-xl border-border bg-card hover:bg-muted/50 transition-colors">
                          <SelectValue placeholder="Choose Time" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-[320px] overflow-y-auto">
                          {slotsToDisplay.map((slotTime) => (
                            <SelectItem 
                              key={slotTime} 
                              value={slotTime}
                              className="py-3 text-base cursor-pointer rounded-lg hover:bg-muted focus:bg-muted"
                            >
                              {formatTime12Hour(slotTime)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })()}

              {scheduleDate && scheduleTime && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-bold text-foreground flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-primary" /> Choose Order Type
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {availableOrderTypes.map((type) => {
                      const isSelected = selectedOrderType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedOrderType(type)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                              : 'border-border bg-card text-foreground hover:bg-muted/50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {type === 'Door Delivery' && <Truck className="w-4 h-4 text-primary shrink-0" />}
                            {type === 'Self Pickup' && <ShoppingBag className="w-4 h-4 text-primary shrink-0" />}
                            {type === 'Dine In' && <Utensils className="w-4 h-4 text-primary shrink-0" />}
                            <span className="text-sm">{type}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {scheduleDate && scheduleTime && selectedOrderType === 'Dine In' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-border bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      Select Table <span className="text-destructive">*</span>
                    </label>
                    <Select value={selectedTableId} onValueChange={(val) => setSelectedTableId(val)}>
                      <SelectTrigger className="w-full h-11 text-sm rounded-xl border-border bg-card">
                        <SelectValue placeholder="Choose Table" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {tables.length === 0 ? (
                          <SelectItem value="table-1">Table 1 (Capacity: 4)</SelectItem>
                        ) : (
                          tables.map((table) => (
                            <SelectItem key={table._id} value={table._id}>
                              {table.tableName} (Capacity: {table.capacity || 4})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Number of Guests <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={20}
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(Math.max(1, parseInt(e.target.value) || 1))}
                      placeholder="Enter number of guests"
                      className="h-11 text-sm rounded-xl bg-card"
                    />
                  </div>
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
              disabled={!scheduleDate || !scheduleTime || !selectedOrderType || (selectedOrderType === 'Dine In' && (!selectedTableId || !numberOfGuests))}
            >
              Continue to Menu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
