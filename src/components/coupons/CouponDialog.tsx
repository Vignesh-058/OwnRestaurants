import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCoupons } from '@/hooks/queries/useCoupons';
import { CouponList } from './CouponList';
import { CouponSkeleton } from './CouponSkeleton';
import { EmptyCoupons } from './EmptyCoupons';
import { Tag, RefreshCw, Gift } from 'lucide-react';
import { useCouponStore } from '@/store/CouponStore';
import { useState } from 'react';

export const CouponDialog = () => {
 const [open, setOpen] = useState(false);
 const { data: coupons, isLoading, isError, refetch } = useCoupons();
 const { appliedCouponCode } = useCouponStore();

 return (
 <Dialog open={open} onOpenChange={setOpen}>
 <DialogTrigger asChild>
 <Button
 variant="outline"
 className={`w-full rounded-2xl h-12 font-bold gap-2 border-dashed transition-all ${
 appliedCouponCode
 ? 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
 : 'border-primary/40 text-primary hover:bg-primary/5'
 }`}
 >
 <Tag className="h-4 w-4" />
 {appliedCouponCode ? `Coupon: ${appliedCouponCode}` : 'View All Coupons & Offers'}
 <Gift className="h-4 w-4 ml-auto opacity-50" />
 </Button>
 </DialogTrigger>
 <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-3xl p-0">
 <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-t-3xl">
 <DialogHeader>
 <DialogTitle className="text-xl font-black flex items-center gap-2">
 <Gift className="h-5 w-5 text-primary" />
 Coupons & Offers
 </DialogTitle>
 <p className="text-sm text-muted-foreground">
 {coupons?.length ? `${coupons.length} offer${coupons.length > 1 ? 's' : ''} available` : 'Browse available offers'}
 </p>
 </DialogHeader>
 </div>

 <div className="p-6">
 {isLoading ? (
 <CouponSkeleton />
 ) : isError ? (
 <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
 <p className="text-muted-foreground">Failed to load coupons.</p>
 <Button variant="outline" onClick={() => refetch()} className="rounded-full gap-2">
 <RefreshCw className="h-4 w-4" /> Try Again
 </Button>
 </div>
 ) : !coupons?.length ? (
 <EmptyCoupons />
 ) : (
 <CouponList coupons={coupons} />
 )}
 </div>
 </DialogContent>
 </Dialog>
 );
};
