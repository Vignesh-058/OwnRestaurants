import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tag, Calendar, ShoppingBag, TrendingDown, Info, Loader2, Check } from 'lucide-react';
import type { Coupon } from '@/types/coupon.types';
import { useCouponStore } from '@/store/CouponStore';
import { CouponBadge } from './CouponBadge';

interface CouponDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon | null;
  onApply: (coupon: Coupon) => void;
  isApplying: boolean;
}

export const CouponDetailsDialog = ({
  open,
  onOpenChange,
  coupon,
  onApply,
  isApplying,
}: CouponDetailsDialogProps) => {
  const { appliedCouponCode } = useCouponStore();

  if (!coupon) return null;

  const isApplied = appliedCouponCode === coupon.code;
  const expiry = coupon.expiryDate ?? coupon.validTill;
  const isExpired = expiry ? new Date(expiry) < new Date() : false;
  const displayStatus = isApplied ? 'Applied' : isExpired ? 'Expired' : coupon.status ?? 'Available';

  const discountLabel =
    coupon.discountType === 'Percentage' || coupon.discountType?.toLowerCase().includes('percent')
      ? `${coupon.discountValue}% OFF`
      : `₹${coupon.discountValue} OFF`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-[24px] p-0 overflow-hidden bg-[#FFFFFF] border-[#FFE2CC]">
        <DialogHeader className="p-6 pb-4 bg-[#FAF8F5] border-b border-[#FFE2CC] relative overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 bg-[#FF6B00]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border-2 border-dashed border-[#FF6B00]/40 rounded-xl px-3 py-1.5 bg-[#FFF4EB] mb-3">
                <Tag className="h-4 w-4 text-[#FF6B00]" />
                <span className="font-black text-[#FF6B00] text-sm tracking-widest uppercase">{coupon.code}</span>
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight text-[#1F2937]">
                {discountLabel}
              </DialogTitle>
              {coupon.name && <p className="font-bold text-[#1F2937] text-md mt-1">{coupon.name}</p>}
            </div>
            <CouponBadge status={displayStatus} />
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {coupon.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                <Info className="h-4 w-4 text-[#FF6B00]" /> Description
              </h4>
              <p className="text-sm text-[#6B7280] leading-relaxed">{coupon.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {coupon.minOrderAmount && (
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#FFE2CC]">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="h-4 w-4 text-[#FF6B00]" />
                  <span className="text-xs font-semibold text-[#6B7280]">Min. Order</span>
                </div>
                <p className="text-lg font-black text-[#1F2937]">₹{coupon.minOrderAmount}</p>
              </div>
            )}
            
            {(coupon.maxDiscount || coupon.maxDiscountAmount) && (
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#FFE2CC]">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="h-4 w-4 text-[#FF6B00]" />
                  <span className="text-xs font-semibold text-[#6B7280]">Max Discount</span>
                </div>
                <p className="text-lg font-black text-[#1F2937]">₹{coupon.maxDiscount ?? coupon.maxDiscountAmount}</p>
              </div>
            )}
          </div>

          {expiry && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <Calendar className={`h-5 w-5 ${isExpired ? 'text-red-500' : 'text-amber-500'}`} />
              </div>
              <div>
                <p className={`text-sm font-bold ${isExpired ? 'text-red-700' : 'text-amber-700'}`}>
                  {isExpired ? 'Expired' : 'Validity'}
                </p>
                <p className={`text-xs ${isExpired ? 'text-red-600' : 'text-amber-600'}`}>
                  {isExpired ? 'Expired on' : 'Valid until'} {new Date(expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          {coupon.termsAndConditions && coupon.termsAndConditions.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#FFE2CC]">
              <h4 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Terms & Conditions</h4>
              <ul className="space-y-2">
                {coupon.termsAndConditions.map((term: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6B7280]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] mt-2 shrink-0" />
                    <span className="leading-relaxed">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-[#FFE2CC] bg-[#FAF8F5]">
          <Button
            className={`w-full rounded-xl h-12 font-bold shadow-md transition-all duration-300 ${
              isApplied 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20' 
                : 'bg-[#FF6B00] hover:bg-[#FF7A1A] text-white shadow-[#FF6B00]/20'
            }`}
            disabled={isExpired || isApplied || isApplying}
            onClick={() => {
              if (!isApplied && !isExpired) {
                onApply(coupon);
              }
            }}
          >
            {isApplying ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Applying...</>
            ) : isApplied ? (
              <><Check className="h-5 w-5 mr-2" /> Applied to Cart</>
            ) : isExpired ? (
              'Coupon Expired'
            ) : (
              'Apply Coupon'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
