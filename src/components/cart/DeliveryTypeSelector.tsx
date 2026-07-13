import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bike, Store, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const DeliveryTypeSelector = ({ value, onChange, disabled }: Props) => {
  return (
    <div className="bg-white p-5 md:p-6 rounded-[24px] border border-[#F1F5F9] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FFF7ED] flex items-center justify-center">
            <MapPin className="w-4.5 h-4.5 text-[#FF6B00]" />
          </div>
          <h3 className="font-extrabold text-[17px] text-[#111827] tracking-tight">Order Type</h3>
        </div>
        <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
      </div>

      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="flex flex-col gap-3.5"
        disabled={disabled}
      >
        {/* Door Delivery Option */}
        <div 
          className={cn(
            "relative flex items-center justify-between p-4 rounded-[16px] border-2 cursor-pointer transition-all duration-300",
            value === 'Door Delivery' 
              ? "border-[#FF6B00] bg-[#FFF7ED] shadow-[0_4px_12px_rgba(255,107,0,0.05)]" 
              : "border-[#F1F5F9] bg-white hover:border-[#FFD8B3]/50 hover:bg-[#FFF7ED]/10",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
          onClick={() => !disabled && onChange('Door Delivery')}
        >
          <RadioGroupItem value="Door Delivery" id="door-delivery" className="sr-only" />
          
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300",
              value === 'Door Delivery' ? "bg-[#FF6B00] text-white" : "bg-[#FFF7ED] text-[#FF6B00]"
            )}>
              <Bike className="w-5 h-5" />
            </div>

            {/* Texts */}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[15px] text-[#111827]">Door Delivery</span>
              <span className="text-[12px] text-[#6B7280] font-medium mt-0.5">Deliver straight to your doorstep</span>
            </div>
          </div>

          {/* Radio Indicator */}
          <div className={cn(
            "w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            value === 'Door Delivery' ? "border-[#FF6B00]" : "border-[#D1D5DB]"
          )}>
            {value === 'Door Delivery' && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-scale-up" />
            )}
          </div>
        </div>
        
        {/* Self Pickup Option */}
        <div 
          className={cn(
            "relative flex items-center justify-between p-4 rounded-[16px] border-2 cursor-pointer transition-all duration-300",
            value === 'Self Pickup' 
              ? "border-[#FF6B00] bg-[#FFF7ED] shadow-[0_4px_12px_rgba(255,107,0,0.05)]" 
              : "border-[#F1F5F9] bg-white hover:border-[#FFD8B3]/50 hover:bg-[#FFF7ED]/10",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
          onClick={() => !disabled && onChange('Self Pickup')}
        >
          <RadioGroupItem value="Self Pickup" id="self-pickup" className="sr-only" />
          
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300",
              value === 'Self Pickup' ? "bg-[#FF6B00] text-white" : "bg-[#FFF7ED] text-[#FF6B00]"
            )}>
              <Store className="w-5 h-5" />
            </div>

            {/* Texts */}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[15px] text-[#111827]">Self Pickup</span>
              <span className="text-[12px] text-[#6B7280] font-medium mt-0.5">Collect directly from our kitchen</span>
            </div>
          </div>

          {/* Radio Indicator */}
          <div className={cn(
            "w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            value === 'Self Pickup' ? "border-[#FF6B00]" : "border-[#D1D5DB]"
          )}>
            {value === 'Self Pickup' && (
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-scale-up" />
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
