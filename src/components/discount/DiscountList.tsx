import { useState } from 'react';
import { useCoupons } from '@/hooks/queries/useCoupons';
import { useApplyCoupon } from '@/hooks/mutations/useApplyCoupon';
import { useCouponStore } from '@/store/CouponStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ticket, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { toast } from 'sonner';

export const DiscountList = () => {
  const { data: coupons, isLoading, isError } = useCoupons();
  const { mutate: applyCoupon, isPending } = useApplyCoupon();
  const appliedCoupon = useCouponStore((state) => state.appliedCoupon);
  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');
  
  const [customCode, setCustomCode] = useState('');

  const handleApply = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) {
      toast.error('Please enter a coupon code.');
      return;
    }
    applyCoupon(trimmed, {
      onSuccess: () => {
        setCustomCode('');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card p-6 rounded-3xl border shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" />
          Offers & Discounts
        </h3>
        <div className="space-y-4">
          <div className="h-12 bg-muted animate-pulse rounded-xl" />
          <div className="h-24 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card p-6 rounded-3xl border shadow-sm border-destructive/20 bg-destructive/5">
        <p className="text-destructive font-medium text-center">Unable to load discounts. Please try again.</p>
      </div>
    );
  }

  const hasCoupons = coupons && coupons.length > 0;

  return (
    <div className="bg-card p-6 rounded-3xl border shadow-sm space-y-6">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Ticket className="w-5 h-5 text-primary" />
        Offers & Discounts
      </h3>
      
      {/* Manual Input Box */}
      <div className="flex gap-3">
        <Input
          placeholder="Enter coupon code"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="uppercase font-bold tracking-widest placeholder:normal-case placeholder:font-normal placeholder:tracking-normal h-12 rounded-xl"
        />
        <Button
          onClick={() => handleApply(customCode)}
          disabled={isPending || !customCode.trim()}
          className="h-12 px-6 font-bold rounded-xl shrink-0"
        >
          {isPending ? 'Applying...' : 'Apply'}
        </Button>
      </div>

      {!hasCoupons ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground font-medium">No offers available</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {coupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <div 
                key={coupon._id} 
                className={cn(
                  "border-2 border-dashed rounded-2xl p-4 relative overflow-hidden transition-all",
                  isApplied 
                    ? "border-green-500 bg-green-50" 
                    : "border-primary/30 bg-primary/5 hover:border-primary/50"
                )}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className={cn(
                      "inline-block px-2 py-1 font-bold rounded-md text-sm tracking-widest uppercase",
                      isApplied ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                    )}>
                      {coupon.code}
                    </div>
                    
                    {coupon.name && (
                      <h4 className="font-bold text-md mt-2">{coupon.name}</h4>
                    )}
                    
                    <p className={cn("text-sm font-semibold", isApplied ? "text-green-700" : "text-primary")}>
                      {coupon.discountType === 'Fixed' || coupon.discountType === 'FlatOff' 
                        ? `${currency}${coupon.discountValue} OFF`
                        : coupon.discountType === 'Percentage'
                        ? `${coupon.discountValue}% OFF`
                        : ''}
                    </p>

                    {coupon.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {coupon.description}
                      </p>
                    )}

                    {coupon.expiryDate && (
                      <div className="flex items-center gap-1 text-xs font-medium text-orange-500 mt-2">
                        <Clock className="w-3 h-3" />
                        Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  {isApplied ? (
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="text-xs font-bold text-green-600">Applied</span>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="font-bold shrink-0 rounded-xl"
                      onClick={() => handleApply(coupon.code)}
                      disabled={isPending}
                    >
                      Apply
                    </Button>
                  )}
                </div>
                
                {/* Decorative cutout circles */}
                <div className="w-4 h-4 bg-card rounded-full absolute -left-2 top-1/2 -translate-y-1/2 border-r-2 border-primary/20" />
                <div className="w-4 h-4 bg-card rounded-full absolute -right-2 top-1/2 -translate-y-1/2 border-l-2 border-primary/20" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
