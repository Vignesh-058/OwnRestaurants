import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
 Pending: {
 label: 'Pending',
 className: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
 },
 Confirmed: {
 label: 'Confirmed',
 className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
 },
 Preparing: {
 label: 'Preparing',
 className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100',
 },
 Ready: {
 label: 'Ready',
 className: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100',
 },
 'Out For Delivery': {
 label: 'Out For Delivery',
 className: 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
 },
 Delivered: {
 label: 'Delivered',
 className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
 },
 Cancelled: {
 label: 'Cancelled',
 className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
 },
};

interface OrderStatusBadgeProps {
 status: OrderStatus | string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
 const config = statusConfig[status as OrderStatus] ?? {
 label: status,
 className: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100',
 };

 return (
 <Badge
 variant="outline"
 className={`rounded-full font-semibold px-3 py-1 text-xs border ${config.className}`}
 >
 {config.label}
 </Badge>
 );
};
