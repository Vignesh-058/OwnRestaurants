import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
 orderReceived: { label: 'Order Received', className: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100' },
 orderPlaced: { label: 'Order Placed', className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100' },
 preparing: { label: 'Preparing', className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100' },
 Ready: { label: 'Ready', className: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100' },
 outForDelivery: { label: 'Out For Delivery', className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' },
 delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' },
 orderCancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
 
 // Legacy fallbacks
 Pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100' },
 Confirmed: { label: 'Confirmed', className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100' },
 Preparing: { label: 'Preparing', className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100' },
 'Out For Delivery': { label: 'Out For Delivery', className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100' },
 Delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' },
 Cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100' },
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
