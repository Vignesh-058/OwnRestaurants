import { Badge } from '@/components/ui/badge';
import type { OrderStatus } from '@/types/order.types';

const statusConfig: Record<string, { label: string; className: string }> = {
 orderReceived: { label: 'Order Received', className: 'bg-accent text-primary border-accent' },
 orderPlaced: { label: 'Order Placed', className: 'bg-accent text-primary border-accent' },
 preparing: { label: 'Preparing', className: 'bg-blue-50 text-blue-600 border-blue-200' },
 Ready: { label: 'Ready', className: 'bg-purple-50 text-purple-600 border-purple-200' },
 outForDelivery: { label: 'Out For Delivery', className: 'bg-purple-50 text-purple-600 border-purple-200' },
 delivered: { label: 'Delivered', className: 'bg-green-50 text-green-600 border-green-200' },
 orderCancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-200' },
 
 // Legacy fallbacks
 Pending: { label: 'Pending', className: 'bg-accent text-primary border-accent' },
 Confirmed: { label: 'Confirmed', className: 'bg-accent text-primary border-accent' },
 Preparing: { label: 'Preparing', className: 'bg-blue-50 text-blue-600 border-blue-200' },
 'Out For Delivery': { label: 'Out For Delivery', className: 'bg-purple-50 text-purple-600 border-purple-200' },
 Delivered: { label: 'Delivered', className: 'bg-green-50 text-green-600 border-green-200' },
 Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border-red-200' },
};

interface OrderStatusBadgeProps {
 status: OrderStatus | string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
 const config = statusConfig[status] ?? {
 label: status,
 className: 'bg-gray-100 text-gray-700 border-gray-200',
 };

 return (
 <Badge
 variant="outline"
 className={`rounded-full font-bold px-3 py-1.5 text-[12px] uppercase tracking-wider border ${config.className}`}
 >
 {config.label}
 </Badge>
 );
};
