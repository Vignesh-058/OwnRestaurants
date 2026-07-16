import { useMemo, memo } from 'react';
import type { Coupon } from '@/types/coupon.types';
import { CouponBadge } from './CouponBadge';
import { Button } from '@/components/ui/button';
import { Loader2, Tag, Calendar, ShoppingBag, TrendingDown, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useCouponStore } from '@/store/CouponStore';

interface CouponCardProps {
 coupon: Coupon;
 onApply: (coupon: Coupon) => void;
 isApplying?: boolean;
}

const GRADIENT_POOL = [
 'from-violet-500 via-purple-500 to-indigo-500',
 'from-rose-500 via-pink-500 to-fuchsia-500',
 'from-primary via-orange-500 to-amber-500',
 'from-orange-500 via-amber-500 to-yellow-500',
 'from-emerald-500 via-green-500 to-lime-500',
 'from-slate-600 via-zinc-600 to-stone-600',
];

const hashCode = (s: string) => s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);

export const CouponCard = memo(({ coupon, onApply, isApplying }: CouponCardProps) => {
 const [copied, setCopied] = useState(false);
 const { appliedCouponCode } = useCouponStore();

 const isApplied = appliedCouponCode === coupon.code;

 const gradient = useMemo(() => {
 const idx = Math.abs(hashCode(coupon._id ?? coupon.code)) % GRADIENT_POOL.length;
 return GRADIENT_POOL[idx];
 }, [coupon._id, coupon.code]);

 const expiry = coupon.expiryDate ?? coupon.validTill;
 const isExpired = expiry ? new Date(expiry) < new Date() : false;

 const displayStatus = isApplied ? 'Applied' : isExpired ? 'Expired' : coupon.status ?? 'Available';

 const discountLabel =
 coupon.discountType === 'Percentage' || coupon.discountType?.toLowerCase().includes('percent')
 ? `${coupon.discountValue}% OFF`
 : `₹${coupon.discountValue} OFF`;

 const handleCopy = () => {
 navigator.clipboard.writeText(coupon.code);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className={`rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 group ${isExpired ? 'opacity-60' : ''}`}>
 {/* Gradient header */}
 <div className={`bg-gradient-to-r ${gradient} p-5 relative overflow-hidden`}>
 {/* Decorative circles */}
 <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />
 <div className="absolute -right-2 -bottom-10 h-20 w-20 rounded-full bg-white/10" />

 <div className="relative z-10">
 <div className="flex items-start justify-between mb-3">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="font-black text-white text-2xl tracking-tight">{discountLabel}</span>
 </div>
 <CouponBadge status={displayStatus} />
 </div>
 <button
 onClick={handleCopy}
 className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
 title="Copy code"
 >
 {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
 </button>
 </div>

 {/* Dashed code badge */}
 <div className="inline-flex items-center gap-2 border-2 border-dashed border-white/50 rounded-xl px-3 py-1.5 bg-white/10">
 <Tag className="h-3.5 w-3.5 text-white" />
 <span className="font-black text-white text-sm tracking-widest">{coupon.code}</span>
 </div>
 </div>
 </div>

 {/* Card body */}
 <div className="bg-card p-5">
 {coupon.name && (
 <h4 className="font-bold text-foreground text-base mb-1">{coupon.name}</h4>
 )}
 {coupon.description && (
 <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{coupon.description}</p>
 )}

 {/* Meta info */}
 <div className="space-y-2 mb-5">
 {coupon.minOrderAmount && (
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 <ShoppingBag className="h-3.5 w-3.5 text-primary/60" />
 <span>Min. order: <strong className="text-foreground">₹{coupon.minOrderAmount}</strong></span>
 </div>
 )}
 {(coupon.maxDiscount || coupon.maxDiscountAmount) && (
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 <TrendingDown className="h-3.5 w-3.5 text-primary/60" />
 <span>Max. discount: <strong className="text-foreground">₹{coupon.maxDiscount ?? coupon.maxDiscountAmount}</strong></span>
 </div>
 )}
 {expiry && !isExpired && (
 <div className="flex items-center gap-2 text-xs text-muted-foreground">
 <Calendar className="h-3.5 w-3.5 text-amber-500" />
 <span>Valid till: <strong className="text-foreground">{new Date(expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong></span>
 </div>
 )}
 {isExpired && (
 <div className="flex items-center gap-2 text-xs text-red-500">
 <Calendar className="h-3.5 w-3.5" />
 <span>Expired on {new Date(expiry!).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
 </div>
 )}
 </div>

 <Button
 className={`w-full rounded-full font-bold transition-all duration-300 ${isApplied ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
 disabled={isExpired || isApplied || isApplying}
 onClick={() => !isApplied && !isExpired && onApply(coupon)}
 >
 {isApplying ? (
 <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Applying...</>
 ) : isApplied ? (
 <><Check className="h-4 w-4 mr-2" /> Applied</>
 ) : isExpired ? (
 'Expired'
 ) : (
 'Apply Coupon'
 )}
 </Button>
 </div>
 </div>
 );
});

CouponCard.displayName = 'CouponCard';
