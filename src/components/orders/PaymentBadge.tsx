import { Badge } from '@/components/ui/badge';
import type { PaymentStatus, PaymentMode } from '@/types/order.types';

interface PaymentBadgeProps {
 paymentStatus?: PaymentStatus | string;
 paymentMode?: PaymentMode | string;
}

export const PaymentBadge = ({ paymentStatus, paymentMode }: PaymentBadgeProps) => {
 const getStatusBadge = () => {
 switch (paymentStatus?.toLowerCase()) {
 case 'paid':
 return <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-semibold text-xs px-3">Paid</Badge>;
 case 'unpaid':
 return <Badge variant="outline" className="rounded-full bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 font-semibold text-xs px-3">Unpaid</Badge>;
 case 'failed':
 return <Badge variant="outline" className="rounded-full bg-red-50 text-red-700 border-red-200 hover:bg-red-50 font-semibold text-xs px-3">Failed</Badge>;
 default:
 return paymentStatus ? <Badge variant="outline" className="rounded-full bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50 font-semibold text-xs px-3">{paymentStatus}</Badge> : null;
 }
 };

 const getModeBadge = () => {
 switch (paymentMode) {
 case 'COD':
 return <Badge variant="outline" className="rounded-full bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 font-semibold text-xs px-3">COD</Badge>;
 case 'Online':
 case 'UPI':
 case 'Card':
 return <Badge variant="outline" className="rounded-full bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 font-semibold text-xs px-3">{paymentMode}</Badge>;
 default:
 return paymentMode ? <Badge variant="outline" className="rounded-full bg-gray-50 text-gray-700 border-gray-200 font-semibold text-xs px-3">{paymentMode}</Badge> : null;
 }
 };

 return (
 <div className="flex items-center gap-2 flex-wrap">
 {getStatusBadge()}
 {getModeBadge()}
 </div>
 );
};
