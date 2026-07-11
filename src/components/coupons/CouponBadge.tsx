import { Badge } from '@/components/ui/badge';
import type { CouponStatus } from '@/types/coupon.types';

const config: Record<CouponStatus, { label: string; className: string }> = {
 Available: { label: 'Available', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
 Applied: { label: 'Applied ✓', className: 'bg-blue-100 text-blue-700 border-blue-200' },
 Expired: { label: 'Expired', className: 'bg-red-100 text-red-700 border-red-200' },
 Used: { label: 'Used', className: 'bg-gray-100 text-gray-600 border-gray-200' },
 Disabled: { label: 'Disabled', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

interface CouponBadgeProps { status?: CouponStatus | string; }

export const CouponBadge = ({ status = 'Available' }: CouponBadgeProps) => {
 const c = config[status as CouponStatus] ?? config.Available;
 return (
 <Badge variant="outline" className={`rounded-full font-semibold px-3 py-0.5 text-xs border ${c.className}`}>
 {c.label}
 </Badge>
 );
};
