import { useDiscounts } from '@/hooks/discounts/useDiscounts';
import { useCartStore } from '@/store/CartStore';
import { Button } from '@/components/ui/button';
import { Ticket, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganizationStore } from '@/store/OrganizationStore';

const fmtDate = (iso: string) => {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(iso));
};

export const DiscountList = () => {
  const { offers, isLoading, isError, refetch, applyOffer, applying } = useDiscounts();
  const appliedDiscount = useCartStore((state) => state.appliedDiscount);
  const currency = useOrganizationStore((state) => state.organization?.currency || '₹');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[16px] text-[#111827] flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-[#FF6B00]" />
          Available Offers
        </h3>
        <div className="space-y-3">
          <div className="h-[90px] bg-muted animate-pulse rounded-2xl" />
          <div className="h-[90px] bg-muted animate-pulse rounded-2xl" />
          <div className="h-[90px] bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[16px] text-[#111827] flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-[#FF6B00]" />
          Available Offers
        </h3>
        <div className="border border-red-200 bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-red-600 font-bold text-[14px] mb-2">Unable to load offers.</p>
          <Button onClick={() => refetch()} variant="outline" className="h-8 text-[12px]">Retry</Button>
        </div>
      </div>
    );
  }

  const hasCoupons = offers && offers.length > 0;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-[16px] text-[#111827] flex items-center gap-2">
        <Ticket className="w-5 h-5 text-[#FF6B00]" />
        Available Offers
      </h3>

      {!hasCoupons ? (
        <div className="border border-[#E5E7EB] bg-[#F8FAFC] rounded-2xl p-6 text-center">
          <p className="text-[#6B7280] font-medium text-[14px]">No offers available.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
          {offers.map((coupon: any) => {
            const isApplied = appliedDiscount?.discountId === coupon._id;
            const isEligible = coupon.eligible ?? coupon.isEligible ?? true;
            const offerName = coupon.offerName || coupon.name || coupon.code || 'Offer';
            const discountPercent = coupon.discountPercentage || coupon.discountValue || 0;
            const isPercentage = String(coupon.discountType).toLowerCase() === 'percentage';
            const expiry = coupon.endDate || coupon.expiryDate || coupon.validTill;
            const formattedExpiry = expiry ? fmtDate(expiry) : null;
            const iconBadge = coupon.offerIcon === 'ticket' ? '🎟' : '🎟';

            return (
              <div 
                key={coupon._id} 
                className={cn(
                  "border rounded-[16px] p-4 relative overflow-hidden transition-all flex items-center gap-4 shadow-sm",
                  isApplied 
                    ? "border-[#10B981] bg-[#ECFDF5]" 
                    : !isEligible 
                      ? "border-[#E5E7EB] bg-[#F9FAFB] opacity-60" 
                      : "border-[#FFD8B3] bg-[#FFF7ED]"
                )}
              >
                {/* Left Icon */}
                <div className="flex-none h-12 w-12 rounded-full bg-white flex items-center justify-center text-[22px] shadow-sm">
                  {iconBadge}
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-[#111827] text-[15px] truncate">{offerName}</h4>
                  <p className="text-[#FF6B00] font-black text-[13px] tracking-tight">
                    {isPercentage ? discountPercent + '% OFF' : currency + discountPercent + ' OFF'}
                  </p>
                  {formattedExpiry && (
                    <p className="text-[#6B7280] text-[11px] font-bold mt-1 uppercase tracking-wider">
                      Valid till {formattedExpiry}
                    </p>
                  )}
                </div>

                {/* Right Button */}
                <div className="flex-none">
                  {!isEligible ? (
                    <Button 
                      disabled 
                      variant="outline" 
                      className="h-8 rounded-full text-[11px] font-bold uppercase tracking-wider bg-transparent border-gray-300 text-gray-500 px-3"
                    >
                      Not Eligible
                    </Button>
                  ) : isApplied ? (
                    <Button 
                      variant="outline" 
                      className="h-8 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#10B981] hover:bg-[#059669] border-transparent text-white px-3 gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => applyOffer(coupon._id)}
                      disabled={applying}
                      className="h-8 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FF6B00] hover:bg-[#EA580C] text-white px-4 shadow-[0_2px_8px_rgba(255,107,0,0.2)] disabled:opacity-50"
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
