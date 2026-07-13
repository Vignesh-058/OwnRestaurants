import { useCouponStore } from '@/store/CouponStore';
import { Button } from '@/components/ui/button';
import { Tag, X, Sparkles } from 'lucide-react';

import { useQueryClient } from '@tanstack/react-query';

export const AppliedCoupon = () => {
 const { appliedCouponCode, discountAmount, discountedTotal, clearCoupon } = useCouponStore();
 const queryClient = useQueryClient();

 if (!appliedCouponCode) return null;

 const handleRemove = () => {
 clearCoupon();
 queryClient.invalidateQueries({ queryKey: ['cart'] });
 };

 return (
 <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
 {/* Animated shimmer stripe */}
 <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

 <div className="flex items-start justify-between gap-3">
 <div className="flex items-start gap-3">
 <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
 <Sparkles className="h-4 w-4 text-emerald-600" />
 </div>
 <div>
 <div className="flex items-center gap-2 mb-0.5">
 <Tag className="h-3.5 w-3.5 text-emerald-600" />
 <span className="font-black text-sm text-emerald-700 tracking-wider">{appliedCouponCode}</span>
 <span className="text-xs bg-emerald-200 text-emerald-700 rounded-full px-2 py-0.5 font-bold">Applied</span>
 </div>
 <p className="text-emerald-700 font-bold text-sm">
 You save ₹{discountAmount.toLocaleString()}!
 </p>
 {discountedTotal !== null && (
 <p className="text-xs text-emerald-600 mt-0.5">
 New total: <span className="font-black">₹{discountedTotal.toLocaleString()}</span>
 </p>
 )}
 </div>
 </div>

 <Button
 variant="ghost"
 size="icon"
 className="h-7 w-7 rounded-full shrink-0 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800"
 onClick={handleRemove}
 >
 <X className="h-4 w-4" />
 </Button>
 </div>
 </div>
 );
};
