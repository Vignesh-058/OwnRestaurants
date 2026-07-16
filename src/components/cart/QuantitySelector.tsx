import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled,
  size = 'md',
}: QuantitySelectorProps) => {
  const btnCls = {
    sm:  'w-8  h-8',
    md:  'w-10 h-10',
    lg:  'w-12 h-12',
  }[size];

  const numCls = {
    sm:  'w-8  h-8  text-[13px]',
    md:  'w-11 h-10 text-[15px]',
    lg:  'w-14 h-12 text-[22px]',
  }[size];

  const iconCls = {
    sm:  'w-3   h-3',
    md:  'w-3.5 h-3.5',
    lg:  'w-5   h-5',
  }[size];

  const roundCls = {
    sm:  'rounded-[10px]',
    md:  'rounded-[12px]',
    lg:  'rounded-[14px]',
  }[size];

  return (
    <div className={cn(
      'inline-flex items-center border-2 border-primary overflow-hidden select-none',
      roundCls,
    )}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={onDecrease}
        disabled={disabled}
        className={cn(
          btnCls,
          'flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none font-bold shrink-0',
        )}
      >
        <Minus className={iconCls} strokeWidth={2.5} />
      </button>

      <span className={cn(
        numCls,
        'font-black tabular-nums text-foreground bg-accent flex items-center justify-center border-x-2 border-primary shrink-0',
      )}>
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={onIncrease}
        disabled={disabled}
        className={cn(
          btnCls,
          'flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none font-bold shrink-0',
        )}
      >
        <Plus className={iconCls} strokeWidth={2.5} />
      </button>
    </div>
  );
};
