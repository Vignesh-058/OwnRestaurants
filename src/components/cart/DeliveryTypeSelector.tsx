import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bike, Store, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const DeliveryTypeSelector = ({ value, onChange, disabled, compact }: Props) => {
  return (
    <div className={compact
      ? 'mb-3'
      : 'bg-white p-5 md:p-6 rounded-[24px] border border-muted shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6'
    }>
      {/* Header */}
      <div className={compact ? 'flex items-center justify-between mb-2.5' : 'flex items-center justify-between mb-5'}>
        <div className="flex items-center gap-2">
          <div className={compact
            ? 'w-5 h-5 rounded-full bg-accent flex items-center justify-center'
            : 'w-8 h-8 rounded-full bg-accent flex items-center justify-center'
          }>
            <MapPin className={compact ? 'w-3 h-3 text-primary' : 'w-4 h-4 text-primary'} />
          </div>
          <h3 className={compact
            ? 'font-semibold text-[13px] text-foreground'
            : 'font-extrabold text-[17px] text-foreground tracking-tight'
          }>
            Order Type
          </h3>
        </div>
      </div>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className={compact ? 'flex flex-row gap-2' : 'flex flex-col gap-3.5'}
        disabled={disabled}
      >
        {/* Door Delivery */}
        <div
          className={cn(
            compact
              ? 'flex-1 relative flex flex-col items-center justify-center gap-1.5 py-2 px-2 rounded-[12px] border-2 cursor-pointer transition-all duration-200 min-h-[56px] py-1.5'
              : 'relative flex items-center justify-between p-4 rounded-[16px] border-2 cursor-pointer transition-all duration-300',
            value === 'Door Delivery'
              ? 'border-primary bg-accent shadow-[0_2px_8px_rgba(255, 107, 53,0.08)]'
              : 'border-muted bg-white hover:border-accent/60 hover:bg-accent/10',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          )}
          onClick={() => !disabled && onChange('Door Delivery')}
        >
          <RadioGroupItem value="Door Delivery" id="door-delivery" className="sr-only" />

          {compact ? (
            // Compact: icon + label stacked vertically, centred
            <>
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 shrink-0',
                value === 'Door Delivery' ? 'bg-primary text-white' : 'bg-accent text-primary',
              )}>
                <Bike className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[12px] text-foreground text-center leading-tight">
                Door Delivery
              </span>
            </>
          ) : (
            // Full: icon + label side-by-side
            <>
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300',
                  value === 'Door Delivery' ? 'bg-primary text-white' : 'bg-accent text-primary',
                )}>
                  <Bike className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[15px] text-foreground">Door Delivery</span>
                  <span className="text-[12px] text-muted-foreground font-medium mt-0.5">
                    Deliver straight to your doorstep
                  </span>
                </div>
              </div>
              <div className={cn(
                'w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                value === 'Door Delivery' ? 'border-primary' : 'border-border',
              )}>
                {value === 'Door Delivery' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-scale-up" />
                )}
              </div>
            </>
          )}
        </div>

        {/* Self Pickup */}
        <div
          className={cn(
            compact
              ? 'flex-1 relative flex flex-col items-center justify-center gap-1.5 py-2 px-2 rounded-[12px] border-2 cursor-pointer transition-all duration-200 min-h-[56px] py-1.5'
              : 'relative flex items-center justify-between p-4 rounded-[16px] border-2 cursor-pointer transition-all duration-300',
            value === 'Self Pickup'
              ? 'border-primary bg-accent shadow-[0_2px_8px_rgba(255, 107, 53,0.08)]'
              : 'border-muted bg-white hover:border-accent/60 hover:bg-accent/10',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          )}
          onClick={() => !disabled && onChange('Self Pickup')}
        >
          <RadioGroupItem value="Self Pickup" id="self-pickup" className="sr-only" />

          {compact ? (
            // Compact: icon + label stacked vertically, centred
            <>
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 shrink-0',
                value === 'Self Pickup' ? 'bg-primary text-white' : 'bg-accent text-primary',
              )}>
                <Store className="w-4 h-4" />
              </div>
              <span className="font-semibold text-[12px] text-foreground text-center leading-tight">
                Self Pickup
              </span>
            </>
          ) : (
            // Full: icon + label side-by-side
            <>
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300',
                  value === 'Self Pickup' ? 'bg-primary text-white' : 'bg-accent text-primary',
                )}>
                  <Store className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[15px] text-foreground">Self Pickup</span>
                  <span className="text-[12px] text-muted-foreground font-medium mt-0.5">
                    Collect directly from our kitchen
                  </span>
                </div>
              </div>
              <div className={cn(
                'w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                value === 'Self Pickup' ? 'border-primary' : 'border-border',
              )}>
                {value === 'Self Pickup' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-scale-up" />
                )}
              </div>
            </>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};
