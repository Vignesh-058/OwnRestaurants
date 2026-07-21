import { useState } from 'react';
import { useDiscounts } from '@/hooks/discounts/useDiscounts';
import { useCartStore } from '@/store/CartStore';
import { Button } from '@/components/ui/button';
import { Ticket, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrganizationStore } from '@/store/OrganizationStore';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isOpen, setIsOpen] = useState(false);
  const [customCode, setCustomCode] = useState('');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[16px] text-[#1F2937] flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-[#FF6B00]" />
          Available Offers
        </h3>
        <div className="space-y-3">
          <div className="h-[90px] bg-[#FAF8F5] animate-pulse rounded-[16px]" />
          <div className="h-[90px] bg-[#FAF8F5] animate-pulse rounded-[16px]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-[16px] text-[#1F2937] flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-[#FF6B00]" />
          Available Offers
        </h3>
        <div className="border border-red-200 bg-red-50 rounded-[16px] p-4 text-center">
          <p className="text-red-600 font-bold text-[14px] mb-2">Unable to load offers.</p>
          <Button onClick={() => refetch()} variant="outline" className="h-8 text-[12px]">Retry</Button>
        </div>
      </div>
    );
  }

  const hasCoupons = offers && offers.length > 0;

  return (
    <div className="space-y-0">
      {/* ── Custom Code Input ── */}
      <div className="flex gap-2 mb-4 mt-1">
        <input
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 h-10 px-4 rounded-xl border border-[#FFE2CC] bg-white text-[14px] outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all uppercase placeholder:normal-case placeholder:text-gray-400"
        />
        <Button
          disabled={applying || !customCode.trim()}
          onClick={() => {
            const matched = offers?.find((o: any) => 
              o.code?.toLowerCase() === customCode.trim().toLowerCase() || 
              o.offerName?.toLowerCase() === customCode.trim().toLowerCase()
            );
            applyOffer(matched ? matched._id : customCode.trim());
          }}
          className="h-10 px-6 rounded-xl bg-[#FF1A1A] hover:bg-[#E60000] text-white font-bold text-[13px] tracking-wide disabled:opacity-50"
        >
          Apply
        </Button>
      </div>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group py-2"
      >
        <h3 className="font-bold text-[18px] text-[#1F2937] flex items-center gap-2">
          <Ticket className="w-6 h-6 text-[#FF6B00]" strokeWidth={2.5} />
          Available Offers
        </h3>
        <span className="text-[#6B7280] group-hover:text-[#FF6B00] transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">

              {!hasCoupons ? (
                <div className="border border-[#FFE2CC] bg-[#FAF8F5] rounded-[16px] p-6 text-center">
                  <p className="text-[#6B7280] font-medium text-[14px]">No offers available.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pr-1">
                  {offers.map((coupon: any) => {
                    const isApplied = appliedDiscount?.discountId === coupon._id;
                    const isEligible = coupon.eligible ?? coupon.isEligible ?? true;
                    const offerName = coupon.offerName || coupon.name || coupon.code || 'Offer';
                    const discountPercent = coupon.discountPercentage || coupon.discountValue || 0;
                    const isPercentage = String(coupon.discountType).toLowerCase() === 'percentage';
                    const expiry = coupon.endDate || coupon.expiryDate || coupon.validTill;
                    const formattedExpiry = expiry ? fmtDate(expiry) : null;

                    return (
                      <div 
                        key={coupon._id} 
                        className={cn(
                          "rounded-[16px] p-4 relative overflow-hidden transition-all flex items-center gap-4",
                          isApplied 
                            ? "bg-[#FFF4EB] border border-[#FF6B00]/30 shadow-sm" 
                            : !isEligible 
                              ? "bg-gray-50 border border-gray-100 opacity-60" 
                              : "bg-[#FAF8F5] border border-[#FFE2CC]/60 shadow-sm hover:shadow-md hover:border-[#FFE2CC]"
                        )}
                      >
                        {/* Left Icon */}
                        <div className="flex-none h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm text-[#FF6B00]">
                          <Ticket className="w-6 h-6" />
                        </div>

                        {/* Center Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1F2937] text-[16px] truncate">{offerName}</h4>
                          <p className="text-[#FF6B00] font-bold text-[14px] mt-0.5 tracking-tight">
                            {isPercentage ? discountPercent + '% OFF' : currency + discountPercent + ' OFF'}
                          </p>
                          {formattedExpiry && (
                            <p className="text-[#6B7280] text-[11px] font-bold mt-1.5 uppercase tracking-wider">
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
                              className="h-9 rounded-full text-[12px] font-bold uppercase tracking-wider bg-transparent border-gray-300 text-gray-500 px-4"
                            >
                              Not Eligible
                            </Button>
                          ) : isApplied ? (
                            <Button 
                              variant="outline" 
                              className="h-9 rounded-full text-[12px] font-bold uppercase tracking-wider bg-[#22C55E] hover:bg-[#22C55E] border-transparent text-white px-4 gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Applied
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => applyOffer(coupon._id)}
                              disabled={applying}
                              className="h-9 rounded-[12px] text-[13px] font-bold uppercase tracking-wider bg-[#FF6B00] hover:bg-[#FF7A1A] text-white px-5 shadow-[0_2px_8px_rgba(255,107,0,0.2)] disabled:opacity-50 border-0"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
