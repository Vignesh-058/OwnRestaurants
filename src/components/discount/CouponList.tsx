import { useMemo, useState } from 'react';
import type { Coupon } from '@/types/coupon.types';
import { CouponCard } from './CouponCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useApplyCoupon } from '@/hooks/mutations/useApplyCoupon';

interface CouponListProps {
 coupons: Coupon[];
}

export const CouponList = ({ coupons }: CouponListProps) => {
 const [search, setSearch] = useState('');
 const { mutate: applyCoupon, isPending } = useApplyCoupon();

 const filtered = useMemo(() => {
 if (!search.trim()) return coupons;
 const q = search.toLowerCase();
 return coupons.filter(
 (c) =>
 c.code.toLowerCase().includes(q) ||
 c.name?.toLowerCase().includes(q) ||
 c.description?.toLowerCase().includes(q)
 );
 }, [coupons, search]);

 return (
 <div className="space-y-6">
 {/* Search */}
 <div className="relative max-w-md">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search coupons or codes..."
 className="pl-11 rounded-full h-12 bg-white border-transparent focus-visible:ring-1"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>

 {filtered.length === 0 ? (
 <p className="text-muted-foreground text-center py-12">No coupons match your search.</p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
 {filtered.map((coupon) => (
 <CouponCard
 key={coupon._id ?? coupon.code}
 coupon={coupon}
 onApply={(c) => applyCoupon({ code: c.code, discountId: c._id })}
 isApplying={isPending}
 />
 ))}
 </div>
 )}
 </div>
 );
};
